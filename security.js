// Security Module for Multi-Agent System
class SecurityManager {
  constructor() {
    this.permissions = new Map();
    this.sandboxConfig = {
      allowFileSystem: true,
      allowNetwork: true,
      allowExecution: true,
      maxExecutionTime: 30000, // 30 seconds
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
      allowedDomains: ['localhost', '127.0.0.1'],
      blockedPatterns: [
        /eval\(/,
        /Function\(/,
        /setTimeout\(/,
        /setInterval\(/,
        /import\(/,
        /require\(/
      ]
    };
    this.auditLog = [];
    this.rateLimits = new Map();
    this.quarantine = new Set();
  }

  // Permission Management
  grantPermission(agentId, permission) {
    if (!this.permissions.has(agentId)) {
      this.permissions.set(agentId, new Set());
    }
    this.permissions.get(agentId).add(permission);
    this.logAudit('permission_granted', { agentId, permission });
  }

  revokePermission(agentId, permission) {
    if (this.permissions.has(agentId)) {
      this.permissions.get(agentId).delete(permission);
      this.logAudit('permission_revoked', { agentId, permission });
    }
  }

  hasPermission(agentId, permission) {
    return this.permissions.has(agentId) && 
           this.permissions.get(agentId).has(permission);
  }

  // Code Sanitization
  sanitizeCode(code) {
    // Remove potentially dangerous patterns
    let sanitized = code;
    
    this.sandboxConfig.blockedPatterns.forEach(pattern => {
      if (pattern.test(sanitized)) {
        this.logAudit('dangerous_code_detected', { pattern: pattern.toString() });
        sanitized = sanitized.replace(pattern, '/* BLOCKED */');
      }
    });

    // Remove comments that might contain malicious content
    sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, '');
    sanitized = sanitized.replace(/\/\/.*$/gm, '');

    return sanitized;
  }

  // Sandbox Execution
  async executeInSandbox(code, agentId) {
    if (!this.hasPermission(agentId, 'execute')) {
      throw new Error('Agent does not have execution permission');
    }

    if (this.quarantine.has(agentId)) {
      throw new Error('Agent is quarantined');
    }

    const sanitizedCode = this.sanitizeCode(code);
    
    // Check rate limits
    if (!this.checkRateLimit(agentId)) {
      throw new Error('Rate limit exceeded');
    }

    try {
      // Create a sandboxed execution context
      const sandbox = this.createSandbox(agentId);
      
      // Execute with timeout
      const result = await this.executeWithTimeout(
        () => this.runInSandbox(sanitizedCode, sandbox),
        this.sandboxConfig.maxExecutionTime
      );

      this.logAudit('code_executed', { agentId, success: true });
      return result;
    } catch (error) {
      this.logAudit('code_execution_failed', { agentId, error: error.message });
      throw error;
    }
  }

  createSandbox(agentId) {
    const sandbox = {
      console: {
        log: (...args) => this.logAudit('console_log', { agentId, args }),
        error: (...args) => this.logAudit('console_error', { agentId, args }),
        warn: (...args) => this.logAudit('console_warn', { agentId, args })
      },
      setTimeout: (fn, delay) => {
        if (delay > 5000) {
          throw new Error('setTimeout delay too long');
        }
        return setTimeout(fn, delay);
      },
      setInterval: (fn, delay) => {
        if (delay > 5000) {
          throw new Error('setInterval delay too long');
        }
        return setInterval(fn, delay);
      }
    };

    // Add file system access if permitted
    if (this.hasPermission(agentId, 'filesystem')) {
      sandbox.fs = this.createFileSystemInterface(agentId);
    }

    // Add network access if permitted
    if (this.hasPermission(agentId, 'network')) {
      sandbox.fetch = this.createNetworkInterface(agentId);
    }

    return sandbox;
  }

  createFileSystemInterface(agentId) {
    return {
      readFile: async (path) => {
        this.logAudit('file_read', { agentId, path });
        // Implement safe file reading
        return 'File content';
      },
      writeFile: async (path, content) => {
        this.logAudit('file_write', { agentId, path });
        // Implement safe file writing
        return true;
      },
      listFiles: async (path) => {
        this.logAudit('file_list', { agentId, path });
        // Implement safe file listing
        return [];
      }
    };
  }

  createNetworkInterface(agentId) {
    return async (url, options = {}) => {
      // Validate URL
      const urlObj = new URL(url);
      if (!this.sandboxConfig.allowedDomains.includes(urlObj.hostname)) {
        throw new Error('Domain not allowed');
      }

      this.logAudit('network_request', { agentId, url });
      
      // Implement safe network request
      return {
        ok: true,
        status: 200,
        json: async () => ({}),
        text: async () => 'Response'
      };
    };
  }

  runInSandbox(code, sandbox) {
    // Create a function with sandboxed context
    const func = new Function('sandbox', `
      with (sandbox) {
        ${code}
      }
    `);
    
    return func(sandbox);
  }

  async executeWithTimeout(fn, timeout) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Execution timeout'));
      }, timeout);

      try {
        const result = fn();
        if (result instanceof Promise) {
          result.then(resolve).catch(reject).finally(() => clearTimeout(timer));
        } else {
          clearTimeout(timer);
          resolve(result);
        }
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  // Rate Limiting
  checkRateLimit(agentId) {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 100;

    if (!this.rateLimits.has(agentId)) {
      this.rateLimits.set(agentId, []);
    }

    const requests = this.rateLimits.get(agentId);
    
    // Remove old requests
    const validRequests = requests.filter(time => now - time < windowMs);
    this.rateLimits.set(agentId, validRequests);

    if (validRequests.length >= maxRequests) {
      this.logAudit('rate_limit_exceeded', { agentId });
      return false;
    }

    validRequests.push(now);
    return true;
  }

  // Quarantine Management
  quarantineAgent(agentId, reason) {
    this.quarantine.add(agentId);
    this.logAudit('agent_quarantined', { agentId, reason });
  }

  releaseAgent(agentId) {
    this.quarantine.delete(agentId);
    this.logAudit('agent_released', { agentId });
  }

  isQuarantined(agentId) {
    return this.quarantine.has(agentId);
  }

  // Audit Logging
  logAudit(action, details) {
    const entry = {
      timestamp: new Date(),
      action,
      details,
      id: Date.now() + Math.random()
    };
    
    this.auditLog.push(entry);
    
    // Keep only last 1000 entries
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-1000);
    }

    console.log(`[AUDIT] ${action}:`, details);
  }

  getAuditLog(filter = {}) {
    let filtered = this.auditLog;
    
    if (filter.action) {
      filtered = filtered.filter(entry => entry.action === filter.action);
    }
    
    if (filter.agentId) {
      filtered = filtered.filter(entry => entry.details.agentId === filter.agentId);
    }
    
    if (filter.since) {
      filtered = filtered.filter(entry => entry.timestamp >= filter.since);
    }

    return filtered;
  }

  // Security Monitoring
  detectAnomalies() {
    const anomalies = [];
    const now = Date.now();
    const recentWindow = 5 * 60 * 1000; // 5 minutes

    // Check for excessive failed executions
    const recentFailures = this.auditLog
      .filter(entry => entry.action === 'code_execution_failed' && 
                      now - entry.timestamp.getTime() < recentWindow)
      .length;

    if (recentFailures > 10) {
      anomalies.push({
        type: 'excessive_failures',
        severity: 'high',
        count: recentFailures,
        message: 'High number of execution failures detected'
      });
    }

    // Check for suspicious patterns
    const suspiciousPatterns = this.auditLog
      .filter(entry => entry.action === 'dangerous_code_detected' && 
                      now - entry.timestamp.getTime() < recentWindow)
      .length;

    if (suspiciousPatterns > 5) {
      anomalies.push({
        type: 'suspicious_patterns',
        severity: 'critical',
        count: suspiciousPatterns,
        message: 'Multiple dangerous code patterns detected'
      });
    }

    return anomalies;
  }

  // Security Configuration
  updateSandboxConfig(newConfig) {
    this.sandboxConfig = { ...this.sandboxConfig, ...newConfig };
    this.logAudit('sandbox_config_updated', { config: newConfig });
  }

  getSecurityStatus() {
    return {
      quarantinedAgents: Array.from(this.quarantine),
      totalPermissions: Array.from(this.permissions.values()).reduce((sum, perms) => sum + perms.size, 0),
      auditLogSize: this.auditLog.length,
      anomalies: this.detectAnomalies(),
      sandboxConfig: this.sandboxConfig
    };
  }
}

// Export for use in main system
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SecurityManager;
} else if (typeof window !== 'undefined') {
  window.SecurityManager = SecurityManager;
}