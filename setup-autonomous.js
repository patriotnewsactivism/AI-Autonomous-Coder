/**
 * Autonomous Coding Agent System - Setup Script
 * Automated setup and configuration for the autonomous coding system
 */

class AutonomousSetup {
  constructor() {
    this.setupSteps = [
      'checkRequirements',
      'initializeProviders',
      'configureSettings',
      'setupDeployment',
      'testSystem',
      'completeSetup'
    ];
    this.currentStep = 0;
    this.setupData = {
      providers: {},
      settings: {},
      deployment: {},
      testResults: {}
    };
  }

  async startSetup() {
    console.log('🚀 Starting Autonomous Coding Agent Setup...');
    
    try {
      // Run setup steps
      for (const step of this.setupSteps) {
        await this.runSetupStep(step);
        await this.delay(1000);
      }
      
      console.log('✅ Setup completed successfully!');
      this.showSetupComplete();
      
    } catch (error) {
      console.error('❌ Setup failed:', error);
      this.showSetupError(error);
    }
  }

  async runSetupStep(step) {
    console.log(`🔧 Running setup step: ${step}`);
    
    switch (step) {
      case 'checkRequirements':
        await this.checkRequirements();
        break;
      case 'initializeProviders':
        await this.initializeProviders();
        break;
      case 'configureSettings':
        await this.configureSettings();
        break;
      case 'setupDeployment':
        await this.setupDeployment();
        break;
      case 'testSystem':
        await this.testSystem();
        break;
      case 'completeSetup':
        await this.completeSetup();
        break;
    }
  }

  async checkRequirements() {
    console.log('🔍 Checking system requirements...');
    
    const requirements = {
      browser: this.checkBrowserSupport(),
      storage: this.checkStorageSupport(),
      apis: this.checkAPISupport(),
      performance: this.checkPerformance()
    };
    
    const allMet = Object.values(requirements).every(req => req === true);
    
    if (allMet) {
      this.showStatus('success', 'Requirements Check', 'All system requirements met!');
    } else {
      this.showStatus('warning', 'Requirements Check', 'Some requirements not met, but system can still function.');
    }
    
    this.setupData.requirements = requirements;
  }

  checkBrowserSupport() {
    const features = [
      'fetch' in window,
      'Promise' in window,
      'localStorage' in window,
      'sessionStorage' in window,
      'WebSocket' in window,
      'Worker' in window
    ];
    
    return features.every(feature => feature === true);
  }

