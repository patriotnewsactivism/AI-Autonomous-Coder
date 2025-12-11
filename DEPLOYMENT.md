# 🚀 Deployment Guide

This guide covers multiple deployment options for the AI Autonomous Agent System.

## 📋 Prerequisites

- Git repository access
- API keys for AI providers (Gemini, Claude, OpenAI)
- Domain name (optional)
- GitHub account

## 🌐 Deployment Options

### 1. Vercel (Recommended)

**Best for**: Production deployment, automatic HTTPS, global CDN

#### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-autonomous-agent-system)

#### Manual Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
VERCEL_URL=https://your-app.vercel.app
```

#### Environment Variables
Set these in your Vercel dashboard:
- `GEMINI_API_KEY` - Your Google Gemini API key
- `CLAUDE_API_KEY` - Your Anthropic Claude API key (optional)
- `OPENAI_API_KEY` - Your OpenAI API key (optional)

### 2. Netlify

**Best for**: Static sites, form handling, serverless functions

#### Quick Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/ai-autonomous-agent-system)

#### Manual Deploy
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### 3. GitHub Pages

**Best for**: Free hosting, simple setup

#### Setup
1. Go to repository Settings
2. Scroll to "Pages" section
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Save

Your site will be available at: `https://yourusername.github.io/ai-autonomous-agent-system`

### 4. Firebase Hosting

**Best for**: Google ecosystem integration

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

### 5. AWS S3 + CloudFront

**Best for**: Enterprise, custom domains, advanced caching

```bash
# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://your-bucket-name

# Upload files
aws s3 sync . s3://your-bucket-name --exclude "node_modules/*"

# Set up CloudFront distribution
# (Use AWS Console for CloudFront setup)
```

### 6. Docker Deployment

**Best for**: Containerized environments, Kubernetes

#### Dockerfile (included in repo)
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

#### Build & Run Locally
```bash
# Build image (uses .dockerignore to skip dev files)
docker build -t ai-agent-system .

# Run container on port 8080
docker run -p 8080:8080 ai-agent-system
```

### 7. Google Cloud Run (with Cloud Build)

**Best for**: Serverless containers on Google Cloud

#### Prerequisites
- Enable the Cloud Run and Cloud Build APIs
- Install and authenticate the Google Cloud CLI (`gcloud auth login` and `gcloud config set project <PROJECT_ID>`)

#### Deploy with Cloud Build
```bash
# Submit build using the provided cloudbuild.yaml
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=_SERVICE_NAME=ai-autonomous-coder,_REGION=us-central1

# The build will:
# 1) Build and push gcr.io/$PROJECT_ID/${_SERVICE_NAME}
# 2) Deploy it to Cloud Run in the specified region
```

> The Dockerfile and nginx.conf in the repository are configured to listen on port 8080 and to serve the SPA with `try_files` routing for client-side navigation.

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

---

**Ready to deploy? Choose your preferred platform and follow the steps above!** 🚀
