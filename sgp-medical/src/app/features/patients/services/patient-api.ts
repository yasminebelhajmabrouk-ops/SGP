import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientApiService {
  private apiUrl = 'http://localhost:3000/api'; // À remplacer par une vraie API FHIR

  constructor(private http: HttpClient) {}

  // Endpoint FHIR: GET /Patient
  getPatients(): Observable<{ resourceType: string; entry: any[] }> {
    // En production, utiliser cet endpoint
    // return this.http.get<any>(`${this.apiUrl}/Patient`);
    
    // Pour cette démo, retourner un Observable vide
    return of({ resourceType: 'Bundle', entry: [] });
  }

  // Endpoint FHIR: GET /Patient/:id
  getPatientById(id: string): Observable<Patient> {
    // En production
    // return this.http.get<Patient>(`${this.apiUrl}/Patient/${id}`);
    
    return of(null as any);
  }

  // Endpoint FHIR: POST /Patient
  createPatient(patient: Omit<Patient, 'id' | 'dateCreation' | 'dateDerniereModification'>): Observable<Patient> {
    // En production
    // return this.http.post<Patient>(`${this.apiUrl}/Patient`, patient);
    
    return of(patient as any);
  }

  // Endpoint FHIR: PUT /Patient/:id
  updatePatient(id: string, patient: Partial<Patient>): Observable<Patient> {
    // En production
    // return this.http.put<Patient>(`${this.apiUrl}/Patient/${id}`, patient);
    
    return of(patient as any);
  }

  // Endpoint FHIR: DELETE /Patient/:id
  deletePatient(id: string): Observable<void> {
    // En production
    // return this.http.delete<void>(`${this.apiUrl}/Patient/${id}`);
    
    return of(void 0);
  }

  // Recherche FHIR avec paramètres
  searchPatients(params: Record<string, any>): Observable<{ resourceType: string; entry: any[] }> {
    // En production, utiliser les paramètres FHIR standard
    // return this.http.get<any>(`${this.apiUrl}/Patient`, { params });
    
    return of({ resourceType: 'Bundle', entry: [] });
  }
}
