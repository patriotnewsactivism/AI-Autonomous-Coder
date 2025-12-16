# 🚀 Deployment Guide

This guide provides step-by-step deployment, rollback, and environment setup instructions for the AI Autonomous Agent System across the supported hosting options.

## 📋 Prerequisites

- Git repository access
- API keys for AI providers (Gemini, Claude, OpenAI)
- Domain name (optional)
- GitHub account
- Local tooling: `node`/`npm`, Docker (for container builds), and the relevant platform CLI (Vercel/Netlify/Firebase/GCloud/AWS) installed

## 🧰 Environment Setup (Local and CI)

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create `.env.local` for local testing (not committed)**
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   CLAUDE_API_KEY=your_claude_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   APP_URL=http://localhost:8080
   ENVIRONMENT=development
   DEBUG=false
   ```
3. **Sanity check**
   ```bash
   npm run lint || true   # lint is optional for static site but ensures HTML/JS quality
   npm run build || true  # if a build step exists
   ```
4. **Configure CI secrets**
   - Add `GEMINI_API_KEY`, `CLAUDE_API_KEY`, `OPENAI_API_KEY` to the platform’s secret store (GitHub Actions, Vercel, Netlify, Cloud Build, etc.).
   - Never commit keys; prefer short-lived tokens where possible.
5. **Verify production variables**
   - Ensure production variables match the intended environment (e.g., staging vs prod keys).

## 🌐 Deployment Options (Step-by-Step)

### 1) Vercel (Recommended)

**Use when:** You want automatic HTTPS, preview deployments, and global CDN.

1. Install CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Link project (one time): `vercel link`
4. Set env vars in the Vercel dashboard or via CLI:
   ```bash
   vercel env add GEMINI_API_KEY
   vercel env add CLAUDE_API_KEY
   vercel env add OPENAI_API_KEY
   ```
5. Deploy production: `vercel --prod`
6. Verify: open the provided URL and test voice input + AI providers.

**Rollback (Vercel)**  
- Run `vercel ls` to view previous deployments.  
- Promote a previous deployment: `vercel rollback <deployment-url>` or redeploy the last known good commit with `vercel --prod --archive <deployment-id>`.
- Verify after rollback and revoke any leaked keys if the rollback was triggered by security issues.

### 2) Netlify

**Use when:** You prefer Netlify’s CDN and form handling.

1. Install CLI: `npm i -g netlify-cli`
2. Login: `netlify login`
3. Initialize (one time): `netlify init`
4. Set env vars (UI or CLI):
   ```bash
   netlify env:set GEMINI_API_KEY ****
   netlify env:set CLAUDE_API_KEY ****
   netlify env:set OPENAI_API_KEY ****
   ```
5. Deploy: `netlify deploy --prod`
6. Verify site and PWA install flow.

**Rollback (Netlify)**  
- In the Netlify dashboard, select a previous deploy and click **Restore deploy**.  
- Alternatively, redeploy the last good commit: `netlify deploy --prod --dir=.` (after checking out the commit).  
- Re-run smoke tests (landing page load, voice button, provider selection).

### 3) GitHub Pages

**Use when:** You need a free, simple static hosting option.

1. Push to `main`.
2. In GitHub repo **Settings → Pages**, select **Deploy from a branch**, choose `main` and `/ (root)`.
3. Save and wait for the Pages build to finish.
4. Verify via the published URL.

**Rollback (GitHub Pages)**  
- Revert the offending commit locally and push to `main`.  
- Wait for the Pages workflow to republish.

### 4) Firebase Hosting

**Use when:** You want Firebase ecosystem integration (Auth/Firestore extensions later).

1. Install CLI: `npm i -g firebase-tools`
2. Login: `firebase login`
3. Select project: `firebase use --add` (choose or create one in the console)
4. Deploy hosting: `firebase deploy --only hosting`
5. Verify at the provided hosting URL.

**Rollback (Firebase Hosting)**  
- Use versioned releases: `firebase hosting:channel:deploy rollback-<timestamp>` for a temporary rollback channel, then promote if stable with `firebase hosting:clone <project-id>:rollback-<timestamp> <project-id>:live`.
- Alternatively, redeploy the last good commit using `firebase deploy --only hosting` after checking out the known-good revision.

### 5) AWS S3 + CloudFront

**Use when:** You need enterprise controls and custom caching.

1. Configure AWS CLI: `aws configure`
2. Create bucket: `aws s3 mb s3://your-bucket-name`
3. Sync site: `aws s3 sync . s3://your-bucket-name --exclude "node_modules/*"`
4. Create/attach CloudFront distribution pointing at the bucket.
5. Invalidate cache after changes:
   ```bash
   aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
   ```

