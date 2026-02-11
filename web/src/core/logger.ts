/**
 * Centralized Logging Utility
 * 
 * Provides structured logging with environment-aware levels
 * No PII (Personally Identifiable Information) in logs
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.MODE === 'development';
    this.isProduction = import.meta.env.MODE === 'production';
  }

  private sanitize(data: any): any {
    // Remove sensitive fields
    const sensitiveKeys = ['password', 'token', 'accessToken', 'refreshToken', 'authorization', 'apiKey', 'secret'];
    
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitize(item));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = this.sanitize(value);
      }
    }

    return sanitized;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context ? this.sanitize(context) : undefined,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
      } as any : undefined,
    };
  }

  private log(entry: LogEntry): void {
    // In production, only log warnings and errors
    if (this.isProduction && (entry.level === 'debug' || entry.level === 'info')) {
      return;
    }

    const logMethod = {
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
    }[entry.level];

    if (this.isDevelopment) {
      logMethod(`[${entry.level.toUpperCase()}] ${entry.message}`, entry);
    } else {
      // In production, send to logging service (e.g., Sentry, LogRocket)
      // For now, just log errors
      if (entry.level === 'error') {
        logMethod(entry.message, entry);
        // TODO: Send to error tracking service
        // errorTrackingService.captureException(entry.error, { extra: entry.context });
      }
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(this.createLogEntry('debug', message, context));
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(this.createLogEntry('info', message, context));
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(this.createLogEntry('warn', message, context));
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log(this.createLogEntry('error', message, context, error));
  }

  // Performance logging
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
  }
}

export const logger = new Logger();






