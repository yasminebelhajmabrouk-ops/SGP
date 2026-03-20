import { Injectable, NgZone } from '@angular/core';
import { AuthService } from './auth';
import { NotificationService } from './notification';
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { AuditService } from './audit';

export interface SessionConfig {
  warningTime: number; // ms avant avertissement (ex: 5 minutes)
  timeoutTime: number; // ms total avant logout (ex: 30 minutes)
  checkInterval: number; // ms entre les vérifications d'inactivité
}

@Injectable({
  providedIn: 'root',
})
export class SessionTimeoutService {
  private readonly DEFAULT_CONFIG: SessionConfig = {
    warningTime: 25 * 60 * 1000, // 25 minutes (avertissement à 5 min avant timeout)
    timeoutTime: 30 * 60 * 1000, // 30 minutes total
    checkInterval: 60 * 1000, // Vérifier toutes les minutes
  };

  private sessionConfig: SessionConfig = this.DEFAULT_CONFIG;
  private lastActivityTime: number = Date.now();
  private destroy$ = new Subject<void>();
  private warningSubject = new BehaviorSubject<boolean>(false);
  private destroy$$ = new Subject<void>();

  public warning$ = this.warningSubject.asObservable();

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private auditService: AuditService,
    private ngZone: NgZone
  ) {
    this.initializeSessionTracking();
  }

  /**
   * Initialise le suivi de session
   */
  private initializeSessionTracking(): void {
    // Écoute l'authentification
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$$))
      .subscribe(isAuth => {
        if (isAuth) {
          this.startSessionTracking();
        } else {
          this.stopSessionTracking();
        }
      });
  }

  /**
   * Démarre le suivi d'inactivité
   */
  private startSessionTracking(): void {
    this.lastActivityTime = Date.now();
    this.destroy$ = new Subject<void>();

    // Registre les événements utilisateur
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('mousemove', () => this.updateActivity());
      document.addEventListener('keypress', () => this.updateActivity());
      document.addEventListener('click', () => this.updateActivity());
      document.addEventListener('scroll', () => this.updateActivity());
    });

    // Vérification périodique du timeout
    timer(this.sessionConfig.checkInterval, this.sessionConfig.checkInterval)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.checkSessionTimeout());
  }

  /**
   * Arrête le suivi de session
   */
  private stopSessionTracking(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.warningSubject.next(false);

    // Supprime les event listeners
    this.ngZone.runOutsideAngular(() => {
      document.removeEventListener('mousemove', () => this.updateActivity());
      document.removeEventListener('keypress', () => this.updateActivity());
      document.removeEventListener('click', () => this.updateActivity());
      document.removeEventListener('scroll', () => this.updateActivity());
    });
  }

  /**
   * Met à jour l'heure de dernière activité
   */
  private updateActivity(): void {
    this.lastActivityTime = Date.now();
    this.warningSubject.next(false); // Réinitialise l'avertissement
  }

  /**
   * Vérifie si la session a expiré
   */
  private checkSessionTimeout(): void {
    const now = Date.now();
    const inactiveTime = now - this.lastActivityTime;

    if (inactiveTime >= this.sessionConfig.timeoutTime) {
      // Session expirée
      this.handleSessionExpired();
    } else if (
      inactiveTime >= this.sessionConfig.warningTime &&
      !this.warningSubject.value
    ) {
      // Avertissement de session
      this.handleSessionWarning();
    }
  }

  /**
   * Gère l'avertissement de session expirante
   */
  private handleSessionWarning(): void {
    this.warningSubject.next(true);
    const remainingMinutes = Math.ceil(
      (this.sessionConfig.timeoutTime - (Date.now() - this.lastActivityTime)) /
        60000
    );

    this.notificationService.warning(
      `Votre session expirera dans ${remainingMinutes} minute(s). Continuez votre activité pour rester connecté.`
    );

    // Log audit
    this.auditService.log(
      'SESSION_WARNING',
      undefined,
      `Avertissement après ${Math.floor((Date.now() - this.lastActivityTime) / 60000)} min d'inactivité`
    );
  }

  /**
   * Gère l'expiration de session
   */
  private handleSessionExpired(): void {
    this.stopSessionTracking();
    const user = this.authService.getCurrentUser();

    // Log audit
    this.auditService.log(
      'SESSION_TIMEOUT',
      undefined,
      `Utilisateur ${user?.email} - inactivité > 30min`
    );

    // Logout
    this.authService.logout();

    // Notification
    this.notificationService.error(
      'Votre session a expiré. Veuillez vous reconnecter.'
    );
  }

  /**
   * Réactive la session (après warning)
   */
  public extendSession(): void {
    this.lastActivityTime = Date.now();
    this.warningSubject.next(false);

    this.auditService.log(
      'SESSION_EXTENDED',
      undefined,
      'Session prolongée par utilisateur'
    );

    this.notificationService.info('Session prolongée');
  }

  /**
   * Configure le timeout personnalisé
   */
  public setSessionConfig(config: Partial<SessionConfig>): void {
    this.sessionConfig = { ...this.sessionConfig, ...config };
  }

  /**
   * Retourne la configuration actuelle
   */
  public getSessionConfig(): SessionConfig {
    return { ...this.sessionConfig };
  }

  /**
   * Retourne le temps restant avant timeout (en millisecondes)
   */
  public getRemainingTime(): number {
    const inactiveTime = Date.now() - this.lastActivityTime;
    const remaining = this.sessionConfig.timeoutTime - inactiveTime;
    return Math.max(0, remaining);
  }

  /**
   * Retourne le temps restant avant warning (en millisecondes)
   */
  public getRemainingTimeBeforeWarning(): number {
    const inactiveTime = Date.now() - this.lastActivityTime;
    const remaining = this.sessionConfig.warningTime - inactiveTime;
    return Math.max(0, remaining);
  }

  /**
   * Détruit le service
   */
  ngOnDestroy(): void {
    this.stopSessionTracking();
    this.destroy$$.next();
    this.destroy$$.complete();
  }
}
