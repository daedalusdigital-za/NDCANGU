import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

export interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
  context?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  constructor(private toastr: ToastrService) {}

  handleError(error: any, context?: string): void {
    const errorMessage = this.getErrorMessage(error);
    
    // Log error for debugging in development
    if (!environment.production) {
      console.error('Error occurred:', error);
    }

    // Show user-friendly message
    this.toastr.error(errorMessage, 'Error');

    // Log error to external service in production
    this.logError(error, context);
  }

  private getErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    if (error?.error?.message) {
      return error.error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }

  private logError(error: any, context?: string): void {
    const errorLog: ErrorLog = {
      message: this.getErrorMessage(error),
      stack: error?.stack,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context
    };

    // In a real application, send this to your logging service
    // Example: this.http.post('/api/log-error', errorLog).subscribe();
    
    // For now, store in localStorage for debugging
    try {
      const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingLogs.push(errorLog);
      
      // Keep only last 50 errors
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50);
      }
      
      localStorage.setItem('errorLogs', JSON.stringify(existingLogs));
    } catch (e) {
      // Silent fail for localStorage issues
    }
  }

  showSuccess(message: string): void {
    this.toastr.success(message, 'Success');
  }

  showInfo(message: string): void {
    this.toastr.info(message, 'Info');
  }

  showWarning(message: string): void {
    this.toastr.warning(message, 'Warning');
  }
}