**Rollback (S3/CloudFront)**  
- Restore previous versioned objects if versioning is enabled:
  ```bash
  aws s3 cp s3://your-bucket-name/path/to/object --version-id <VERSION_ID> s3://your-bucket-name/path/to/object
  aws cloudfront create-invalidation --distribution-id <DIST_ID> --paths "/*"
  ```
- If versioning is not enabled, re-sync from the last known good build artifact.

### 6) Docker Deployment

**Use when:** You target Kubernetes or need parity between environments.

Dockerfile (included in repo):
```dockerfile
# Use a lightweight Nginx image to serve the static site
FROM nginx:1.27-alpine

# Replace the default server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets
COPY . /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

**Build & Run Locally**
```bash
docker build -t ai-agent-system .
docker run -p 8080:8080 ai-agent-system
```

**Deploy to your registry**
```bash
docker tag ai-agent-system <registry>/<project>/ai-agent-system:$(git rev-parse --short HEAD)
docker push <registry>/<project>/ai-agent-system:$(git rev-parse --short HEAD)
```

**Rollback (Containers/Kubernetes)**
- In Kubernetes: update the deployment image to the previous tag and apply:
  ```bash
  kubectl set image deployment/ai-agent web=<registry>/<project>/ai-agent-system:<prev-tag>
  kubectl rollout status deployment/ai-agent
  ```
- For plain Docker hosts: stop the current container and start the previous tag.

### 7) Google Cloud Run (with Cloud Build)

**Use when:** You want serverless containers with autoscaling on Google Cloud.

Prerequisites:
- Enable Cloud Run and Cloud Build APIs
- Authenticate: `gcloud auth login` and `gcloud config set project <PROJECT_ID>`

**Deploy with Cloud Build**
```bash
# Submit build using the provided cloudbuild.yaml
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_SERVICE_NAME=ai-autonomous-coder,_REGION=us-central1

# The build will:
# 1) Build and push gcr.io/$PROJECT_ID/${_SERVICE_NAME}
# 2) Deploy it to Cloud Run in the specified region
```

**Rollback (Cloud Run)**
- List revisions: `gcloud run revisions list --service ai-autonomous-coder`
- Route 100% traffic to a stable revision:
  ```bash
  gcloud run services update-traffic ai-autonomous-coder --to-revisions <rev>=100
  ```
- If the issue is image-related, redeploy the previous image digest with the same command used above but substituting the digest.

> Notes:
> - The Cloud Build config sets `options.logging` to `CLOUD_LOGGING_ONLY` so you can view logs in Cloud Logging even when specifying a custom build service account.
> - The Dockerfile and nginx.conf are configured to listen on port 8080 and to serve the SPA with `try_files` routing for client-side navigation.

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```env
# AI Provider API Keys
GEMINI_API_KEY=your_gemini_api_key_here
CLAUDE_API_KEY=your_claude_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Application Settings
APP_URL=https://your-domain.com
ENVIRONMENT=production
DEBUG=false

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### Custom Domain Setup

1. **Purchase domain** from your preferred registrar
2. **Configure DNS**:
   - Add CNAME record pointing to your deployment URL
   - Or add A record with deployment IP
3. **Update deployment settings** with custom domain
4. **Enable HTTPS** (automatic with most platforms)

## 📊 Monitoring & Analytics

### Google Analytics
Add your GA tracking ID to monitor usage:

