/**
 * Enhanced AI Providers for Autonomous Coding Agent
 * Multi-provider support with intelligent fallback and optimization
 */

class EnhancedAIProvider {
  constructor() {
    this.providers = {
      gemini: new GeminiProvider(),
      openai: new OpenAIProvider(),
      claude: new ClaudeProvider(),
      groq: new GroqProvider(),
      huggingface: new HuggingFaceProvider(),
      ollama: new OllamaProvider()
    };
    
    this.currentProvider = 'gemini';
    this.fallbackChain = ['gemini', 'openai', 'claude', 'groq'];
    this.usageStats = {};
    this.costOptimizer = new CostOptimizer();
  }

  async generate(prompt, options = {}) {
    const startTime = Date.now();
    
    try {
      // Select best provider based on cost and performance
      const provider = this.selectProvider(options);
      
      // Generate response
      const response = await this.providers[provider].generate(prompt, options);
      
      // Track usage
      this.trackUsage(provider, Date.now() - startTime, response.length);
      
      return response;
      
    } catch (error) {
      console.error(`Provider ${this.currentProvider} failed:`, error);
      
      // Try fallback providers
      for (const fallbackProvider of this.fallbackChain) {
        if (fallbackProvider !== this.currentProvider) {
          try {
            console.log(`Trying fallback provider: ${fallbackProvider}`);
            const response = await this.providers[fallbackProvider].generate(prompt, options);
            this.trackUsage(fallbackProvider, Date.now() - startTime, response.length);
            return response;
          } catch (fallbackError) {
            console.error(`Fallback provider ${fallbackProvider} also failed:`, fallbackError);
          }
        }
      }
      
      throw new Error('All AI providers failed');
    }
  }

  selectProvider(options = {}) {
    // Use cost optimization if enabled
    if (options.costOptimized) {
      return this.costOptimizer.getCheapestProvider();
    }
    
    // Use performance optimization if specified
    if (options.performanceOptimized) {
      return this.costOptimizer.getFastestProvider();
    }
    
    // Use quality optimization for complex tasks
    if (options.qualityOptimized) {
      return this.costOptimizer.getBestQualityProvider();
    }
    
    return this.currentProvider;
  }

  trackUsage(provider, duration, responseLength) {
    if (!this.usageStats[provider]) {
      this.usageStats[provider] = {
        calls: 0,
        totalDuration: 0,
        totalTokens: 0,
        errors: 0
      };
    }
    
    this.usageStats[provider].calls++;
    this.usageStats[provider].totalDuration += duration;
    this.usageStats[provider].totalTokens += responseLength;
  }

  getUsageStats() {
    return this.usageStats;
  }

  async generateCode(prompt, context = {}) {
    const codePrompt = this.buildCodePrompt(prompt, context);
    return await this.generate(codePrompt, { qualityOptimized: true });
  }

  async generateTests(code, requirements) {
    const testPrompt = this.buildTestPrompt(code, requirements);
    return await this.generate(testPrompt, { qualityOptimized: true });
  }

  async generateDocumentation(code, context) {
    const docPrompt = this.buildDocumentationPrompt(code, context);
    return await this.generate(docPrompt, { costOptimized: true });
  }

  buildCodePrompt(prompt, context) {
    return `
You are an expert software developer. Generate high-quality, production-ready code.

Context:
- Project Type: ${context.projectType || 'Web Application'}
- Technology Stack: ${JSON.stringify(context.techStack || {})}
- Requirements: ${context.requirements || 'Not specified'}

Task: ${prompt}

Requirements:
1. Write clean, readable, and maintainable code
2. Follow best practices and design patterns
3. Include proper error handling
4. Add meaningful comments
5. Ensure code is production-ready
6. Use modern syntax and features
7. Include type definitions if applicable
8. Follow security best practices

Generate complete, working code that can be immediately used.
`;
  }

  buildTestPrompt(code, requirements) {
    return `
You are an expert QA engineer. Generate comprehensive test cases for the following code.

Code:
\`\`\`
${code}
\`\`\`

Requirements: ${JSON.stringify(requirements)}

Generate:
1. Unit tests for all functions/methods
2. Integration tests for API endpoints
3. Edge case tests
4. Error handling tests
5. Performance tests
6. Security tests

Use Jest for JavaScript/Node.js or appropriate testing framework.
Make tests comprehensive, readable, and maintainable.
`;
  }

