import { TestBed } from '@angular/core/testing';
import { Auth, User } from './auth';

describe('AuthService', () => {
  let service: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Auth],
    });
    service = TestBed.inject(Auth);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null for current user when not authenticated', () => {
    const user = service.getCurrentUser();
    expect(user).toBeNull();
  });

  it('should emit authenticated user after login', (done) => {
    service.login('test@example.com', 'password123', 'medecin').subscribe(user => {
      expect(user.email).toBe('test@example.com');
      expect(user.role).toBe('medecin');
      expect(user.token).toBeDefined();
      done();
    });
  });

  it('should store user in localStorage after login', (done) => {
    service.login('user@test.com', 'pass', 'infirmier').subscribe(() => {
      const storedUser = localStorage.getItem('currentUser');
      expect(storedUser).not.toBeNull();
      const user = JSON.parse(storedUser!);
      expect(user.email).toBe('user@test.com');
      done();
    });
  });

  it('should store token in localStorage after login', (done) => {
    service.login('test@example.com', 'password', 'admin').subscribe(() => {
      const token = localStorage.getItem('authToken');
      expect(token).not.toBeNull();
      expect(token).toContain('mock-jwt-token');
      done();
    });
  });

  it('should update isAuthenticated$ observable after login', (done) => {
    service.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        expect(isAuth).toBe(true);
        done();
      }
    });
    service.login('test@test.com', 'pass', 'patient').subscribe();
  });

  it('should clear localStorage on logout', (done) => {
    service.login('test@example.com', 'password', 'medecin').subscribe(() => {
      service.logout();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(localStorage.getItem('authToken')).toBeNull();
      done();
    });
  });

  it('should set isAuthenticated to false on logout', (done) => {
    service.login('test@example.com', 'password', 'medecin').subscribe(() => {
      service.logout();
      service.isAuthenticated$.subscribe(isAuth => {
        expect(isAuth).toBe(false);
        done();
      });
    });
  });

  it('should return correct token with getToken()', (done) => {
    service.login('test@example.com', 'password', 'medecin').subscribe(() => {
      const token = service.getToken();
      expect(token).not.toBeNull();
      expect(token).toContain('mock-jwt-token');
      done();
    });
  });

  it('should check if user has specific role', (done) => {
    service.login('test@example.com', 'password', 'medecin').subscribe(() => {
      expect(service.hasRole('medecin')).toBe(true);
      expect(service.hasRole('infirmier')).toBe(false);
      done();
    });
  });

  it('should return false for hasRole when not authenticated', () => {
    expect(service.hasRole('medecin')).toBe(false);
  });

  it('should restore user from localStorage on initialization', () => {
    const mockUser: User = {
      id: '123',
      nom: 'Test',
      prenom: 'User',
      email: 'test@example.com',
      role: 'medecin',
      token: 'test-token',
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));

    // Create new service instance to test initialization
    const newService = TestBed.inject(Auth);
    const user = newService.getCurrentUser();
    expect(user).not.toBeNull();
    expect(user?.email).toBe(mockUser.email);
  });

  it('should have all required user properties after login', (done) => {
    service.login('test@medic.fr', 'secure123', 'admin').subscribe(user => {
      expect(user.id).toBeDefined();
      expect(user.nom).toBeDefined();
      expect(user.prenom).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.role).toBeDefined();
      expect(user.token).toBeDefined();
      done();
    });
  });
});
