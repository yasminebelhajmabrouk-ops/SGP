import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'medecin' | 'infirmier' | 'admin' | 'patient';
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string, role: string): Observable<User> {
    // Simulation de connexion - en production utiliser une vraie API
    return new Observable(observer => {
      setTimeout(() => {
        const mockUser: User = {
          id: '1',
          nom: 'Barbaria',
          prenom: 'Sabri',
          email,
          role: role as any,
          token: 'mock-jwt-token-' + Date.now()
        };
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        localStorage.setItem('authToken', mockUser.token!);
        this.currentUserSubject.next(mockUser);
        this.isAuthenticatedSubject.next(true);
        observer.next(mockUser);
        observer.complete();
      }, 500);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}