  buildDocumentationPrompt(code, context) {
    return `
Generate comprehensive documentation for the following code.

Code:
\`\`\`
${code}
\`\`\`

Context: ${JSON.stringify(context)}

Generate:
1. Function/method documentation
2. API documentation
3. Usage examples
4. Configuration instructions
5. Troubleshooting guide

Use JSDoc format for JavaScript or appropriate documentation format.
Make documentation clear, complete, and user-friendly.
`;
  }
}

/**
 * Google Gemini Provider
 */
class GeminiProvider {
  constructor() {
    this.name = 'gemini';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    this.apiKey = null;
    this.model = 'gemini-1.5-flash';
  }

  async initialize(apiKey) {
    this.apiKey = apiKey;
  }

  async generate(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('Gemini API key not provided');
    }

    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;
    
    const requestBody = {
      contents: [{
        role: 'user',
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        topK: options.topK || 40,
        topP: options.topP || 0.95,
        maxOutputTokens: options.maxTokens || 2048
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      throw new Error(`Gemini API call failed: ${error.message}`);
    }
  }
}

/**
 * OpenAI Provider
 */
class OpenAIProvider {
  constructor() {
    this.name = 'openai';
    this.baseUrl = 'https://api.openai.com/v1/chat/completions';
    this.apiKey = null;
    this.model = 'gpt-4';
  }

  async initialize(apiKey) {
    this.apiKey = apiKey;
  }

  async generate(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not provided');
    }

    const requestBody = {
      model: options.model || this.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert software developer and coding assistant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2048,
      top_p: options.topP || 1,
      frequency_penalty: options.frequencyPenalty || 0,
      presence_penalty: options.presencePenalty || 0
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${response.status} ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error('Invalid response format from OpenAI API');
      }
    } catch (error) {
      throw new Error(`OpenAI API call failed: ${error.message}`);
    }
  }
}

/**
 * Anthropic Claude Provider
 */
class ClaudeProvider {
  constructor() {
    this.name = 'claude';
    this.baseUrl = 'https://api.anthropic.com/v1/messages';
    this.apiKey = null;
    this.model = 'claude-3-sonnet-20240229';
  }

  async initialize(apiKey) {
    this.apiKey = apiKey;
  }

  async generate(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('Claude API key not provided');
    }

    const requestBody = {
      model: options.model || this.model,
      max_tokens: options.maxTokens || 2048,
      temperature: options.temperature || 0.7,
      system: 'You are an expert software developer and coding assistant.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Claude API error: ${response.status} ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (data.content && data.content[0] && data.content[0].text) {
        return data.content[0].text;
      } else {
        throw new Error('Invalid response format from Claude API');
      }
    } catch (error) {
      throw new Error(`Claude API call failed: ${error.message}`);
    }
  }
}

/**
 * Groq Provider
 */
class GroqProvider {
  constructor() {
    this.name = 'groq';
    this.baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.apiKey = null;
    this.model = 'llama3-8b-8192';
  }

  async initialize(apiKey) {
    this.apiKey = apiKey;
  }

  async generate(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('Groq API key not provided');
    }

    const requestBody = {
      model: options.model || this.model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert software developer and coding assistant.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 2048
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Groq API error: ${response.status} ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error('Invalid response format from Groq API');
      }
    } catch (error) {
      throw new Error(`Groq API call failed: ${error.message}`);
    }
  }
}

/**
 * Hugging Face Provider
 */
class HuggingFaceProvider {
  constructor() {
    this.name = 'huggingface';
    this.baseUrl = 'https://api-inference.huggingface.co/models';
    this.apiKey = null;
    this.model = 'microsoft/DialoGPT-medium';
  }

  async initialize(apiKey) {
    this.apiKey = apiKey;
  }

  async generate(prompt, options = {}) {
    if (!this.apiKey) {
      throw new Error('Hugging Face API key not provided');
    }

    const url = `${this.baseUrl}/${options.model || this.model}`;
    
    const requestBody = {
      inputs: prompt,
      parameters: {
        max_length: options.maxTokens || 2048,
        temperature: options.temperature || 0.7,
        do_sample: true
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Hugging Face API error: ${response.status} ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      
      if (Array.isArray(data) && data[0] && data[0].generated_text) {
        return data[0].generated_text;
      } else {
        throw new Error('Invalid response format from Hugging Face API');
      }
    } catch (error) {
      throw new Error(`Hugging Face API call failed: ${error.message}`);
    }
  }
}

/**
 * Ollama Provider (Local)
 */
class OllamaProvider {
  constructor() {
    this.name = 'ollama';
    this.baseUrl = 'http://localhost:11434/api/generate';
    this.model = 'llama2';
  }

