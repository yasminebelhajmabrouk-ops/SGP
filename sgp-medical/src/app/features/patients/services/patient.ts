import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Patient, 
  Allergie, 
  ConstantesVitales 
} from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  public patients$ = this.patientsSubject.asObservable();

  private mockPatients: Patient[] = [
    {
      id: '1',
      ins: '1234567890123456789',
      nom: 'Dupont',
      prenom: 'Jean',
      dateNaissance: new Date('1975-05-12'),
      sexe: 'M',
      groupeSanguin: 'O+',
      adresse: {
        ligne1: '123 rue de la Paix',
        codePostal: '75000',
        ville: 'Paris',
        pays: 'France'
      },
      telephone: '01 23 45 67 89',
      email: 'jean.dupont@gmail.com',
      medecinTraitantId: 'doc-001',
      statut: 'actif',
      niveauUrgence: 'vert',
      allergies: [
        {
          id: 'allergy-1',
          substance: 'Pénicilline',
          reaction: 'Urticaire',
          severite: 'moderee',
          dateDeclaration: new Date('2023-01-15')
        }
      ],
      antecedents: ['Diabète', 'Hypertension'],
      traitementEnCours: ['Metformine 500mg', 'Atorvastatine 20mg'],
      dernieresConstantes: {
        tensionSystolique: 130,
        tensionDiastolique: 85,
        frequenceCardiaque: 72,
        temperature: 36.8,
        saturationO2: 98,
        poids: 85,
        taille: 180,
        dateMesure: new Date()
      },
      dateCreation: new Date('2023-01-10'),
      dateDerniereModification: new Date(),
      consentement: true
    },
    {
      id: '2',
      ins: '9876543210987654321',
      nom: 'Martin',
      prenom: 'Marie',
      dateNaissance: new Date('1982-08-25'),
      sexe: 'F',
      groupeSanguin: 'A+',
      adresse: {
        ligne1: '456 avenue des Champs',
        codePostal: '69000',
        ville: 'Lyon',
        pays: 'France'
      },
      telephone: '04 72 34 56 78',
      email: 'marie.martin@email.com',
      medecinTraitantId: 'doc-002',
      statut: 'actif',
      niveauUrgence: 'jaune',
      allergies: [],
      antecedents: ['Asthme'],
      traitementEnCours: ['Salbutamol'],
      dernieresConstantes: {
        tensionSystolique: 120,
        tensionDiastolique: 80,
        frequenceCardiaque: 68,
        temperature: 37.0,
        saturationO2: 99,
        poids: 65,
        taille: 165,
        dateMesure: new Date()
      },
      dateCreation: new Date('2023-02-15'),
      dateDerniereModification: new Date(),
      consentement: true
    }
  ];

  constructor() {
    this.loadPatients();
  }

  private loadPatients(): void {
    const stored = localStorage.getItem('patients');
    if (stored) {
      this.patientsSubject.next(JSON.parse(stored));
    } else {
      this.patientsSubject.next(this.mockPatients);
      this.savePatients();
    }
  }

  private savePatients(): void {
    localStorage.setItem('patients', JSON.stringify(this.patientsSubject.value));
  }

  getPatients(): Observable<Patient[]> {
    return this.patients$;
  }

  getPatientById(id: string): Patient | undefined {
    return this.patientsSubject.value.find(p => p.id === id);
  }

  addPatient(patient: Omit<Patient, 'id' | 'dateCreation' | 'dateDerniereModification'>): Patient {
    const newPatient: Patient = {
      ...patient,
      id: this.generateId(),
      dateCreation: new Date(),
      dateDerniereModification: new Date()
    };

    const patients = [...this.patientsSubject.value];
    patients.push(newPatient);
    this.patientsSubject.next(patients);
    this.savePatients();

    return newPatient;
  }

  updatePatient(id: string, updates: Partial<Patient>): void {
    const patients = this.patientsSubject.value.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          id: p.id, // Ne pas permettre de changer l'ID
          dateCreation: p.dateCreation, // Ne pas permettre de changer la date de création
          dateDerniereModification: new Date()
        };
      }
      return p;
    });

    this.patientsSubject.next(patients);
    this.savePatients();
  }

  deletePatient(id: string): void {
    const patients = this.patientsSubject.value.filter(p => p.id !== id);
    this.patientsSubject.next(patients);
    this.savePatients();
  }

  addAllergy(patientId: string, allergie: Omit<Allergie, 'id'>): void {
    const patient = this.getPatientById(patientId);
    if (patient) {
      const newAllergie: Allergie = {
        ...allergie,
        id: this.generateId()
      };

      patient.allergies.push(newAllergie);
      this.updatePatient(patientId, { allergies: patient.allergies });
    }
  }

  updateVitals(patientId: string, vitals: ConstantesVitales): void {
    const patient = this.getPatientById(patientId);
    if (patient) {
      this.updatePatient(patientId, { dernieresConstantes: vitals });
    }
  }

  private generateId(): string {
    return 'patient-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
}
