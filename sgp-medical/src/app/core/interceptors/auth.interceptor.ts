import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth';
import { NotificationService } from '../services/notification';

/**
 * JWT Authentication Interceptor
 * Automatically injects JWT token in Authorization header
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get JWT token from AuthService
    const token = this.authService.getToken();

    // Add token to request headers if available
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur réseau est survenue';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 401:
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          this.authService.logout();
          break;
        case 403:
          errorMessage = 'Accès refusé. Permissions insuffisantes.';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée.';
          break;
        case 500:
          errorMessage = 'Erreur serveur. Veuillez réessayer.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.statusText}`;
      }
    }

    this.notificationService.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

/**
 * Loading State Interceptor
 * Tracks HTTP requests for loading indicators
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private requestCount = 0;

  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Increment request count
    this.requestCount++;
    this.updateLoadingState();

    return next.handle(request).pipe(
      catchError((error) => {
        // Decrement on error
        this.requestCount--;
        this.updateLoadingState();
        return throwError(() => error);
      }),
      (obs) => {
        // Decrement on complete
        obs.subscribe({
          complete: () => {
            this.requestCount--;
            this.updateLoadingState();
          }
        });
        return obs;
      }
    );
  }

  private updateLoadingState(): void {
    // Can trigger global loading indicator here
    // For now we just track it
    console.log(`Active requests: ${this.requestCount}`);
  }
}

/**
 * Cache Interceptor
 * Cache GET requests for improved performance
 */
@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle(request);
    }

    // Check cache
    const cachedData = this.cache.get(request.url);
    if (
      cachedData &&
      Date.now() - cachedData.timestamp < this.CACHE_DURATION
    ) {
      console.log(`Cache hit: ${request.url}`);
      return new Observable((observer) => {
        observer.next({ body: cachedData.data } as any);
        observer.complete();
      });
    }

    // Fetch and cache
    return next.handle(request).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