  async initialize() {
    // No API key needed for local Ollama
  }

  async generate(prompt, options = {}) {
    const requestBody = {
      model: options.model || this.model,
      prompt: prompt,
      stream: false,
      options: {
        temperature: options.temperature || 0.7,
        num_predict: options.maxTokens || 2048
      }
    };

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.response) {
        return data.response;
      } else {
        throw new Error('Invalid response format from Ollama API');
      }
    } catch (error) {
      throw new Error(`Ollama API call failed: ${error.message}. Make sure Ollama is running locally.`);
    }
  }
}

/**
 * Cost Optimizer
 */
class CostOptimizer {
  constructor() {
    this.providerCosts = {
      gemini: { cost: 0, speed: 8, quality: 9 },
      openai: { cost: 0.15, speed: 7, quality: 10 },
      claude: { cost: 3.00, speed: 6, quality: 10 },
      groq: { cost: 0.20, speed: 10, quality: 7 },
      huggingface: { cost: 0, speed: 5, quality: 6 },
      ollama: { cost: 0, speed: 4, quality: 6 }
    };
  }

  getCheapestProvider() {
    const sorted = Object.entries(this.providerCosts)
      .sort(([,a], [,b]) => a.cost - b.cost);
    return sorted[0][0];
  }

  getFastestProvider() {
    const sorted = Object.entries(this.providerCosts)
      .sort(([,a], [,b]) => b.speed - a.speed);
    return sorted[0][0];
  }

  getBestQualityProvider() {
    const sorted = Object.entries(this.providerCosts)
      .sort(([,a], [,b]) => b.quality - a.quality);
    return sorted[0][0];
  }

  getBalancedProvider() {
    // Weighted score: quality * 0.5 + speed * 0.3 + (1/cost) * 0.2
    const scored = Object.entries(this.providerCosts).map(([name, metrics]) => {
      const costScore = metrics.cost === 0 ? 10 : 1 / metrics.cost;
      const score = metrics.quality * 0.5 + metrics.speed * 0.3 + costScore * 0.2;
      return [name, score];
    });
    
    const sorted = scored.sort(([,a], [,b]) => b - a);
    return sorted[0][0];
  }
}

/**
 * Code Generation Specialists
 */
class CodeGenerationSpecialist {
  constructor(aiProvider) {
    this.aiProvider = aiProvider;
    this.templates = new CodeTemplates();
    this.patterns = new CodePatterns();
  }

  async generateReactComponent(name, props, features) {
    const prompt = `
Generate a React component named ${name} with the following specifications:

Props: ${JSON.stringify(props)}
Features: ${JSON.stringify(features)}

Requirements:
1. Use functional components with hooks
2. Include TypeScript types
3. Follow React best practices
4. Include proper error handling
5. Make it responsive
6. Include accessibility features
7. Add comprehensive comments

Generate complete, production-ready code.
`;

    return await this.aiProvider.generateCode(prompt, {
      projectType: 'React Application',
      techStack: { frontend: 'react', typescript: true }
    });
  }

  async generateExpressAPI(endpoints, features) {
    const prompt = `
Generate an Express.js API with the following specifications:

Endpoints: ${JSON.stringify(endpoints)}
Features: ${JSON.stringify(features)}

Requirements:
1. Use Express.js with proper middleware
2. Include input validation
3. Add error handling
4. Include authentication middleware
5. Add rate limiting
6. Include CORS configuration
7. Add logging
8. Include API documentation
9. Add database integration
10. Follow RESTful principles

Generate complete, production-ready code.
`;

    return await this.aiProvider.generateCode(prompt, {
      projectType: 'Node.js API',
      techStack: { backend: 'nodejs', framework: 'express' }
    });
  }

  async generateDatabaseSchema(entities, relationships) {
    const prompt = `
Generate a database schema with the following specifications:

Entities: ${JSON.stringify(entities)}
Relationships: ${JSON.stringify(relationships)}

Requirements:
1. Use SQL DDL statements
2. Include proper indexes
3. Add foreign key constraints
4. Include data validation
5. Add comments for each table/column
6. Consider performance optimization
7. Include migration scripts
8. Add sample data

Generate complete, production-ready database schema.
`;

    return await this.aiProvider.generateCode(prompt, {
      projectType: 'Database Schema',
      techStack: { database: 'postgresql' }
    });
  }

