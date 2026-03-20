/**
 * Consultation Model
 * Represents a medical consultation for a patient
 */
export interface Consultation {
  id: string;
  patientId: string;
  dateConsultation: string;
  medecin: string;
  diagnostic: string;
  observations: string;
  traitement: string;
  dateCreation: string;
}

/**
 * Ordonnance (Prescription) Model
 * Represents a medical prescription for a patient
 */
export interface Medication {
  id: string;
  nom: string;
  dosage: string; // e.g., "500mg", "10ml"
  frequence: string; // e.g., "2 fois par jour", "3 fois par jour"
  duree: string; // e.g., "7 jours", "14 jours", "1 mois"
  posologie: string; // Usage instructions
}

export interface Ordonnance {
  id: string;
  patientId: string;
  dateOrdonnance: string;
  medecin: string;
  medicaments: Medication[];
  observations: string;
  dureeValidite: string; // e.g., "30 jours"
  dateCreation: string;
}
