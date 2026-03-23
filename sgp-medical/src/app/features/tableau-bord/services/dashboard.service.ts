import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface Statistique {
  title: string;
  value: number;
  icon: string;
  color: string;
  trend: number;
  unit: string;
}

export interface Alerte {
  id: string;
  patient: string;
  type: 'urgent' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  actions?: string[];
}

export interface Consultation {
  id: string;
  patient: string;
  medecin: string;
  date: Date;
  heure: string;
  type: string;
  statut: 'confirmée' | 'en attente' | 'annulée';
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private statistiquesSubject = new BehaviorSubject<Statistique[]>([]);
  private alertesSubject = new BehaviorSubject<Alerte[]>([]);
  private consultationsSubject = new BehaviorSubject<Consultation[]>([]);

  statistiques$: Observable<Statistique[]> = this.statistiquesSubject.asObservable();
  alertes$: Observable<Alerte[]> = this.alertesSubject.asObservable();
  consultations$: Observable<Consultation[]> = this.consultationsSubject.asObservable();

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    // Simulation du chargement des statistiques
    const stats: Statistique[] = [
      {
        title: 'Total Patients',
        value: 156,
        icon: '👥',
        color: '#667eea',
        trend: 12,
        unit: 'patients'
      },
      {
        title: 'Consultations Aujourd\'hui',
        value: 24,
        icon: '📅',
        color: '#764ba2',
        trend: 5,
        unit: 'consultations'
      },
      {
        title: 'Ordonnances en Attente',
        value: 8,
        icon: '📝',
        color: '#f093fb',
        trend: -2,
        unit: 'ordonnances'
      },
      {
        title: 'Cas Urgents',
        value: 3,
        icon: '⚠️',
        color: '#ef4444',
        trend: 1,
        unit: 'urgences'
      }
    ];

    const alertes: Alerte[] = [
      {
        id: '1',
        patient: 'Marie Dupont',
        type: 'urgent',
        message: 'Suivi post-opératoire recommandé',
        timestamp: new Date(),
        actions: ['Voir dossier', 'Programmer RDV']
      },
      {
        id: '2',
        patient: 'Jean Martin',
        type: 'warning',
        message: 'Ordonnance expirée - Renouvellement requis',
        timestamp: new Date(new Date().getTime() - 3600000),
        actions: ['Renouveler']
      },
      {
        id: '3',
        patient: 'Sophie Laurent',
        type: 'info',
        message: 'Rappel consultation dans 2 jours',
        timestamp: new Date(new Date().getTime() - 7200000),
        actions: ['Plus d\'info']
      }
    ];

    const consultations: Consultation[] = [
      {
        id: '1',
        patient: 'Antoine Bernard',
        medecin: 'Dr. Durand',
        date: new Date(),
        heure: '09:30',
        type: 'Consultation générale',
        statut: 'confirmée'
      },
      {
        id: '2',
        patient: 'Claire Dubois',
        medecin: 'Dr. Martin',
        date: new Date(),
        heure: '10:15',
        type: 'Suivi cardiologie',
        statut: 'confirmée'
      },
      {
        id: '3',
        patient: 'Michel Rousseau',
        medecin: 'Dr. Durand',
        date: new Date(),
        heure: '11:00',
        type: 'Visite de contrôle',
        statut: 'en attente'
      },
      {
        id: '4',
        patient: 'Nathalie Fournier',
        medecin: 'Dr. Laurent',
        date: new Date(),
        heure: '14:00',
        type: 'Consultation spécialisée',
        statut: 'confirmée'
      }
    ];

    this.statistiquesSubject.next(stats);
    this.alertesSubject.next(alertes);
    this.consultationsSubject.next(consultations);
  }

  getStatistiques(): Observable<Statistique[]> {
    return this.statistiques$.pipe(
      delay(300) // Simulation d'un appel API
    );
  }

  getAlertes(): Observable<Alerte[]> {
    return this.alertes$.pipe(
      delay(300)
    );
  }

  getConsultations(): Observable<Consultation[]> {
    return this.consultations$.pipe(
      delay(300)
    );
  }

  getConsultationsParDate(date: Date): Observable<Consultation[]> {
    return this.consultations$.pipe(
      map(consultations =>
        consultations.filter(c =>
          c.date.toDateString() === date.toDateString()
        )
      )
    );
  }

  supprimerAlerte(alerteId: string): void {
    const alertes = this.alertesSubject.value.filter(a => a.id !== alerteId);
    this.alertesSubject.next(alertes);
  }
}