  async generateTests(code, testType = 'unit') {
    const prompt = `
Generate ${testType} tests for the following code:

Code:
\`\`\`
${code}
\`\`\`

Requirements:
1. Use Jest testing framework
2. Test all functions/methods
3. Include edge cases
4. Test error scenarios
5. Include setup/teardown
6. Add meaningful test descriptions
7. Ensure good coverage
8. Mock external dependencies

Generate comprehensive, production-ready tests.
`;

    return await this.aiProvider.generateTests(prompt, {
      testType: testType,
      framework: 'jest'
    });
  }
}

/**
 * Project Templates
 */
class ProjectTemplates {
  constructor() {
    this.templates = {
      'react-app': {
        name: 'React Application',
        description: 'Modern React app with TypeScript and Tailwind CSS',
        techStack: {
          frontend: 'react',
          typescript: true,
          styling: 'tailwind',
          testing: 'jest'
        },
        structure: this.getReactStructure()
      },
      'node-api': {
        name: 'Node.js API',
        description: 'RESTful API with Express.js and MongoDB',
        techStack: {
          backend: 'nodejs',
          framework: 'express',
          database: 'mongodb',
          testing: 'jest'
        },
        structure: this.getNodeAPIStructure()
      },
      'fullstack-app': {
        name: 'Full-Stack Application',
        description: 'Complete full-stack app with React frontend and Node.js backend',
        techStack: {
          frontend: 'react',
          backend: 'nodejs',
          database: 'postgresql',
          deployment: 'docker'
        },
        structure: this.getFullStackStructure()
      }
    };
  }

  getTemplate(name) {
    return this.templates[name];
  }

  getAllTemplates() {
    return Object.keys(this.templates);
  }

  getReactStructure() {
    return {
      root: {
        name: 'react-app',
        type: 'directory',
        children: [
          {
            name: 'src',
            type: 'directory',
            children: [
              { name: 'components', type: 'directory' },
              { name: 'pages', type: 'directory' },
              { name: 'hooks', type: 'directory' },
              { name: 'utils', type: 'directory' },
              { name: 'types', type: 'directory' },
              { name: 'App.tsx', type: 'file' },
              { name: 'index.tsx', type: 'file' },
              { name: 'App.css', type: 'file' }
            ]
          },
          { name: 'public', type: 'directory' },
          { name: 'package.json', type: 'file' },
          { name: 'tsconfig.json', type: 'file' },
          { name: 'tailwind.config.js', type: 'file' },
          { name: 'vite.config.ts', type: 'file' }
        ]
      }
    };
  }

  getNodeAPIStructure() {
    return {
      root: {
        name: 'node-api',
        type: 'directory',
        children: [
          {
            name: 'src',
            type: 'directory',
            children: [
              { name: 'controllers', type: 'directory' },
              { name: 'models', type: 'directory' },
              { name: 'routes', type: 'directory' },
              { name: 'middleware', type: 'directory' },
              { name: 'utils', type: 'directory' },
              { name: 'config', type: 'directory' },
              { name: 'app.js', type: 'file' },
              { name: 'server.js', type: 'file' }
            ]
          },
          { name: 'tests', type: 'directory' },
          { name: 'package.json', type: 'file' },
          { name: '.env.example', type: 'file' }
        ]
      }
    };
  }

  getFullStackStructure() {
    return {
      root: {
        name: 'fullstack-app',
        type: 'directory',
        children: [
          {
            name: 'frontend',
            type: 'directory',
            children: this.getReactStructure().root.children
          },
          {
            name: 'backend',
            type: 'directory',
            children: this.getNodeAPIStructure().root.children
          },
          {
            name: 'shared',
            type: 'directory',
            children: [
              { name: 'types', type: 'directory' },
              { name: 'utils', type: 'directory' },
              { name: 'constants', type: 'directory' }
            ]
          },
          { name: 'docker-compose.yml', type: 'file' },
          { name: 'README.md', type: 'file' }
        ]
      }
    };
  }
}

// Export classes
window.EnhancedAIProvider = EnhancedAIProvider;
window.CodeGenerationSpecialist = CodeGenerationSpecialist;
window.ProjectTemplates = ProjectTemplates;