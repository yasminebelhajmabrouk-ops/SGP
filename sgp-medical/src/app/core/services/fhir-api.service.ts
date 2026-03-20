import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Patient } from '../../features/patients/models/patient.model';

/**
 * FHIR R4 API Service
 * Handles HTTP communication with FHIR-compliant healthcare API
 * Reference: https://www.hl7.org/fhir/r4/patient.html
 */
@Injectable({
  providedIn: 'root'
})
export class FhirApiService {
  private readonly apiUrl = 'http://localhost:3000/api/fhir'; // Backend server
  private readonly patientEndpoint = `${this.apiUrl}/Patient`;

  constructor(private http: HttpClient) {}

  /**
   * Get all patients (FHIR Bundle)
   */
  getPatients(
    pageSize: number = 10,
    pageNumber: number = 1
  ): Observable<any> {
    const params = new HttpParams()
      .set('_count', pageSize.toString())
      .set('_offset', ((pageNumber - 1) * pageSize).toString());

    return this.http.get<any>(this.patientEndpoint, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get single patient by ID
   */
  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(
      `${this.patientEndpoint}/${id}`
    ).pipe(
      map(response => this.convertFhirToPatient(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Search patients by name
   */
  searchPatients(name: string): Observable<any> {
    const params = new HttpParams().set('name', name);

    return this.http.get<any>(this.patientEndpoint, { params }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create new patient (POST)
   */
  createPatient(patient: Partial<Patient>): Observable<Patient> {
    const fhirPayload = this.convertPatientToFhir(patient);

    return this.http.post<any>(this.patientEndpoint, fhirPayload).pipe(
      map(response => this.convertFhirToPatient(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Update existing patient (PUT)
   */
  updatePatient(id: string, patient: Partial<Patient>): Observable<Patient> {
    const fhirPayload = this.convertPatientToFhir(patient);

    return this.http.put<any>(
      `${this.patientEndpoint}/${id}`,
      fhirPayload
    ).pipe(
      map(response => this.convertFhirToPatient(response)),
      catchError(this.handleError)
    );
  }

  /**
   * Delete patient (DELETE)
   */
  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.patientEndpoint}/${id}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get patient allergies
   */
  getPatientAllergies(patientId: string): Observable<any> {
    return this.http.get<any>(
      `${this.patientEndpoint}/${patientId}/Condition`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Add allergy to patient
   */
  addPatientAllergy(patientId: string, allergy: any): Observable<any> {
    return this.http.post<any>(
      `${this.patientEndpoint}/${patientId}/Condition`,
      allergy
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get patient observations (vital signs)
   */
  getPatientObservations(patientId: string): Observable<any> {
    return this.http.get<any>(
      `${this.patientEndpoint}/${patientId}/Observation`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Record vital signs observation
   */
  recordVitalSigns(patientId: string, vitals: any): Observable<any> {
    return this.http.post<any>(
      `${this.patientEndpoint}/${patientId}/Observation`,
      vitals
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Convert Patient model to FHIR format
   */
  private convertPatientToFhir(patient: Partial<Patient>): any {
    return {
      resourceType: 'Patient',
      identifier: patient.ins ? [{ system: 'http://www.aphp.fr/INS', value: patient.ins }] : [],
      name: [
        {
          use: 'official',
          family: patient.nom,
          given: [patient.prenom]
        }
      ],
      telecom: [
        { system: 'email', value: patient.email },
        { system: 'phone', value: patient.telephone }
      ],
      gender: patient.sexe?.toLowerCase(),
      birthDate: patient.dateNaissance?.toString().split('T')[0],
      address: patient.adresse ? [
        {
          line: [patient.adresse.ligne1, patient.adresse.ligne2].filter(Boolean),
          postalCode: patient.adresse.codePostal,
          city: patient.adresse.ville,
          country: patient.adresse.pays
        }
      ] : [],
      contact: [],
      extension: [
        {
          url: 'http://example.com/group-sanguin',
          valueCode: patient.groupeSanguin
        }
      ]
    };
  }

  /**
   * Convert FHIR format to Patient model
   */
  private convertFhirToPatient(fhirPatient: any): Patient {
    const nameInfo = fhirPatient.name?.[0] || {};
    const telecominfo = fhirPatient.telecom || [];
    const address = fhirPatient.address?.[0] || {};

    return {
      id: fhirPatient.id || '',
      ins: fhirPatient.identifier?.[0]?.value || '',
      nom: nameInfo.family || '',
      prenom: nameInfo.given?.[0] || '',
      dateNaissance: new Date(fhirPatient.birthDate || Date.now()),
      sexe: (fhirPatient.gender?.toUpperCase() as any) || 'I',
      email: telecominfo.find((t: any) => t.system === 'email')?.value || '',
      telephone: telecominfo.find((t: any) => t.system === 'phone')?.value || '',
      groupeSanguin: fhirPatient.extension?.find((e: any) => e.url.includes('sanguin'))?.valueCode || 'O+',
      adresse: {
        ligne1: address.line?.[0] || '',
        ligne2: address.line?.[1] || '',
        codePostal: address.postalCode || '',
        ville: address.city || '',
        pays: address.country || 'France'
      },
      medecinTraitantId: '',
      allergies: [],
      antecedents: [],
      traitementEnCours: [],
      statut: 'actif',
      niveauUrgence: 'vert',
      dernieresConstantes: {
        tensionSystolique: 0,
        tensionDiastolique: 0,
        frequenceCardiaque: 0,
        temperature: 0,
        saturationO2: 0,
        poids: 0,
        taille: 0,
        dateMesure: new Date()
      },
      dateCreation: new Date(fhirPatient.meta?.lastUpdated || Date.now()),
      dateDerniereModification: new Date(fhirPatient.meta?.lastUpdated || Date.now()),
      consentement: true
    };
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);

    let errorMessage = 'Une erreur est survenue lors de la communication avec le serveur.';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else if (error.status) {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide. Vérifiez les données.';
          break;
        case 401:
          errorMessage = 'Non autorisé. Authentification requise.';
          break;
        case 403:
          errorMessage = 'Accès refusé.';
          break;
        case 404:
          errorMessage = 'Ressource non trouvée.';
          break;
        case 500:
          errorMessage = 'Erreur serveur. Veuillez réessayer.';
          break;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
