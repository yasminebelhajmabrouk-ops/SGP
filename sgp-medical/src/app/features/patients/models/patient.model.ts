// Énumérations et types pour le modèle patient (conforme FHIR R4)

export type Sexe = 'M' | 'F' | 'I' | 'U'; // Male, Female, Indetermine, Unknown
export type GroupeSanguin = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type StatutPatient = 'actif' | 'inactif' | 'decede' | 'transfere';
export type NiveauUrgence = 'vert' | 'jaune' | 'orange' | 'rouge';

// Interfaces

export interface Adresse {
  ligne1: string;
  ligne2?: string;
  codePostal: string;
  ville: string;
  pays: string;
}

export interface Allergie {
  id?: string;
  substance: string;
  reaction: string;
  severite: 'legere' | 'moderee' | 'severe';
  dateDeclaration: Date;
}

export interface ConstantesVitales {
  tensionSystolique?: number; // mmHg
  tensionDiastolique?: number; // mmHg
  frequenceCardiaque?: number; // bpm
  temperature?: number; // Celsius
  saturationO2?: number; // %
  poids?: number; // kg
  taille?: number; // cm
  dateMesure: Date;
}

export interface Patient {
  id: string; // UUID interne
  ins: string; // Identite Nationale de Sante (NIR)
  nom: string;
  prenom: string;
  dateNaissance: Date;
  sexe: Sexe;
  groupeSanguin?: GroupeSanguin;
  adresse: Adresse;
  telephone: string;
  email?: string;
  medecinTraitantId: string;
  statut: StatutPatient;
  niveauUrgence?: NiveauUrgence;
  allergies: Allergie[];
  antecedents: string[];
  traitementEnCours: string[];
  dernieresConstantes?: ConstantesVitales;
  dateCreation: Date;
  dateDerniereModification: Date;
  consentement?: boolean;
}
