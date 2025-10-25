# AI Worker Plus

A fully-featured AI-powered coding assistant Progressive Web App (PWA) with GitHub integration and autopilot mode.

## 🚀 Features

- **AI-Powered Assistant**: Integrated with Google Gemini API for intelligent code assistance
- **Voice Commands**: Speak your requests using the microphone button
- **Autopilot Mode**: Enable autonomous task execution
- **GitHub Integration**: Connect and sync with your GitHub repositories
- **Progressive Web App**: Install on any device for offline access
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

## 📋 Prerequisites

- A Google Gemini API key (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))
- Optional: GitHub Personal Access Token for repository integration

## 🌐 Deploy to Vercel

### Quick Deploy

1. **Fork or Clone this repository**

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect the configuration from `vercel.json`
   - Click "Deploy"

3. **That's it!** Your app will be live in seconds.

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from the project directory
cd /workspace
vercel --prod
```

## 🔧 Configuration

After deployment, configure your app:

1. Open the deployed app
2. Click the ⚙️ (Settings) icon in the top right
3. Enter your configuration:
   - **AI Assistant Name**: Customize your assistant's name
   - **Gemini API Key**: Your Google Gemini API key
   - **GitHub Token** (optional): For repository integration
   - **GitHub Repo** (optional): Format: `username/repo`
   - **GitHub Branch** (optional): Default is `main`

Your configuration is saved locally in your browser.

## 🏗️ Project Structure

```
/workspace/
├── index.html          # Main application file
├── sw.js              # Service worker for PWA functionality
├── manifest.json      # PWA manifest
├── vercel.json        # Vercel deployment configuration
├── favicon.ico        # App favicon
├── icon-192.png       # PWA icon (192x192)
├── icon-192-maskable.png  # Maskable PWA icon
├── icon-512.png       # PWA icon (512x512)
├── debug.html         # Debug/test page for React
├── test.html          # Simple test page
└── README.md          # This file
```

## 🎯 Usage

1. **Start a Conversation**: Type your request in the input field at the bottom
2. **Use Voice Input**: Click the 🎤 microphone icon to speak your request
3. **Enable Autopilot**: Toggle the autopilot button to enable autonomous mode
4. **Quick Actions**: Use the sidebar (☰ menu) for quick action templates
5. **Install as PWA**: Click "Install Now" when prompted to add to your home screen

## 🔒 Security & Privacy

- All API keys are stored locally in your browser (localStorage)
- No data is sent to any server except the APIs you configure
- Service worker only caches local assets, not external API calls

## 🐛 Troubleshooting

### App not loading
- Check browser console for errors (F12)
- Ensure you have a stable internet connection
- Clear browser cache and reload

### API errors
- Verify your Gemini API key is correct
- Check your API quota at Google AI Studio
- Ensure your API key has the necessary permissions

### Service Worker issues
- Unregister old service workers in browser DevTools
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)

## 📱 PWA Installation

The app can be installed as a Progressive Web App on:
- **Desktop**: Chrome, Edge, Opera (look for install icon in address bar)
- **iOS**: Safari > Share > Add to Home Screen
- **Android**: Chrome > Menu > Install App

## 🛠️ Local Development

```bash
# Serve locally using Python
python3 -m http.server 8000

# Or using Node.js
npx serve .

# Then open http://localhost:8000
```

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

Made with ⚡ by the AI Worker Plus team