import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logLevel: LogLevel = environment.production ? LogLevel.Warn : LogLevel.Debug;

  /**
   * Log debug information (only in development)
   */
  debug(message: string, ...optionalParams: unknown[]): void {
    if (this.shouldLog(LogLevel.Debug)) {
      console.log(`[DEBUG] ${message}`, ...optionalParams);
    }
  }

  /**
   * Log general information (only in development)
   */
  log(message: string, ...optionalParams: unknown[]): void {
    if (this.shouldLog(LogLevel.Info)) {
      console.log(`[INFO] ${message}`, ...optionalParams);
    }
  }

  /**
   * Log warnings (development and production)
   */
  warn(message: string, ...optionalParams: unknown[]): void {
    if (this.shouldLog(LogLevel.Warn)) {
      console.warn(`[WARN] ${message}`, ...optionalParams);
    }
  }

  /**
   * Log errors (always logged, can be sent to monitoring service)
   */
  error(message: string, error?: unknown, ...optionalParams: unknown[]): void {
    if (this.shouldLog(LogLevel.Error)) {
      console.error(`[ERROR] ${message}`, error, ...optionalParams);

      // In production, you can send errors to a monitoring service
      if (environment.production) {
        this.sendToMonitoringService(message, error);
      }
    }
  }

  /**
   * Set the minimum log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private sendToMonitoringService(_message: string, _error?: unknown): void {
    // TODO: Implement integration with error monitoring service
    // Examples: Sentry, Application Insights, LogRocket, etc.
    // For now, this is a placeholder
  }
}
