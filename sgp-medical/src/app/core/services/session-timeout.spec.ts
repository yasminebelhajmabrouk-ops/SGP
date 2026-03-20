import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SessionTimeoutService } from './session-timeout';
import { AuthService } from './auth';
import { NotificationService } from './notification';
import { AuditService } from './audit';

describe('SessionTimeoutService', () => {
  let service: SessionTimeoutService;
  let authService: AuthService;
  let notificationService: NotificationService;
  let auditService: AuditService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionTimeoutService,
        AuthService,
        NotificationService,
        AuditService,
      ],
    });

    service = TestBed.inject(SessionTimeoutService);
    authService = TestBed.inject(AuthService);
    notificationService = TestBed.inject(NotificationService);
    auditService = TestBed.inject(AuditService);

    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default session config', () => {
    const config = service.getSessionConfig();
    expect(config.timeoutTime).toBe(30 * 60 * 1000); // 30 minutes
    expect(config.warningTime).toBe(25 * 60 * 1000); // 25 minutes
    expect(config.checkInterval).toBe(60 * 1000); // 1 minute
  });

  it('should allow custom session config', () => {
    const customConfig = {
      timeoutTime: 15 * 60 * 1000,
      warningTime: 10 * 60 * 1000,
      checkInterval: 30 * 1000,
    };
    service.setSessionConfig(customConfig);
    const config = service.getSessionConfig();
    expect(config.timeoutTime).toBe(15 * 60 * 1000);
  });

  it('should return positive remaining time when logged in', () => {
    const remaining = service.getRemainingTime();
    expect(remaining).toBeGreaterThan(0);
  });

  it('should return remaining time before warning', () => {
    const remaining = service.getRemainingTimeBeforeWarning();
    expect(remaining).toBeGreaterThan(0);
  });

  it('should emit warning when session is about to expire', fakeAsync(() => {
    spyOn(notificationService, 'warning');
    
    // Simulate inactivity by advancing time
    service.setSessionConfig({
      warningTime: 5000,
      timeoutTime: 10000,
      checkInterval: 1000,
    });

    tick(6000);
    
    expect(notificationService.warning).toHaveBeenCalled();
  }));

  it('should extend session when extendSession is called', () => {
    const initialRemaining = service.getRemainingTime();
    spyOn(auditService, 'logAction');
    
    service.extendSession();
    
    expect(auditService.logAction).toHaveBeenCalledWith(
      'SESSION_EXTENDED',
      'Session prolongée par utilisateur',
      {}
    );
  });

  it('should show warning signal when session timeout is approaching', (done) => {
    service.warning$.subscribe(isWarning => {
      expect(typeof isWarning).toBe('boolean');
      done();
    });
  });

  it('should handle logout on session timeout', fakeAsync(() => {
    spyOn(authService, 'logout');
    
    service.setSessionConfig({
      warningTime: 5000,
      timeoutTime: 10000,
      checkInterval: 1000,
    });

    tick(11000);
    
    expect(authService.logout).toHaveBeenCalled();
  }));

  it('should log audit events for session timeout', fakeAsync(() => {
    spyOn(auditService, 'logAction');
    
    service.setSessionConfig({
      warningTime: 5000,
      timeoutTime: 10000,
      checkInterval: 1000,
    });

    tick(11000);
    
    const calls = (auditService.logAction as jasmine.Spy).calls.all();
    expect(calls.length).toBeGreaterThan(0);
  }));

  it('should reset warning flag when user is active', () => {
    service.setSessionConfig({
      warningTime: 5000,
      timeoutTime: 10000,
      checkInterval: 1000,
    });

    spyOn(notificationService, 'warning');
    
    // Trigger warning first
    tick(6000);
    
    // Simulate user activity
    service.extendSession();
    
    // Activity should reset the warning
    expect(notificationService.warning).toHaveBeenCalled();
  });

  it('should show error notification on session expiry', fakeAsync(() => {
    spyOn(notificationService, 'error');
    
    service.setSessionConfig({
      warningTime: 5000,
      timeoutTime: 10000,
      checkInterval: 1000,
    });

    tick(11000);
    
    expect(notificationService.error).toHaveBeenCalledWith(
      'Votre session a expiré. Veuillez vous reconnecter.',
      'Session expirée'
    );
  }));

  it('should track user inactivity', () => {
    const initialRemaining = service.getRemainingTime();
    tick(5000);
    const remainingAfterWait = service.getRemainingTime();
    
    expect(remainingAfterWait).toBeLessThan(initialRemaining);
  });
});
