import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Consultation } from '../models/consultation.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private consultations: Consultation[] = [
    {
      id: '1',
      patientId: '1',
      dateConsultation: '2024-03-15',
      medecin: 'Dr. Michel Dupont',
      diagnostic: 'Infection respiratoire légère',
      observations: 'Toux persistante depuis 3 jours, fièvre légère',
      traitement: 'Antibiotiques (Amoxicilline 500mg) + repos',
      dateCreation: '2024-03-15'
    }
  ];

  private consultationsSubject = new BehaviorSubject<Consultation[]>(this.consultations);
  public consultations$ = this.consultationsSubject.asObservable();

  constructor() {
    this.loadConsultationsFromStorage();
  }

  /**
   * Charge les consultations depuis le localStorage
   */
  private loadConsultationsFromStorage(): void {
    try {
      const stored = localStorage.getItem('consultations');
      if (stored) {
        this.consultations = JSON.parse(stored);
        this.consultationsSubject.next(this.consultations);
      }
    } catch (error) {
      console.error('Erreur loading consultations:', error);
    }
  }

  /**
   * Sauvegarde les consultations dans le localStorage
   */
  private saveConsultationsToStorage(): void {
    try {
      localStorage.setItem('consultations', JSON.stringify(this.consultations));
    } catch (error) {
      console.error('Erreur saving consultations:', error);
    }
  }

  /**
   * Récupère toutes les consultations
   */
  getAllConsultations(): Observable<Consultation[]> {
    return this.consultations$;
  }

  /**
   * Récupère les consultations d'un patient
   */
  getConsultationsByPatient(patientId: string): Observable<Consultation[]> {
    const filtered = this.consultations.filter(c => c.patientId === patientId);
    return new Observable(observer => {
      observer.next(filtered);
      observer.complete();
    });
  }

  /**
   * Récupère une consultation par ID
   */
  getConsultationById(id: string): Consultation | undefined {
    return this.consultations.find(c => c.id === id);
  }

  /**
   * Ajoute une nouvelle consultation
   */
  addConsultation(consultation: Omit<Consultation, 'id' | 'dateCreation'>): Consultation {
    const newConsultation: Consultation = {
      ...consultation,
      id: this.generateId(),
      dateCreation: new Date().toISOString().split('T')[0]
    };

    this.consultations.push(newConsultation);
    this.saveConsultationsToStorage();
    this.consultationsSubject.next([...this.consultations]);

    console.log('[CONSULTATION] Nouvelle consultation ajoutée:', newConsultation);
    return newConsultation;
  }

  /**
   * Met à jour une consultation
   */
  updateConsultation(id: string, updated: Partial<Consultation>): Consultation | undefined {
    const index = this.consultations.findIndex(c => c.id === id);
    if (index !== -1) {
      this.consultations[index] = { ...this.consultations[index], ...updated };
      this.saveConsultationsToStorage();
      this.consultationsSubject.next([...this.consultations]);
      console.log('[CONSULTATION] Consultation mise à jour:', this.consultations[index]);
      return this.consultations[index];
    }
    return undefined;
  }

  /**
   * Supprime une consultation
   */
  deleteConsultation(id: string): boolean {
    const index = this.consultations.findIndex(c => c.id === id);
    if (index !== -1) {
      const deleted = this.consultations.splice(index, 1)[0];
      this.saveConsultationsToStorage();
      this.consultationsSubject.next([...this.consultations]);
      console.log('[CONSULTATION] Consultation supprimée:', deleted);
      return true;
    }
    return false;
  }

  /**
   * Génère un ID unique
   */
  private generateId(): string {
    return 'CONS-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}
