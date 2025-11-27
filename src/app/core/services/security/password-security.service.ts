import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordSecurityService {

  /**
   * Generate a secure random temporary password
   * @param length Length of the password (default: 12)
   * @returns Secure random password
   */
  generateSecurePassword(length: number = 12): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';

    // Ensure at least one character from each category
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*';

    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }

  /**
   * Validate password strength
   * @param password Password to validate
   * @returns Validation result with score and feedback
   */
  validatePasswordStrength(password: string): {
    score: number;
    feedback: string[];
    isValid: boolean;
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('Password must be at least 8 characters long');
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain at least one uppercase letter');
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain at least one lowercase letter');
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain at least one number');
    }

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password must contain at least one special character');
    }

    // Check for common weak patterns
    const weakPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /admin/i,
      /welcome/i,
      /654724135/, // Our old hardcoded password
      /kingsland/i
    ];

    for (const pattern of weakPatterns) {
      if (pattern.test(password)) {
        score -= 2;
        feedback.push('Password contains common weak patterns');
        break;
      }
    }

    return {
      score: Math.max(0, score),
      feedback,
      isValid: score >= 4 && feedback.length === 0
    };
  }

  /**
   * Check if password has been in known breaches (basic patterns)
   * In production, this should connect to services like HaveIBeenPwned
   */
  checkBreachedPasswords(password: string): boolean {
    const knownBreachedPatterns = [
      '654724135', // Our old default password
      'password123',
      '12345678',
      'admin123',
      'welcome123'
    ];

    return knownBreachedPatterns.some(pattern =>
      password.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  /**
   * Generate secure reset token
   */
  generateResetToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}
