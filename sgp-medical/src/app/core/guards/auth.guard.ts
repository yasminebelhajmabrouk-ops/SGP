import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';
import { NotificationService } from '../services/notification';
import { Observable } from 'rxjs';

/**
 * AuthGuard
 * Protects routes that require authentication
 * Usage: canActivate: [AuthGuard]
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      return true;
    }

    // Not logged in, redirect to login
    this.notificationService.warning('Veuillez vous connecter.');
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}

/**
 * RoleGuard
 * Restricts access based on user role
 * Usage: canActivate: [RoleGuard], data: { roles: ['medecin', 'admin'] }
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.authService.getCurrentUser();
    const requiredRoles: string[] = route.data['roles'];

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No role requirement
    }

    if (!currentUser) {
      this.notificationService.warning('Authentification requise.');
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredRoles.includes(currentUser.role)) {
      return true;
    }

    // Insufficient permissions
    this.notificationService.error('Accès refusé. Permissions insuffisantes.');
    this.router.navigate(['/patients']);
    return false;
  }
}

/**
 * CanDeactivateGuard
 * Confirms before leaving a page with unsaved changes
 * Usage: canDeactivate: [CanDeactivateGuard]
 */

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {
  canDeactivate(component: ComponentCanDeactivate): Observable<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}

/**
 * AdminGuard
 * Restricts access to admin users only
 * Usage: canActivate: [AdminGuard]
 */
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser && currentUser.role === 'admin') {
      return true;
    }

    this.notificationService.error('Accès administrateur requis.');
    this.router.navigate(['/patients']);
    return false;
  }
}
