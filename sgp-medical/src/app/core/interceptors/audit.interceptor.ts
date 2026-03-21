import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditService } from '../services/audit';
import { AuthService } from '../services/auth';

/**
 * Audit Logging Interceptor
 * Logs all HTTP requests and responses for compliance (HDS/RGPD)
 * MANDATORY for healthcare applications
 */
@Injectable()
export class AuditInterceptor implements HttpInterceptor {
  constructor(
    private auditService: AuditService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();

    // Log request initiation
    this.logRequest(request, requestId);

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        // Log successful response
        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;
          this.logResponse(request, event, requestId, duration);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Log error response
        const duration = Date.now() - startTime;
        this.logError(request, error, requestId, duration);
        throw error;
      })
    );
  }

  /**
   * Log HTTP request details
   */
  private logRequest(request: HttpRequest<any>, requestId: string): void {
    const user = this.authService.getCurrentUser();
    
    // Anonymize sensitive data in URL
    const sanitizedUrl = this.sanitizeUrl(request.url);
    
    const details = `[${requestId}] ${request.method} ${sanitizedUrl}`;
    
    this.auditService.log(
      'HTTP_REQUEST',
      user?.id,
      details
    );
  }

  /**
   * Log HTTP response details
   */
  private logResponse(
    request: HttpRequest<any>,
    response: HttpResponse<any>,
    requestId: string,
    duration: number
  ): void {
    const user = this.authService.getCurrentUser();
    const sanitizedUrl = this.sanitizeUrl(request.url);
    
    // Extract patient ID if present in URL
    const patientId = this.extractPatientId(request.url);
    
    const details = `[${requestId}] ${response.status} ${response.statusText} - ${duration}ms`;
    
    this.auditService.log(
      'HTTP_RESPONSE',
      patientId || user?.id,
      details
    );
  }

  /**
   * Log HTTP error details
   */
  private logError(
    request: HttpRequest<any>,
    error: HttpErrorResponse,
    requestId: string,
    duration: number
  ): void {
    const user = this.authService.getCurrentUser();
    const sanitizedUrl = this.sanitizeUrl(request.url);
    const patientId = this.extractPatientId(request.url);
    
    const details = `[${requestId}] ERROR ${error.status} - ${duration}ms - ${error.statusText}`;
    
    // Log with higher priority for errors
    this.auditService.log(
      'HTTP_ERROR',
      patientId || user?.id,
      details
    );
  }

  /**
   * Generate unique request ID for tracing
   */
  private generateRequestId(): string {
    return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Sanitize URL to remove sensitive parameters
   */
  private sanitizeUrl(url: string): string {
    // Remove query parameters that might contain sensitive data
    const urlWithoutQuery = url.split('?')[0];
    
    // Mask IDs in URL
    return urlWithoutQuery.replace(/\/[a-f0-9-]{36}/g, '/***');
  }

  /**
   * Extract patient ID from URL if present
   */
  private extractPatientId(url: string): string | null {
    // Pattern: /Patient/:id or /api/fhir/Patient/:id
    const match = url.match(/\/Patient\/([a-f0-9-]+)/);
    return match ? match[1] : null;
  }
}
