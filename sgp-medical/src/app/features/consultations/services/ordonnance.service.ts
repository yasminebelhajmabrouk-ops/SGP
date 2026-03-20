import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Ordonnance, Medication } from '../models/consultation.model';

@Injectable({
  providedIn: 'root'
})
export class OrdonnanceService {
  private ordonnances: Ordonnance[] = [
    {
      id: '1',
      patientId: '1',
      dateOrdonnance: '2024-03-15',
      medecin: 'Dr. Michel Dupont',
      medicaments: [
        {
          id: 'MED1',
          nom: 'Amoxicilline',
          dosage: '500mg',
          frequence: '3 fois par jour',
          duree: '7 jours',
          posologie: 'Un comprimé matin, midi, soir avec de l\'eau'
        },
        {
          id: 'MED2',
          nom: 'Doliprane',
          dosage: '500mg',
          frequence: 'Si besoin',
          duree: 'Selon les symptômes',
          posologie: 'Maximum 4 par jour'
        }
      ],
      observations: 'En cas de réaction allergique, arrêter le traitement et consulter',
      dureeValidite: '30 jours',
      dateCreation: '2024-03-15'
    }
  ];

  private ordonnancesSubject = new BehaviorSubject<Ordonnance[]>(this.ordonnances);
  public ordonnances$ = this.ordonnancesSubject.asObservable();

  constructor() {
    this.loadOrdonnancesFromStorage();
  }

  /**
   * Charge les ordonnances depuis le localStorage
   */
  private loadOrdonnancesFromStorage(): void {
    try {
      const stored = localStorage.getItem('ordonnances');
      if (stored) {
        this.ordonnances = JSON.parse(stored);
        this.ordonnancesSubject.next(this.ordonnances);
      }
    } catch (error) {
      console.error('Erreur loading ordonnances:', error);
    }
  }

  /**
   * Sauvegarde les ordonnances dans le localStorage
   */
  private saveOrdonnancesToStorage(): void {
    try {
      localStorage.setItem('ordonnances', JSON.stringify(this.ordonnances));
    } catch (error) {
      console.error('Erreur saving ordonnances:', error);
    }
  }

  /**
   * Récupère toutes les ordonnances
   */
  getAllOrdonnances(): Observable<Ordonnance[]> {
    return this.ordonnances$;
  }

  /**
   * Récupère les ordonnances d'un patient
   */
  getOrdonnancesByPatient(patientId: string): Observable<Ordonnance[]> {
    const filtered = this.ordonnances.filter(o => o.patientId === patientId);
    return new Observable(observer => {
      observer.next(filtered);
      observer.complete();
    });
  }

  /**
   * Récupère une ordonnance par ID
   */
  getOrdonnanceById(id: string): Ordonnance | undefined {
    return this.ordonnances.find(o => o.id === id);
  }

  /**
   * Ajoute une nouvelle ordonnance
   */
  addOrdonnance(ordonnance: Omit<Ordonnance, 'id' | 'dateCreation'>): Ordonnance {
    const newOrdonnance: Ordonnance = {
      ...ordonnance,
      id: this.generateId(),
      dateCreation: new Date().toISOString().split('T')[0]
    };

    this.ordonnances.push(newOrdonnance);
    this.saveOrdonnancesToStorage();
    this.ordonnancesSubject.next([...this.ordonnances]);

    console.log('[ORDONNANCE] Nouvelle ordonnance ajoutée:', newOrdonnance);
    return newOrdonnance;
  }

  /**
   * Met à jour une ordonnance
   */
  updateOrdonnance(id: string, updated: Partial<Ordonnance>): Ordonnance | undefined {
    const index = this.ordonnances.findIndex(o => o.id === id);
    if (index !== -1) {
      this.ordonnances[index] = { ...this.ordonnances[index], ...updated };
      this.saveOrdonnancesToStorage();
      this.ordonnancesSubject.next([...this.ordonnances]);
      console.log('[ORDONNANCE] Ordonnance mise à jour:', this.ordonnances[index]);
      return this.ordonnances[index];
    }
    return undefined;
  }

  /**
   * Supprime une ordonnance
   */
  deleteOrdonnance(id: string): boolean {
    const index = this.ordonnances.findIndex(o => o.id === id);
    if (index !== -1) {
      const deleted = this.ordonnances.splice(index, 1)[0];
      this.saveOrdonnancesToStorage();
      this.ordonnancesSubject.next([...this.ordonnances]);
      console.log('[ORDONNANCE] Ordonnance supprimée:', deleted);
      return true;
    }
    return false;
  }

  /**
   * Génère un ID unique
   */
  private generateId(): string {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}