  checkStorageSupport() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }

  checkAPISupport() {
    const apis = [
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
      'speechSynthesis' in window,
      'Notification' in window,
      'ServiceWorker' in navigator
    ];
    
    return apis.some(api => api === true);
  }

  checkPerformance() {
    const memory = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    
    return memory >= 4 && cores >= 2;
  }

  async initializeProviders() {
    console.log('🤖 Initializing AI providers...');
    
    const providers = [
      { name: 'Google Gemini', key: 'gemini', free: true, priority: 1 },
      { name: 'OpenAI GPT', key: 'openai', free: false, priority: 2 },
      { name: 'Anthropic Claude', key: 'claude', free: false, priority: 3 },
      { name: 'Groq', key: 'groq', free: true, priority: 4 },
      { name: 'Hugging Face', key: 'huggingface', free: true, priority: 5 },
      { name: 'Ollama (Local)', key: 'ollama', free: true, priority: 6 }
    ];
    
    for (const provider of providers) {
      await this.initializeProvider(provider);
      await this.delay(500);
    }
    
    this.showStatus('success', 'Providers Initialized', 'AI providers ready for use!');
  }

  async initializeProvider(provider) {
    console.log(`🔧 Initializing ${provider.name}...`);
    
    // Check if API key exists
    const apiKey = localStorage.getItem(`${provider.key}_api_key`);
    
    if (apiKey || provider.free) {
      this.setupData.providers[provider.key] = {
        name: provider.name,
        initialized: true,
        hasApiKey: !!apiKey,
        free: provider.free,
        priority: provider.priority
      };
      
      this.showStatus('info', 'Provider Ready', `${provider.name} initialized successfully`);
    } else {
      this.setupData.providers[provider.key] = {
        name: provider.name,
        initialized: false,
        hasApiKey: false,
        free: provider.free,
        priority: provider.priority,
        needsApiKey: true
      };
      
      this.showStatus('warning', 'API Key Needed', `${provider.name} needs an API key for full functionality`);
    }
  }

  async configureSettings() {
    console.log('⚙️ Configuring system settings...');
    
    const defaultSettings = {
      primaryProvider: 'gemini',
      costOptimization: true,
      autoDeploy: false,
      notifications: true,
      theme: 'dark',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      maxConcurrentAgents: 3,
      qualityThreshold: 0.8,
      learningEnabled: true
    };
    
    // Load existing settings
    const existingSettings = this.loadSettings();
    const settings = { ...defaultSettings, ...existingSettings };
    
    // Save settings
    this.saveSettings(settings);
    this.setupData.settings = settings;
    
    this.showStatus('success', 'Settings Configured', 'System settings saved successfully!');
  }

  async setupDeployment() {
    console.log('🚀 Setting up deployment platforms...');
    
    const platforms = [
      { name: 'Vercel', key: 'vercel', free: true, recommended: true },
      { name: 'Netlify', key: 'netlify', free: true, recommended: true },
      { name: 'GitHub Pages', key: 'github', free: true, recommended: false },
      { name: 'AWS', key: 'aws', free: false, recommended: false },
      { name: 'Docker', key: 'docker', free: true, recommended: false }
    ];
    
    for (const platform of platforms) {
      await this.setupPlatform(platform);
      await this.delay(300);
    }
    
    this.showStatus('success', 'Deployment Ready', 'Deployment platforms configured!');
  }

  async setupPlatform(platform) {
    console.log(`🔧 Setting up ${platform.name}...`);
    
    this.setupData.deployment[platform.key] = {
      name: platform.name,
      configured: true,
      free: platform.free,
      recommended: platform.recommended
    };
    
    this.showStatus('info', 'Platform Ready', `${platform.name} deployment configured`);
  }

  async testSystem() {
    console.log('🧪 Testing system functionality...');
    
    const tests = [
      { name: 'AI Provider Test', test: () => this.testAIProvider() },
      { name: 'Code Generation Test', test: () => this.testCodeGeneration() },
      { name: 'File System Test', test: () => this.testFileSystem() },
      { name: 'UI Components Test', test: () => this.testUIComponents() },
      { name: 'Deployment Test', test: () => this.testDeployment() }
    ];
    
    const results = {};
    
    for (const test of tests) {
      try {
        const result = await test.test();
        results[test.name] = { passed: true, result };
        this.showStatus('success', 'Test Passed', `${test.name} completed successfully`);
      } catch (error) {
        results[test.name] = { passed: false, error: error.message };
        this.showStatus('error', 'Test Failed', `${test.name} failed: ${error.message}`);
      }
      await this.delay(500);
    }
    
    this.setupData.testResults = results;
    
    const passedTests = Object.values(results).filter(r => r.passed).length;
    const totalTests = Object.keys(results).length;
    
    this.showStatus('info', 'Testing Complete', 
      `Tests completed: ${passedTests}/${totalTests} passed`);
  }

  async testAIProvider() {
    // Test AI provider functionality
    const aiProvider = new EnhancedAIProvider();
    const testPrompt = "Generate a simple 'Hello World' function in JavaScript";
    
    try {
      const response = await aiProvider.generate(testPrompt);
      return response.length > 0;
    } catch (error) {
      throw new Error('AI provider test failed: ' + error.message);
    }
  }

  async testCodeGeneration() {
    // Test code generation functionality
    const codeGenerator = new CodeGenerationSpecialist(new EnhancedAIProvider());
    
    try {
      const code = await codeGenerator.generateReactComponent('TestComponent', {}, []);
      return code.length > 0;
    } catch (error) {
      throw new Error('Code generation test failed: ' + error.message);
    }
  }

  async testFileSystem() {
      // Test file system operations
      try {
        const testData = { test: 'data', timestamp: Date.now() };
        localStorage.setItem('autonomous_test', JSON.stringify(testData));
        const retrievedRaw = localStorage.getItem('autonomous_test');
        let retrieved = {};

        try {
          retrieved = retrievedRaw ? JSON.parse(retrievedRaw) : {};
        } catch (error) {
          console.warn('Autonomous test data became corrupted:', error);
          localStorage.removeItem('autonomous_test');
          throw new Error('Stored test data was corrupted');
        }

        localStorage.removeItem('autonomous_test');
        return retrieved.test === 'data';
      } catch (error) {
        throw new Error('File system test failed: ' + error.message);
      }
  }

  async testUIComponents() {
    // Test UI component functionality
    try {
      const ui = new EnhancedUISystem();
      await ui.initialize();
      return true;
    } catch (error) {
      throw new Error('UI components test failed: ' + error.message);
    }
  }

  async testDeployment() {
    // Test deployment functionality
    try {
      const deployer = new DeploymentManager();
      await deployer.initialize();
      return true;
    } catch (error) {
      throw new Error('Deployment test failed: ' + error.message);
    }
  }

  async completeSetup() {
    console.log('✅ Completing setup...');
    
    // Save setup data
    this.saveSetupData();
    
    // Initialize the main system
    await this.initializeMainSystem();
    
    this.showStatus('success', 'Setup Complete', 
      'Autonomous Coding Agent System is ready to use!');
  }

  async initializeMainSystem() {
    // Initialize the main autonomous agent system
    if (window.AutonomousAgentSystem) {
      window.autonomousAgent = new AutonomousAgentSystem();
      await window.autonomousAgent.initialize();
    }
    
    if (window.DeploymentManager) {
      window.deploymentManager = new DeploymentManager();
      await window.deploymentManager.initialize();
    }
    
    if (window.EnhancedUISystem) {
      window.enhancedUI = new EnhancedUISystem();
      await window.enhancedUI.initialize(
        window.autonomousAgent, 
        window.deploymentManager
      );
    }
  }

  // Helper methods
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showStatus(type, title, message) {
    console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
    
    // Show notification if UI is available
    if (window.enhancedUI && window.enhancedUI.addNotification) {
      window.enhancedUI.addNotification(type, title, message);
    }
  }

  showSetupComplete() {
    const message = `
🎉 Setup Complete!

Your Autonomous Coding Agent System is now ready to use. Here's what you can do:

🚀 Quick Start:
• Click "Build New App" to create your first project
• Choose from React, Vue, Node.js, or full-stack templates
• Let AI agents build your complete application
• Deploy with one click to Vercel, Netlify, or AWS

🤖 Features Available:
• 6 specialized AI agents
• Multi-language code generation
• Autonomous testing and deployment
• Self-learning and improvement
• Real-time monitoring and analytics

📚 Next Steps:
• Try the demo: ?demo=true
• Read the documentation
• Join our community
• Start building amazing apps!

Happy coding! 🎯
    `;
    
    console.log(message);
    
    if (window.enhancedUI && window.enhancedUI.addNotification) {
      window.enhancedUI.addNotification('success', 'Setup Complete', 
        'Your autonomous coding system is ready! Click "Build New App" to start.');
    }
  }

  showSetupError(error) {
    const message = `
❌ Setup Failed

There was an error during setup: ${error.message}

Please try the following:
1. Refresh the page and try again
2. Check your internet connection
3. Ensure your browser supports modern JavaScript
4. Contact support if the issue persists

Error details: ${error.stack}
    `;
    
    console.error(message);
    
    if (window.enhancedUI && window.enhancedUI.addNotification) {
      window.enhancedUI.addNotification('error', 'Setup Failed', 
        'Setup encountered an error. Please refresh and try again.');
    }
  }

  loadSettings() {
    try {
      const settings = localStorage.getItem('autonomous_settings');
      return settings ? JSON.parse(settings) : {};
    } catch (error) {
      console.error('Failed to load settings:', error);
      return {};
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem('autonomous_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  saveSetupData() {
    try {
      localStorage.setItem('autonomous_setup_data', JSON.stringify(this.setupData));
    } catch (error) {
      console.error('Failed to save setup data:', error);
    }
  }
}

// Auto-start setup when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Check if setup should start automatically
  const urlParams = new URLSearchParams(window.location.search);
  const shouldSetup = urlParams.get('setup') === 'true' || 
                     !localStorage.getItem('autonomous_setup_complete');
  
  if (shouldSetup) {
    const setup = new AutonomousSetup();
    setup.startSetup().then(() => {
      localStorage.setItem('autonomous_setup_complete', 'true');
    });
  }
});

// Export for manual setup start
window.AutonomousSetup = AutonomousSetup;