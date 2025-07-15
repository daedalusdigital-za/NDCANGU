import { Injectable } from '@angular/core';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
    } else {
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      if (!/(?=.*[a-z])/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/(?=.*\d)/.test(password)) {
        errors.push('Password must contain at least one number');
      }
      if (!/(?=.*[@$!%*?&])/.test(password)) {
        errors.push('Password must contain at least one special character');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validatePhoneNumber(phoneNumber: string): ValidationResult {
    const errors: string[] = [];
    
    if (!phoneNumber) {
      errors.push('Phone number is required');
    } else {
      // South African phone number validation
      const phoneRegex = /^(\+27|0)[0-9]{9}$/;
      if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
        errors.push('Please enter a valid South African phone number');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateRequired(value: any, fieldName: string): ValidationResult {
    const errors: string[] = [];
    
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${fieldName} is required`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  validateDateOfBirth(dateOfBirth: Date): ValidationResult {
    const errors: string[] = [];
    
    if (!dateOfBirth) {
      errors.push('Date of birth is required');
    } else {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      
      if (birthDate > today) {
        errors.push('Date of birth cannot be in the future');
      }
      
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age > 150) {
        errors.push('Please enter a valid date of birth');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  combineValidationResults(...results: ValidationResult[]): ValidationResult {
    const allErrors = results.flatMap(result => result.errors);
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }
}
