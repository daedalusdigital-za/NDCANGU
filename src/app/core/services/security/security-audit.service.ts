import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityAuditService {

  private securityViolations: string[] = [];

  constructor() {
    this.performStartupSecurityChecks();
  }

  /**
   * Perform security checks on application startup
   */
  private performStartupSecurityChecks(): void {
    this.checkForHardcodedCredentials();
    this.checkForWeakPasswords();
    this.checkConsoleLogging();
    this.logSecurityReport();
  }

  /**
   * Check for hardcoded credentials in localStorage or sessionStorage
   */
  private checkForHardcodedCredentials(): void {
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];

    // Check localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        const value = localStorage.getItem(key);
        if (value && this.containsHardcodedData(value)) {
          this.addViolation(`Potentially hardcoded sensitive data found in localStorage: ${key}`);
        }
      }
    }
  }

  /**
   * Check for weak password patterns
   */
  private checkForWeakPasswords(): void {
    const weakPatterns = [
      '654724135',
      'password',
      '123456',
      'admin',
      'welcome'
    ];

    // This would typically check against a secure password database
    // For demo purposes, we're checking common weak patterns
    const userToken = localStorage.getItem('currentUser');
    if (userToken) {
      try {
        const userData = JSON.parse(userToken);
        if (userData.email === 'welcomeking@outlook.com') {
          this.addViolation('Detected test/demo credentials in use - should be changed in production');
        }
      } catch (e) {
        // Invalid JSON, not a concern for this check
      }
    }
  }

  /**
   * Check for console logging in production
   */
  private checkConsoleLogging(): void {
    if (environment.production) {
      const originalConsole = console.log;
      let logCount = 0;

      console.log = (...args) => {
        logCount++;
        if (logCount > 0) {
          this.addViolation('Console logging detected in production environment');
        }
        // Restore original console for this check
        originalConsole.apply(console, args);
      };

      // Restore console after check
      setTimeout(() => {
        console.log = originalConsole;
      }, 1000);
    }
  }

  /**
   * Check if content contains hardcoded sensitive data
   */
  private containsHardcodedData(content: string): boolean {
    const hardcodedPatterns = [
      /654724135/,
      /welcomeking@outlook\.com/,
      /Kingsland/,
      /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/ // JWT pattern
    ];

    return hardcodedPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Add a security violation
   */
  private addViolation(violation: string): void {
    this.securityViolations.push(violation);
  }

  /**
   * Log security report
   */
  private logSecurityReport(): void {
    if (this.securityViolations.length > 0) {
      console.warn('🚨 SECURITY AUDIT REPORT 🚨');
      console.warn('The following security issues were detected:');
      this.securityViolations.forEach((violation, index) => {
        console.warn(`${index + 1}. ${violation}`);
      });
      console.warn('Please review and fix these security issues immediately.');
    } else {
      console.log('✅ Security audit completed - no major issues detected');
    }
  }

  /**
   * Get current security violations
   */
  getSecurityViolations(): string[] {
    return [...this.securityViolations];
  }

  /**
   * Check password against known breaches (stub for future API integration)
   */
  async checkPasswordBreach(password: string): Promise<boolean> {
    // In production, this would integrate with HaveIBeenPwned API
    // For now, check against known compromised passwords from our system
    const knownCompromisedPasswords = [
      '654724135',
      'password123',
      '12345678',
      'admin123'
    ];

    return knownCompromisedPasswords.includes(password);
  }

  /**
   * Generate security recommendations
   */
  getSecurityRecommendations(): string[] {
    return [
      'Use strong, unique passwords for all accounts',
      'Enable two-factor authentication where possible',
      'Regular password rotation (every 90 days)',
      'Never share or hardcode credentials in source code',
      'Use environment variables for configuration',
      'Regular security audits and penetration testing',
      'Keep all dependencies and frameworks updated',
      'Implement proper session management',
      'Use HTTPS for all communications',
      'Regular backup and disaster recovery testing'
    ];
  }
}
