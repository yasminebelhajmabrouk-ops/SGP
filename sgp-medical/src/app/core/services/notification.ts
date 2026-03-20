import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'urgence';
  message: string;
  timestamp: Date;
  dismissed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$ = this.alertsSubject.asObservable();

  constructor() {}

  info(message: string): void {
    this.addAlert('info', message);
  }

  warning(message: string): void {
    this.addAlert('warning', message);
  }

  error(message: string): void {
    this.addAlert('error', message);
  }

  urgence(message: string): void {
    this.addAlert('urgence', message);
    // Joueur un son d'alerte si disponible
    this.playAlertSound();
  }

  private addAlert(type: 'info' | 'warning' | 'error' | 'urgence', message: string): void {
    const alerts = this.alertsSubject.value;
    const newAlert: Alert = {
      id: 'alert-' + Date.now(),
      type,
      message,
      timestamp: new Date(),
      dismissed: false
    };

    alerts.push(newAlert);
    this.alertsSubject.next([...alerts]);

    // Auto-dismiss après 5 secondes (sauf pour les urgences)
    if (type !== 'urgence') {
      setTimeout(() => this.dismissAlert(newAlert.id), 5000);
    }
  }

  dismissAlert(id: string): void {
    const alerts = this.alertsSubject.value;
    const alert = alerts.find(a => a.id === id);
    if (alert) {
      alert.dismissed = true;
      this.alertsSubject.next([...alerts]);
    }
  }

  clearAll(): void {
    this.alertsSubject.next([]);
  }

  private playAlertSound(): void {
    // Jouer un son avec une API audio
    try {
      const audioContext = new (window as any).AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
      // Silently ignore audio errors
    }
  }
}
