# 🔌 API Documentation

This document provides comprehensive API documentation for the AI Autonomous Agent System, including integration guides, endpoints, and usage examples.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [AI Provider APIs](#ai-provider-apis)
- [Voice Recognition API](#voice-recognition-api)
- [GitHub Integration API](#github-integration-api)
- [User Management API](#user-management-api)
- [Webhook Events](#webhook-events)
- [Rate Limits](#rate-limits)
- [Error Handling](#error-handling)
- [SDKs and Libraries](#sdks-and-libraries)

## 🌐 Overview

The AI Autonomous Agent System provides multiple APIs for different functionalities:

- **AI Provider APIs**: Direct integration with AI services
- **Voice Recognition**: Speech-to-text and text-to-speech
- **GitHub Integration**: Repository management and sync
- **User Management**: Account and subscription management
- **Webhook Events**: Real-time notifications

## 🔐 Authentication

### API Key Authentication
Most APIs require authentication via API keys:

```javascript
// Set API key in headers
const headers = {
  'Authorization': 'Bearer YOUR_API_KEY',
  'Content-Type': 'application/json'
};
```

### Provider-Specific Authentication

#### Google Gemini
```javascript
const geminiConfig = {
  apiKey: 'YOUR_GEMINI_API_KEY',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models'
};
```

#### Anthropic Claude
```javascript
const claudeConfig = {
  apiKey: 'YOUR_CLAUDE_API_KEY',
  endpoint: 'https://api.anthropic.com/v1/messages'
};
```

#### OpenAI GPT
```javascript
const openaiConfig = {
  apiKey: 'YOUR_OPENAI_API_KEY',
  endpoint: 'https://api.openai.com/v1/chat/completions'
};
```

## 🤖 AI Provider APIs

### Google Gemini API

#### Generate Content
```javascript
async function callGeminiAPI(prompt, systemPrompt = '') {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        role: 'user',
        parts: [{ text: systemPrompt + '\n\n' + prompt }]
      }]
    })
  });
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
```

#### Available Models
- `gemini-1.5-flash` - Fastest, free tier
- `gemini-1.5-pro` - Most capable, free tier

### Anthropic Claude API

#### Send Message
```javascript
async function callClaudeAPI(messages, systemPrompt = '') {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      system: systemPrompt,
      messages: messages
    })
  });
  
  const data = await response.json();
  return data.content[0].text;
}
```

#### Available Models
- `claude-3-sonnet-20240229` - Balanced performance
- `claude-3-opus-20240229` - Most capable
- `claude-3-haiku-20240307` - Fastest

### OpenAI GPT API

#### Chat Completion
```javascript
async function callOpenAIAPI(messages, systemPrompt = '') {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}
```

#### Available Models
- `gpt-4` - Most capable
- `gpt-4-turbo` - Faster GPT-4
- `gpt-3.5-turbo` - Cost-effective

## 🎤 Voice Recognition API

### Web Speech API

#### Speech Recognition
```javascript
// Initialize speech recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

// Start listening
recognition.start();

// Handle results
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  console.log('Recognized:', transcript);
};

// Handle errors
recognition.onerror = (event) => {
  console.error('Recognition error:', event.error);
};
```

#### Speech Synthesis
```javascript
// Speak text
function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}
```

### Voice Commands

#### Supported Commands
```javascript
const voiceCommands = {
  'create': 'Generate new code or components',
  'fix': 'Debug and fix issues',
  'test': 'Create tests',
  'document': 'Generate documentation',
  'analyze': 'Code analysis and review',
  'deploy': 'Deployment tasks',
  'refactor': 'Code refactoring'
};
```

## 🔗 GitHub Integration API

### Repository Operations

#### Get Repository Contents
```javascript
async function getRepoContents(owner, repo, token) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  return await response.json();
}
```

#### Create File
```javascript
async function createFile(owner, repo, path, content, token) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      message: 'Add new file via AI Agent',
      content: btoa(content) // Base64 encode
    })
  });
  
  return await response.json();
}
```

#### Update File
```javascript
async function updateFile(owner, repo, path, content, sha, token) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      message: 'Update file via AI Agent',
      content: btoa(content),
      sha: sha // Required for updates
    })
  });
  
  return await response.json();
}
```

### GitHub Webhooks

#### Webhook Events
```javascript
const webhookEvents = {
  'push': 'Code pushed to repository',
  'pull_request': 'Pull request created/updated',
  'issues': 'Issue created/updated',
  'commit_comment': 'Comment on commit'
};
```

#### Webhook Handler
```javascript
app.post('/webhook/github', (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;
  
  switch (event) {
    case 'push':
      handlePushEvent(payload);
      break;
    case 'pull_request':
      handlePullRequestEvent(payload);
      break;
    default:
      console.log('Unhandled event:', event);
  }
  
  res.status(200).send('OK');
});
```

## 👤 User Management API

### User Operations

#### Create User Account
```javascript
async function createUser(userData) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  return await response.json();
}
```

#### Update Subscription
```javascript
async function updateSubscription(userId, plan) {
  const response = await fetch(`/api/users/${userId}/subscription`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan })
  });
  
  return await response.json();
}
```

#### Get Usage Stats
```javascript
async function getUsageStats(userId) {
  const response = await fetch(`/api/users/${userId}/usage`);
  return await response.json();
}
```

### Subscription Plans

#### Plan Structure
```javascript
const subscriptionPlans = {
  free: {
    name: 'Free',
    price: 0,
    dailyTokens: 1000,
    features: ['Basic agents', 'Text only', 'Community support']
  },
  pro: {
    name: 'Pro',
    price: 19,
    dailyTokens: 50000,
    features: ['All agents', 'Voice control', 'GitHub integration', 'Priority support']
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    dailyTokens: 999999999,
    features: ['Unlimited tokens', 'Custom agents', 'Team collaboration', 'API access', 'Dedicated support']
  }
};
```

## 🔔 Webhook Events

### Event Types

#### Task Completion
```javascript
{
  "event": "task.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "taskId": "task_123",
    "agent": "CODE_GENERATOR",
    "result": "Generated React component...",
    "qualityScore": 8.5
  }
}
```

#### User Subscription Change
```javascript
{
  "event": "subscription.updated",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "userId": "user_456",
    "oldPlan": "free",
    "newPlan": "pro",
    "billingCycle": "monthly"
  }
}
```

#### Error Occurred
```javascript
{
  "event": "error.occurred",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "errorType": "API_LIMIT_EXCEEDED",
    "message": "Daily token limit reached",
    "userId": "user_456",
    "context": "task_execution"
  }
}
```

### Webhook Configuration
```javascript
const webhookConfig = {
  url: 'https://your-app.com/webhooks/ai-agent',
  events: ['task.completed', 'subscription.updated', 'error.occurred'],
  secret: 'your-webhook-secret'
};
```

## ⚡ Rate Limits

### AI Provider Limits

#### Google Gemini
- **Free Tier**: 15 requests per minute, 1M tokens per minute
- **Paid Tier**: 60 requests per minute, 2M tokens per minute

#### Anthropic Claude
- **Free Tier**: 5 requests per minute
- **Paid Tier**: 50 requests per minute

#### OpenAI GPT
- **Free Tier**: 3 requests per minute
- **Paid Tier**: 60 requests per minute

### Application Limits

#### User Tiers
```javascript
const rateLimits = {
  free: {
    requestsPerMinute: 10,
    dailyTokens: 1000,
    concurrentTasks: 1
  },
  pro: {
    requestsPerMinute: 50,
    dailyTokens: 50000,
    concurrentTasks: 5
  },
  enterprise: {
    requestsPerMinute: 200,
    dailyTokens: 999999999,
    concurrentTasks: 20
  }
};
```

## 🚨 Error Handling

### Error Response Format
```javascript
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Daily token limit reached",
    "details": {
      "limit": 1000,
      "used": 1000,
      "resetTime": "2024-01-16T00:00:00Z"
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Common Error Codes
```javascript
const errorCodes = {
  'INVALID_API_KEY': 'API key is invalid or expired',
  'RATE_LIMIT_EXCEEDED': 'Rate limit exceeded',
  'INSUFFICIENT_CREDITS': 'Insufficient credits for operation',
  'INVALID_REQUEST': 'Request format is invalid',
  'PROVIDER_ERROR': 'AI provider returned an error',
  'VOICE_NOT_SUPPORTED': 'Voice recognition not supported',
  'GITHUB_AUTH_FAILED': 'GitHub authentication failed',
  'TASK_FAILED': 'Task execution failed'
};
```

### Error Handling Example
```javascript
async function handleAPIError(response) {
  if (!response.ok) {
    const error = await response.json();
    
    switch (error.code) {
      case 'RATE_LIMIT_EXCEEDED':
        // Show upgrade prompt
        showUpgradePrompt();
        break;
      case 'INVALID_API_KEY':
        // Redirect to settings
        redirectToSettings();
        break;
      default:
        // Show generic error
        showError(error.message);
    }
  }
}
```

## 📚 SDKs and Libraries

### JavaScript SDK
```javascript
// Install: npm install ai-agent-sdk
import { AIAgentClient } from 'ai-agent-sdk';

const client = new AIAgentClient({
  apiKey: 'your-api-key',
  provider: 'gemini'
});

// Execute task
const result = await client.executeTask({
  agent: 'CODE_GENERATOR',
  task: 'Create a React component',
  context: { project: 'my-app' }
});
```

### Python SDK
```python
# Install: pip install ai-agent-sdk
from ai_agent_sdk import AIAgentClient

client = AIAgentClient(
    api_key='your-api-key',
    provider='gemini'
)

# Execute task
result = client.execute_task(
    agent='CODE_GENERATOR',
    task='Create a React component',
    context={'project': 'my-app'}
)
```

### React Hook
```javascript
import { useAIAgent } from 'ai-agent-react';

function MyComponent() {
  const { executeTask, isLoading, error } = useAIAgent({
    apiKey: 'your-api-key',
    provider: 'gemini'
  });
  
  const handleTask = async () => {
    const result = await executeTask({
      agent: 'CODE_GENERATOR',
      task: 'Create a login form'
    });
  };
  
  return (
    <button onClick={handleTask} disabled={isLoading}>
      {isLoading ? 'Processing...' : 'Execute Task'}
    </button>
  );
}
```

## 🔧 Integration Examples

### WordPress Plugin
```php
class AIAgentWordPress {
    public function __construct() {
        add_action('wp_ajax_ai_agent_task', [$this, 'handleTask']);
    }
    
    public function handleTask() {
        $task = sanitize_text_field($_POST['task']);
        $result = $this->callAIAgent($task);
        wp_send_json_success($result);
    }
    
    private function callAIAgent($task) {
        // Call AI Agent API
        $response = wp_remote_post('https://api.ai-agent.com/tasks', [
            'headers' => ['Authorization' => 'Bearer ' . get_option('ai_agent_api_key')],
            'body' => json_encode(['task' => $task])
        ]);
        
        return json_decode(wp_remote_retrieve_body($response), true);
    }
}
```

### Shopify App
```javascript
// Shopify app integration
const shopifyIntegration = {
  async createProductDescription(product) {
    const task = `Create a compelling product description for: ${product.title}`;
    const result = await aiAgent.executeTask({
      agent: 'DOCUMENTATION',
      task: task,
      context: { product: product }
    });
    
    return result;
  }
};
```

## 📊 Analytics and Monitoring

### Usage Analytics
```javascript
// Track API usage
const analytics = {
  trackTaskExecution: (task, agent, duration, tokens) => {
    // Send to analytics service
    gtag('event', 'task_executed', {
      agent: agent,
      duration: duration,
      tokens: tokens
    });
  }
};
```

### Performance Monitoring
```javascript
// Monitor API performance
const performanceMonitor = {
  measureAPICall: async (apiCall) => {
    const start = performance.now();
    const result = await apiCall();
    const duration = performance.now() - start;
    
    // Log performance metrics
    console.log(`API call took ${duration}ms`);
    return result;
  }
};
```

---

**Need help with API integration?** Check our [GitHub Issues](https://github.com/yourusername/ai-autonomous-agent-system/issues) or create a new issue for support.
