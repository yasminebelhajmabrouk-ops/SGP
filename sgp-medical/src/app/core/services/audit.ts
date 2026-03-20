import { Injectable } from '@angular/core';

export interface AuditLog {
  id: string;
  action: string;
  patientId?: string;
  userId?: string;
  timestamp: Date;
  details?: string;
  ipAddress?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private logs: AuditLog[] = [];

  constructor() {
    this.loadLogsFromStorage();
  }

  private loadLogsFromStorage(): void {
    const stored = localStorage.getItem('auditLogs');
    if (stored) {
      this.logs = JSON.parse(stored);
    }
  }

  private saveLogs(): void {
    localStorage.setItem('auditLogs', JSON.stringify(this.logs));
  }

  log(action: string, patientId?: string, details?: string): void {
    const auditLog: AuditLog = {
      id: this.generateId(),
      action,
      patientId,
      userId: this.getCurrentUserId(),
      timestamp: new Date(),
      details,
      ipAddress: 'N/A' // En production, obtenir l'adresse IP du serveur
    };

    this.logs.push(auditLog);
    this.saveLogs();
    
    // Log en console pour le développement
    console.log(`[AUDIT] ${action}`, {
      patientId,
      details,
      timestamp: auditLog.timestamp
    });
  }

  getLogs(): AuditLog[] {
    return [...this.logs];
  }

  getLogsForPatient(patientId: string): AuditLog[] {
    return this.logs.filter(log => log.patientId === patientId);
  }

  getLogsForUser(userId: string): AuditLog[] {
    return this.logs.filter(log => log.userId === userId);
  }

  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('auditLogs');
  }

  private getCurrentUserId(): string {
    const user = localStorage.getItem('currentUser');
    if (user) {
      return JSON.parse(user).id;
    }
    return 'ANONYMOUS';
  }

  private generateId(): string {
    return 'audit-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}