```html
<!-- Add to index.html head section -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking
Consider adding Sentry for error monitoring:

```html
<script src="https://browser.sentry-cdn.com/7.0.0/bundle.min.js"></script>
<script>
  Sentry.init({ dsn: 'YOUR_SENTRY_DSN' });
</script>
```

## 🔒 Security Considerations

### API Key Security
- Never commit API keys to repository
- Use environment variables for all secrets
- Rotate keys regularly
- Monitor usage for anomalies

### HTTPS
- Always use HTTPS in production
- Most deployment platforms provide free SSL certificates
- Redirect HTTP to HTTPS

### Content Security Policy
Add CSP headers to prevent XSS attacks:

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## 🚀 Performance Optimization

### Caching
- Enable browser caching for static assets
- Use CDN for global distribution
- Implement service worker for offline functionality

### Compression
- Enable gzip compression
- Optimize images and assets
- Minify CSS and JavaScript

### Monitoring
- Set up uptime monitoring
- Monitor API usage and costs
- Track user engagement metrics

## 🔄 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📱 PWA Deployment

The app is already configured as a PWA with:
- Service worker for offline functionality
- Web app manifest for installation
- Responsive design for all devices

Users can install it on their devices like a native app.

## 🆘 Troubleshooting

### Common Issues

1. **API Keys Not Working**
   - Check environment variables are set correctly
   - Verify API keys are valid and have proper permissions
   - Check browser console for errors

2. **Voice Recognition Not Working**
   - Ensure HTTPS is enabled (required for microphone access)
   - Check browser permissions for microphone
   - Test in different browsers

3. **GitHub Integration Issues**
   - Verify GitHub token has correct scopes
   - Check repository permissions
   - Ensure repository format is correct (owner/repo)

4. **Performance Issues**
   - Check network connectivity
   - Monitor API response times
   - Consider upgrading to paid tiers for better performance

### Support
- Check the [Issues](https://github.com/yourusername/ai-autonomous-agent-system/issues) page
- Create a new issue with detailed description
- Include browser console logs and steps to reproduce

## 📈 Scaling Considerations

### High Traffic
- Use CDN for static assets
- Implement rate limiting
- Consider serverless functions for API calls
- Monitor costs and usage

### Enterprise Deployment
- White-label customization
- Custom domain and branding
- Advanced analytics and reporting
- Dedicated support channels

## 🧭 Runbooks (Common Tasks)

### Rotate Secrets (All Platforms)
1. Identify the impacted secret (e.g., `GEMINI_API_KEY`).
2. Generate a new key in the provider console.
3. Update secrets in:
   - CI/CD secret store (GitHub Actions, Cloud Build, etc.)
   - Hosting platform (Vercel/Netlify/Firebase/AWS/GCP)
4. Redeploy from a clean workspace to ensure no stale cache:
   ```bash
   npm run build || true
   vercel --prod # or equivalent command per platform
   ```
5. Invalidate caches/CDN where applicable (CloudFront, Firebase Hosting cache).
6. Revoke the old key in the provider console and note the rotation date.

### Recover from a Failed Deploy
1. **Detect**: Check deployment logs (Vercel/Netlify dashboards, `gcloud builds log`, `firebase deploy` output, `aws cloudfront` invalidation status).
2. **Contain**: If production is degraded, execute the platform-specific rollback procedure (see rollback steps above).
3. **Diagnose**:
   - Review build logs and console errors.
   - Validate environment variables and CSP headers.
   - Confirm assets were uploaded (e.g., `aws s3 ls s3://bucket` or Firebase Hosting versions).
4. **Fix**: Patch the issue locally and run smoke tests:
   ```bash
   npm run lint || true
   npm run build || true
   npm test || true
   ```
5. **Redeploy**: Push the fix and redeploy using the normal flow for your platform.
6. **Verify**: Perform smoke tests (home page load, mic button, provider selection, PWA install).
7. **Document**: Record root cause, rollback time, and fix in your incident log.

---

**Ready to deploy? Choose your preferred platform and follow the steps above!** 🚀
