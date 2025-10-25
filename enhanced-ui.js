/**
 * Enhanced UI System for Autonomous Coding Agent
 * Modern, responsive interface with advanced autonomous features
 */

class EnhancedUISystem {
  constructor() {
    this.autonomousAgent = null;
    this.deploymentManager = null;
    this.currentProject = null;
    this.isInitialized = false;
    
    // UI Components
    this.components = {
      projectBuilder: new ProjectBuilderComponent(),
      codeEditor: new CodeEditorComponent(),
      testRunner: new TestRunnerComponent(),
      deploymentPanel: new DeploymentPanelComponent(),
      learningDashboard: new LearningDashboardComponent(),
      agentStatus: new AgentStatusComponent()
    };
    
    // State Management
    this.state = {
      currentView: 'dashboard',
      activeProject: null,
      agents: {
        planner: { status: 'idle', progress: 0 },
        frontend: { status: 'idle', progress: 0 },
        backend: { status: 'idle', progress: 0 },
        testing: { status: 'idle', progress: 0 },
        deployment: { status: 'idle', progress: 0 }
      },
      notifications: [],
      settings: this.loadSettings()
    };
  }

  async initialize(autonomousAgent, deploymentManager) {
    console.log('🎨 Initializing Enhanced UI System...');
    
    this.autonomousAgent = autonomousAgent;
    this.deploymentManager = deploymentManager;
    
    // Initialize all components
    for (const [name, component] of Object.entries(this.components)) {
            try {
        await component.initialize(this);
      console.log(`✅ ${name} component initialized`);
    }
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Render initial UI
    await this.render();
    
    this.isInitialized = true;
    console.log('🎯 Enhanced UI System ready!');
  }

  async render() {
    const container = document.getElementById('app-container') || document.body;
    
    container.innerHTML = `
      <div class="enhanced-ui">
        ${await this.renderHeader()}
        ${await this.renderMainContent()}
        ${await this.renderSidebar()}
        ${await this.renderNotifications()}
        ${await this.renderModals()}
      </div>
    `;
    
    // Initialize component interactions
    await this.initializeComponentInteractions();
  }

  async renderHeader() {
    return `
      <header class="enhanced-header">
        <div class="header-left">
          <div class="logo">
            <span class="logo-icon">🤖</span>
            <span class="logo-text">Autonomous Coder</span>
          </div>
          <nav class="main-nav">
            <button class="nav-btn active" data-view="dashboard">
              <span class="nav-icon">📊</span>
              <span class="nav-text">Dashboard</span>
            </button>
            <button class="nav-btn" data-view="projects">
              <span class="nav-icon">📁</span>
              <span class="nav-text">Projects</span>
            </button>
            <button class="nav-btn" data-view="agents">
              <span class="nav-icon">🤖</span>
              <span class="nav-text">Agents</span>
            </button>
            <button class="nav-btn" data-view="deployment">
              <span class="nav-icon">🚀</span>
              <span class="nav-text">Deploy</span>
            </button>
          </nav>
        </div>
        <div class="header-right">
          <div class="agent-status-indicator">
            <span class="status-dot ${this.autonomousAgent?.isRunning ? 'running' : 'stopped'}"></span>
            <span class="status-text">${this.autonomousAgent?.isRunning ? 'Active' : 'Stopped'}</span>
          </div>
          <button class="btn btn-primary" id="startAgentBtn">
            <span class="btn-icon">▶️</span>
            <span class="btn-text">Start Agent</span>
          </button>
          <button class="btn btn-secondary" id="settingsBtn">
            <span class="btn-icon">⚙️</span>
            <span class="btn-text">Settings</span>
          </button>
        </div>
      </header>
    `;
  }

  async renderMainContent() {
    const view = this.state.currentView;
    
    switch (view) {
      case 'dashboard':
        return await this.renderDashboard();
      case 'projects':
        return await this.renderProjects();
      case 'agents':
        return await this.renderAgents();
      case 'deployment':
        return await this.renderDeployment();
      case 'project-builder':
        return await this.renderProjectBuilder();
      default:
        return await this.renderDashboard();
    }
  }

  async renderDashboard() {
    return `
      <main class="main-content dashboard">
        <div class="dashboard-grid">
          <div class="dashboard-card project-builder-card">
            <div class="card-header">
              <h3>🚀 Build New App</h3>
              <p>Create a complete application with AI assistance</p>
            </div>
            <div class="card-content">
              <div class="quick-actions">
                <button class="action-btn" data-action="create-react-app">
                  <span class="action-icon">⚛️</span>
                  <span class="action-text">React App</span>
                </button>
                <button class="action-btn" data-action="create-node-api">
                  <span class="action-icon">🟢</span>
                  <span class="action-text">Node.js API</span>
                </button>
                <button class="action-btn" data-action="create-fullstack">
                  <span class="action-icon">🌐</span>
                  <span class="action-text">Full-Stack App</span>
                </button>
                <button class="action-btn" data-action="create-custom">
                  <span class="action-icon">🎯</span>
                  <span class="action-text">Custom Project</span>
                </button>
              </div>
            </div>
          </div>

          <div class="dashboard-card agent-status-card">
            <div class="card-header">
              <h3>🤖 Agent Status</h3>
              <p>Monitor autonomous agents</p>
            </div>
            <div class="card-content">
              ${await this.renderAgentStatus()}
            </div>
          </div>

          <div class="dashboard-card recent-projects-card">
            <div class="card-header">
              <h3>📁 Recent Projects</h3>
              <p>Your latest projects</p>
            </div>
            <div class="card-content">
              ${await this.renderRecentProjects()}
            </div>
          </div>

          <div class="dashboard-card learning-card">
            <div class="card-header">
              <h3>🧠 Learning Progress</h3>
              <p>AI learning and improvements</p>
            </div>
            <div class="card-content">
              ${await this.renderLearningProgress()}
            </div>
          </div>

          <div class="dashboard-card deployment-card">
            <div class="card-header">
              <h3>🚀 Deployments</h3>
              <p>Recent deployments</p>
            </div>
            <div class="card-content">
              ${await this.renderRecentDeployments()}
            </div>
          </div>

          <div class="dashboard-card analytics-card">
            <div class="card-header">
              <h3>📊 Analytics</h3>
              <p>Usage and performance metrics</p>
            </div>
            <div class="card-content">
              ${await this.renderAnalytics()}
            </div>
          </div>
        </div>
      </main>
    `;
  }

  async renderAgentStatus() {
    const agents = this.state.agents;
    
    return Object.entries(agents).map(([name, agent]) => `
      <div class="agent-item">
        <div class="agent-info">
          <span class="agent-name">${name.charAt(0).toUpperCase() + name.slice(1)}</span>
          <span class="agent-status ${agent.status}">${agent.status}</span>
        </div>
        <div class="agent-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${agent.progress}%"></div>
          </div>
          <span class="progress-text">${agent.progress}%</span>
        </div>
      </div>
    `).join('');
  }

  async renderRecentProjects() {
    const projects = this.getRecentProjects();
    
    if (projects.length === 0) {
      return '<p class="empty-state">No recent projects. Create your first project!</p>';
    }
    
    return projects.map(project => `
      <div class="project-item">
        <div class="project-info">
          <h4 class="project-name">${project.name}</h4>
          <p class="project-description">${project.description}</p>
          <div class="project-meta">
            <span class="project-tech">${project.techStack.join(', ')}</span>
            <span class="project-date">${this.formatDate(project.createdAt)}</span>
          </div>
        </div>
        <div class="project-actions">
          <button class="btn btn-sm" data-action="open-project" data-project-id="${project.id}">
            Open
          </button>
          <button class="btn btn-sm" data-action="deploy-project" data-project-id="${project.id}">
            Deploy
          </button>
        </div>
      </div>
    `).join('');
  }

  async renderLearningProgress() {
    return `
      <div class="learning-stats">
        <div class="stat-item">
          <span class="stat-value">${this.getLearningScore()}%</span>
          <span class="stat-label">Learning Score</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${this.getImprovementCount()}</span>
          <span class="stat-label">Improvements</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${this.getPatternCount()}</span>
          <span class="stat-label">Patterns Learned</span>
        </div>
      </div>
      <div class="learning-chart">
        <canvas id="learningChart" width="300" height="150"></canvas>
      </div>
    `;
  }

  async renderRecentDeployments() {
    const deployments = this.getRecentDeployments();
    
    if (deployments.length === 0) {
      return '<p class="empty-state">No recent deployments.</p>';
    }
    
    return deployments.map(deployment => `
      <div class="deployment-item">
        <div class="deployment-info">
          <h4 class="deployment-name">${deployment.projectName}</h4>
          <p class="deployment-url">
            <a href="${deployment.url}" target="_blank">${deployment.url}</a>
          </p>
          <div class="deployment-meta">
            <span class="deployment-platform">${deployment.platform}</span>
            <span class="deployment-status ${deployment.status}">${deployment.status}</span>
            <span class="deployment-date">${this.formatDate(deployment.createdAt)}</span>
          </div>
        </div>
        <div class="deployment-actions">
          <button class="btn btn-sm" data-action="view-deployment" data-deployment-id="${deployment.id}">
            View
          </button>
        </div>
      </div>
    `).join('');
  }

  async renderAnalytics() {
    return `
      <div class="analytics-grid">
        <div class="metric-card">
          <span class="metric-value">${this.getTotalProjects()}</span>
          <span class="metric-label">Total Projects</span>
        </div>
        <div class="metric-card">
          <span class="metric-value">${this.getTotalDeployments()}</span>
          <span class="metric-label">Deployments</span>
        </div>
        <div class="metric-card">
          <span class="metric-value">${this.getSuccessRate()}%</span>
          <span class="metric-label">Success Rate</span>
        </div>
        <div class="metric-card">
          <span class="metric-value">${this.getAverageBuildTime()}</span>
          <span class="metric-label">Avg Build Time</span>
        </div>
      </div>
    `;
  }

  async renderProjectBuilder() {
    return `
      <main class="main-content project-builder">
        <div class="builder-header">
          <h2>🚀 Project Builder</h2>
          <p>Create your application with AI assistance</p>
        </div>
        
        <div class="builder-steps">
          <div class="step active" data-step="1">
            <span class="step-number">1</span>
            <span class="step-title">Requirements</span>
          </div>
          <div class="step" data-step="2">
            <span class="step-number">2</span>
            <span class="step-title">Technology Stack</span>
          </div>
          <div class="step" data-step="3">
            <span class="step-number">3</span>
            <span class="step-title">Features</span>
          </div>
          <div class="step" data-step="4">
            <span class="step-number">4</span>
            <span class="step-title">Generate</span>
          </div>
        </div>

        <div class="builder-content">
          <div class="step-content active" data-step="1">
            <h3>Project Requirements</h3>
            <div class="form-group">
              <label for="projectName">Project Name</label>
              <input type="text" id="projectName" placeholder="Enter project name" required>
            </div>
            <div class="form-group">
              <label for="projectDescription">Description</label>
              <textarea id="projectDescription" placeholder="Describe your project" rows="4"></textarea>
            </div>
            <div class="form-group">
              <label for="projectType">Project Type</label>
              <select id="projectType">
                <option value="web-app">Web Application</option>
                <option value="mobile-app">Mobile Application</option>
                <option value="api">API Service</option>
                <option value="desktop-app">Desktop Application</option>
                <option value="game">Game</option>
              </select>
            </div>
            <div class="form-group">
              <label for="projectComplexity">Complexity</label>
              <select id="projectComplexity">
                <option value="simple">Simple</option>
                <option value="medium">Medium</option>
                <option value="complex">Complex</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>

          <div class="step-content" data-step="2">
            <h3>Technology Stack</h3>
            <div class="tech-stack-grid">
              <div class="tech-category">
                <h4>Frontend</h4>
                <div class="tech-options">
                  <label class="tech-option">
                    <input type="radio" name="frontend" value="react">
                    <span class="tech-name">React</span>
                  </label>
                  <label class="tech-option">
                    <input type="radio" name="frontend" value="vue">
                    <span class="tech-name">Vue.js</span>
                  </label>
                  <label class="tech-option">
                    <input type="radio" name="frontend" value="angular">
                    <span class="tech-name">Angular</span>
                  </label>
                </div>
              </div>
              <div class="tech-category">
                <h4>Backend</h4>
                <div class="tech-options">
                  <label class="tech-option">
                    <input type="radio" name="backend" value="nodejs">
                    <span class="tech-name">Node.js</span>
                  </label>
                  <label class="tech-option">
                    <input type="radio" name="backend" value="python">
                    <span class="tech-name">Python</span>
                  </label>
                  <label class="tech-option">
                    <input type="radio" name="backend" value="java">
                    <span class="tech-name">Java</span>
                  </label>
                </div>
              </div>
              <div class="tech-category">
                <h4>Database</h4>
                <div class="tech-options">
                  <label class="tech-option">
                    <input type="radio" name="database" value="postgresql">
                    <span class="tech-name">PostgreSQL</span>
                  </label>
                  <label class="tech-option">
                    <input type="radio" name="database" value="mongodb">
                    <span class="tech-name">MongoDB</span>
                  </label>
                  <label class="tech-option">
                    <input type="radio" name="database" value="mysql">
                    <span class="tech-name">MySQL</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="step-content" data-step="3">
            <h3>Features & Requirements</h3>
            <div class="features-grid">
              <div class="feature-category">
                <h4>Core Features</h4>
                <div class="feature-list">
                  <label class="feature-item">
                    <input type="checkbox" name="features" value="authentication">
                    <span class="feature-name">User Authentication</span>
                  </label>
                  <label class="feature-item">
                    <input type="checkbox" name="features" value="database">
                    <span class="feature-name">Database Integration</span>
                  </label>
                  <label class="feature-item">
                    <input type="checkbox" name="features" value="api">
                    <span class="feature-name">REST API</span>
                  </label>
                  <label class="feature-item">
                    <input type="checkbox" name="features" value="responsive">
                    <span class="feature-name">Responsive Design</span>
                  </label>
                </div>
              </div>
              <div class="feature-category">
                <h4>Advanced Features</h4>
                <div class="feature-list">
                  <label class="feature-item">
                    <input type="checkbox" name="features" value="real-time">
                    <span class="feature-name">Real-time Updates</span>
                  </label>
                  <label class="feature-item">
                    <input type="checkbox" name="features" value="payments">
                    <span class="feature-name">Payment Integration</span>
                  </label>
                  <label class="feature-item">
                    <input type="checkbox" name="features" value="notifications">
                    <span class="feature-name">Push Notifications</span>
                  </label>
                  <label class="feature-item">
                    <input type="checkbox" name="features" value="analytics">
                    <span class="feature-name">Analytics</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="step-content" data-step="4">
            <h3>Generate Project</h3>
            <div class="generation-preview">
              <h4>Project Summary</h4>
              <div id="projectSummary" class="project-summary">
                <!-- Generated project summary will appear here -->
              </div>
            </div>
            <div class="generation-actions">
              <button class="btn btn-primary" id="generateProjectBtn">
                <span class="btn-icon">🚀</span>
                <span class="btn-text">Generate Project</span>
              </button>
              <button class="btn btn-secondary" id="previewProjectBtn">
                <span class="btn-icon">👁️</span>
                <span class="btn-text">Preview</span>
              </button>
            </div>
          </div>
        </div>

        <div class="builder-actions">
          <button class="btn btn-secondary" id="prevStepBtn" disabled>
            <span class="btn-icon">←</span>
            <span class="btn-text">Previous</span>
          </button>
          <button class="btn btn-primary" id="nextStepBtn">
            <span class="btn-text">Next</span>
            <span class="btn-icon">→</span>
          </button>
        </div>
      </main>
    `;
  }

  async renderSidebar() {
    return `
      <aside class="enhanced-sidebar">
        <div class="sidebar-section">
          <h3>🤖 Active Agents</h3>
          <div class="agent-list">
            ${await this.renderSidebarAgents()}
          </div>
        </div>
        
        <div class="sidebar-section">
          <h3>📊 Quick Stats</h3>
          <div class="quick-stats">
            <div class="stat">
              <span class="stat-value">${this.getTotalProjects()}</span>
              <span class="stat-label">Projects</span>
            </div>
            <div class="stat">
              <span class="stat-value">${this.getTotalDeployments()}</span>
              <span class="stat-label">Deployments</span>
            </div>
            <div class="stat">
              <span class="stat-value">${this.getSuccessRate()}%</span>
              <span class="stat-label">Success Rate</span>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>⚡ Quick Actions</h3>
          <div class="quick-actions">
            <button class="action-btn" data-action="create-project">
              <span class="action-icon">➕</span>
              <span class="action-text">New Project</span>
            </button>
            <button class="action-btn" data-action="deploy-all">
              <span class="action-icon">🚀</span>
              <span class="action-text">Deploy All</span>
            </button>
            <button class="action-btn" data-action="run-tests">
              <span class="action-icon">🧪</span>
              <span class="action-text">Run Tests</span>
            </button>
            <button class="action-btn" data-action="view-logs">
              <span class="action-icon">📋</span>
              <span class="action-text">View Logs</span>
            </button>
          </div>
        </div>
      </aside>
    `;
  }

  async renderSidebarAgents() {
    const agents = this.state.agents;
    
    return Object.entries(agents).map(([name, agent]) => `
      <div class="agent-item">
        <div class="agent-icon">${this.getAgentIcon(name)}</div>
        <div class="agent-details">
          <span class="agent-name">${name.charAt(0).toUpperCase() + name.slice(1)}</span>
          <span class="agent-status ${agent.status}">${agent.status}</span>
        </div>
        <div class="agent-progress">
          <div class="progress-bar small">
            <div class="progress-fill" style="width: ${agent.progress}%"></div>
          </div>
        </div>
      </div>
    `).join('');
  }

  async renderNotifications() {
    const notifications = this.state.notifications;
    
    if (notifications.length === 0) return '';
    
    return `
      <div class="notifications-container">
        ${notifications.map(notification => `
          <div class="notification ${notification.type}">
            <div class="notification-icon">${this.getNotificationIcon(notification.type)}</div>
            <div class="notification-content">
              <h4>${notification.title}</h4>
              <p>${notification.message}</p>
            </div>
            <button class="notification-close" data-notification-id="${notification.id}">×</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  async renderModals() {
    return `
      <div class="modals-container">
        <div class="modal" id="settingsModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Settings</h3>
              <button class="modal-close">×</button>
            </div>
            <div class="modal-body">
              ${await this.renderSettingsContent()}
            </div>
          </div>
        </div>
        
        <div class="modal" id="projectModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>Project Details</h3>
              <button class="modal-close">×</button>
            </div>
            <div class="modal-body">
              ${await this.renderProjectDetails()}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async renderSettingsContent() {
    return `
      <div class="settings-sections">
        <div class="settings-section">
          <h4>AI Providers</h4>
          <div class="form-group">
            <label for="primaryProvider">Primary Provider</label>
            <select id="primaryProvider">
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI</option>
              <option value="claude">Claude</option>
              <option value="groq">Groq</option>
            </select>
          </div>
          <div class="form-group">
            <label for="apiKey">API Key</label>
            <input type="password" id="apiKey" placeholder="Enter your API key">
          </div>
        </div>
        
        <div class="settings-section">
          <h4>Deployment</h4>
          <div class="form-group">
            <label for="defaultPlatform">Default Platform</label>
            <select id="defaultPlatform">
              <option value="vercel">Vercel</option>
              <option value="netlify">Netlify</option>
              <option value="aws">AWS</option>
              <option value="github">GitHub Pages</option>
            </select>
          </div>
        </div>
        
        <div class="settings-section">
          <h4>Preferences</h4>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="autoDeploy">
              <span>Auto-deploy on build success</span>
            </label>
          </div>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="notifications">
              <span>Enable notifications</span>
            </label>
          </div>
        </div>
      </div>
    `;
  }

  async renderProjectDetails() {
    if (!this.currentProject) {
      return '<p>No project selected</p>';
    }
    
    return `
      <div class="project-details">
        <h4>${this.currentProject.name}</h4>
        <p>${this.currentProject.description}</p>
        <div class="project-info">
          <div class="info-item">
            <span class="info-label">Status:</span>
            <span class="info-value">${this.currentProject.status}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Created:</span>
            <span class="info-value">${this.formatDate(this.currentProject.createdAt)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Technology:</span>
            <span class="info-value">${this.currentProject.techStack.join(', ')}</span>
          </div>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Navigation
    document.addEventListener('click', (e) => {
      if (e.target.closest('.nav-btn')) {
        const view = e.target.closest('.nav-btn').dataset.view;
        this.switchView(view);
      }
    });

    // Agent controls
    document.addEventListener('click', (e) => {
      if (e.target.closest('#startAgentBtn')) {
        this.toggleAgent();
      }
    });

    // Project builder
    document.addEventListener('click', (e) => {
      if (e.target.closest('.action-btn')) {
        const action = e.target.closest('.action-btn').dataset.action;
        this.handleQuickAction(action);
      }
    });

    // Builder steps
    document.addEventListener('click', (e) => {
      if (e.target.closest('#nextStepBtn')) {
        this.nextBuilderStep();
      }
      if (e.target.closest('#prevStepBtn')) {
        this.prevBuilderStep();
      }
    });

    // Project generation
    document.addEventListener('click', (e) => {
      if (e.target.closest('#generateProjectBtn')) {
        this.generateProject();
      }
    });

    // Modal controls
    document.addEventListener('click', (e) => {
      if (e.target.closest('.modal-close')) {
        this.closeModal();
      }
    });

    // Notification controls
    document.addEventListener('click', (e) => {
      if (e.target.closest('.notification-close')) {
        const notificationId = e.target.closest('.notification-close').dataset.notificationId;
        this.removeNotification(notificationId);
      }
    });
  }

  async initializeComponentInteractions() {
    // Initialize all component interactions
    for (const [name, component] of Object.entries(this.components)) {
      if (component.initializeInteractions) {
        await component.initializeInteractions();
      }
    }
  }

  switchView(view) {
    this.state.currentView = view;
    this.render();
  }

  async toggleAgent() {
    if (this.autonomousAgent.isRunning) {
      await this.autonomousAgent.stop();
      this.addNotification('info', 'Agent Stopped', 'The autonomous agent has been stopped.');
    } else {
      await this.autonomousAgent.start();
      this.addNotification('success', 'Agent Started', 'The autonomous agent is now running.');
    }
    this.updateAgentStatus();
  }

  async handleQuickAction(action) {
    switch (action) {
      case 'create-project':
        this.switchView('project-builder');
        break;
      case 'create-react-app':
        await this.createQuickProject('react-app');
        break;
      case 'create-node-api':
        await this.createQuickProject('node-api');
        break;
      case 'create-fullstack':
        await this.createQuickProject('fullstack-app');
        break;
      case 'create-custom':
        this.switchView('project-builder');
        break;
      case 'deploy-all':
        await this.deployAllProjects();
        break;
      case 'run-tests':
        await this.runAllTests();
        break;
      case 'view-logs':
        this.showLogs();
        break;
    }
  }

  async createQuickProject(template) {
    const templates = {
      'react-app': {
        name: 'React App',
        description: 'Modern React application',
        techStack: ['React', 'TypeScript', 'Tailwind CSS']
      },
      'node-api': {
        name: 'Node.js API',
        description: 'RESTful API with Express.js',
        techStack: ['Node.js', 'Express', 'MongoDB']
      },
      'fullstack-app': {
        name: 'Full-Stack App',
        description: 'Complete full-stack application',
        techStack: ['React', 'Node.js', 'PostgreSQL']
      }
    };

    const templateData = templates[template];
    if (!templateData) return;

    this.addNotification('info', 'Creating Project', `Creating ${templateData.name}...`);
    
    try {
      const project = await this.autonomousAgent.buildApp(templateData);
      this.addNotification('success', 'Project Created', `${templateData.name} created successfully!`);
      this.currentProject = project;
    } catch (error) {
      this.addNotification('error', 'Creation Failed', `Failed to create project: ${error.message}`);
    }
  }

  async generateProject() {
    const requirements = this.collectProjectRequirements();
    
    this.addNotification('info', 'Generating Project', 'AI is generating your project...');
    
    try {
      const project = await this.autonomousAgent.buildApp(requirements);
      this.addNotification('success', 'Project Generated', 'Your project has been generated successfully!');
      this.currentProject = project;
      this.switchView('projects');
    } catch (error) {
      this.addNotification('error', 'Generation Failed', `Failed to generate project: ${error.message}`);
    }
  }

  collectProjectRequirements() {
    return {
      name: document.getElementById('projectName').value,
      description: document.getElementById('projectDescription').value,
      type: document.getElementById('projectType').value,
      complexity: document.getElementById('projectComplexity').value,
      techStack: {
        frontend: document.querySelector('input[name="frontend"]:checked')?.value,
        backend: document.querySelector('input[name="backend"]:checked')?.value,
        database: document.querySelector('input[name="database"]:checked')?.value
      },
      features: Array.from(document.querySelectorAll('input[name="features"]:checked')).map(cb => cb.value)
    };
  }

  addNotification(type, title, message) {
    const notification = {
      id: Date.now(),
      type: type,
      title: title,
      message: message,
      timestamp: new Date()
    };
    
    this.state.notifications.push(notification);
    this.render();
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, 5000);
  }

  removeNotification(notificationId) {
    this.state.notifications = this.state.notifications.filter(n => n.id != notificationId);
    this.render();
  }

  updateAgentStatus() {
    // Update agent status in UI
    this.render();
  }

  // Utility methods
  getAgentIcon(name) {
    const icons = {
      planner: '📋',
      frontend: '⚛️',
      backend: '🟢',
      testing: '🧪',
      deployment: '🚀',
      qa: '✅'
    };
    return icons[name] || '🤖';
  }

  getNotificationIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  }

  getRecentProjects() {
    // Mock data - in real implementation, this would come from storage
    return [
      {
        id: 'proj_1',
        name: 'E-commerce App',
        description: 'Modern e-commerce platform',
        techStack: ['React', 'Node.js', 'MongoDB'],
        createdAt: new Date(Date.now() - 86400000)
      },
      {
        id: 'proj_2',
        name: 'Task Manager',
        description: 'Collaborative task management tool',
        techStack: ['Vue.js', 'Express', 'PostgreSQL'],
        createdAt: new Date(Date.now() - 172800000)
      }
    ];
  }

  getRecentDeployments() {
    // Mock data
    return [
      {
        id: 'deploy_1',
        projectName: 'E-commerce App',
        url: 'https://ecommerce-app.vercel.app',
        platform: 'Vercel',
        status: 'deployed',
        createdAt: new Date(Date.now() - 3600000)
      }
    ];
  }

  getLearningScore() {
    return Math.floor(Math.random() * 40) + 60; // 60-100
  }

  getImprovementCount() {
    return Math.floor(Math.random() * 20) + 5; // 5-25
  }

  getPatternCount() {
    return Math.floor(Math.random() * 50) + 10; // 10-60
  }

  getTotalProjects() {
    return this.getRecentProjects().length;
  }

  getTotalDeployments() {
    return this.getRecentDeployments().length;
  }

  getSuccessRate() {
    return Math.floor(Math.random() * 20) + 80; // 80-100
  }

  getAverageBuildTime() {
    return '2m 30s';
  }

  formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  loadSettings() {
    const defaultSettings = {
      primaryProvider: 'gemini',
      apiKey: '',
      defaultPlatform: 'vercel',
      autoDeploy: false,
      notifications: true
    };
    
    const stored = localStorage.getItem('enhancedUISettings');
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  }

  saveSettings() {
    localStorage.setItem('enhancedUISettings', JSON.stringify(this.state.settings));
  }
}

// Export the main class
window.EnhancedUISystem = EnhancedUISystem;