# 🏥 SGP - Système de Gestion de Patients

**Angular 101 - Medical Applications - Complete Implementation**

Une application Angular moderne pour la gestion de patients, conforme aux standards FHIR, HDS et RGPD.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Modules et Composants](#modules-et-composants)
- [Services](#services)
- [Pipes Personnalisés](#pipes-personnalisés)
- [Conformité et Sécurité](#conformité-et-sécurité)

## 🎯 Vue d'ensemble

Le Système de Gestion de Patients (SGP) est une application Web Angular à usage médical qui couvre l'ensemble des concepts fondamentaux d'Angular à travers des exemples concrets du domaine médical.

**Durée:** 4 heures  
**Niveau:** Débutant à Intermédiaire  
**Prérequis:** HTML, CSS & JavaScript de base | Notions de TypeScript souhaitées

## ✨ Fonctionnalités

### Gestion des Patients
- ✅ **Liste des patients** avec recherche interne, tri et pagination
- ✅ **Création** et **modification** de patients via formulaires réactifs
- ✅ **Détail patient** avec affichage complet du dossier
- ✅ **Suppression** de patients
- ✅ Gestion des **allergies** et **antécédents**
- ✅ Suivi des **constantes vitales**

### Composants Médicaux
- 💳 **Patient Card** - Affichage récapitulatif des informations patient
- 📋 **Patient List** - Liste interactive avec filtrage et tri
- 📝 **Patient Form** - Formulaire réactif de création/modification
- 📊 **Patient Detail** - Vue détaillée du dossier patient complet

### Services Core
- 🔐 **Authentification** (AuthService) - Gestion des utilisateurs et rôles
- 📊 **Audit** (AuditService) - Journalisation obligatoire des accès
- 🔔 **Notifications** (NotificationService) - Alertes et urgences

### Pipes Personnalisés
- **AgePipe** - Calcul automatique de l'âge depuis la date de naissance
- **InsFormatPipe** - Formatage de l'Identité Nationale de Santé
- **Cim10Pipe** - Conversion des codes CIM-10 en libellés

### Données Conformes FHIR R4
- Types: `Patient`, `Allergie`, `ConstantesVitales`, `Adresse`
- Énumérations médicales: `Sexe`, `GroupeSanguin`, `StatutPatient`, `NiveauUrgence`
- Modèle compatible avec l'interopérabilité FHIR

## 🏗️ Architecture

```
sgp-medical/
├── src/app/
│   ├── core/                          # Services singletons
│   │   └── services/
│   │       ├── auth.ts               # Authentification et gestion des rôles
│   │       ├── audit.ts              # Journalisation (HDS/RGPD)
│   │       └── notification.ts        # Alertes et notifications
│   │
│   ├── shared/                        # Pipes et composants partagés
│   │   └── pipes/
│   │       ├── age-pipe.ts           # Calcul d'âge
│   │       ├── ins-format-pipe.ts    # Formatage INS
│   │       └── cim10-pipe.ts         # Codes médicaux
│   │
│   ├── features/
│   │   ├── patients/                  # Module Feature Patient
│   │   │   ├── models/
│   │   │   │   └── patient.model.ts  # Interfaces FHIR R4
│   │   │   ├── services/
│   │   │   │   ├── patient.ts        # Gestion d'état locale
│   │   │   │   └── patient-api.ts    # Appels API FHIR
│   │   │   ├── components/
│   │   │   │   ├── patient-list/     # Liste avec recherche
│   │   │   │   ├── patient-card/     # Carte récapitulative
│   │   │   │   ├── patient-form/     # Formulaire réactif
│   │   │   │   └── patient-detail/   # Dossier complet
│   │   │   └── patients-routing-module.ts
│   │   │
│   │   ├── consultations/             # Module Feature (scaffolding)
│   │   └── ordonnances/               # Module Feature (scaffolding)
│   │
│   ├── app.ts                         # Composant root
│   ├── app.config.ts                  # Configuration applcation
│   └── app.routes.ts                  # Routes principales

```

## 🚀 Installation

### Prérequis
- Node.js 18+ LTS
- npm 9+ ou yarn 1.22+
- VS Code avec extensions: Angular Language Service, ESLint, Prettier

### Étapes

1. **Accédez au répertoire** du projet:
   ```bash
   cd sgp-medical
   ```

2. **Installez les dépendances**:
   ```bash
   npm install
   ```

3. **Lancez le serveur de développement**:
   ```bash
   ng serve --open
   ```

4. **L'application s'ouvre automatiquement** sur `http://localhost:4200`

## 📖 Utilisation

### Navigation Principale
- **Accueil**: Affichage rapide de l'index des patients
- **Patients**: Gestion complète du dossier patient
- **Consultations**: Module de gestion des consultations (future)
- **Ordonnances**: Gestion des prescription (future)

### Gestion des Patients

#### 1. **Consultation de la liste**
```
Patients → Liste interactive
├── Recherche par nom/prénom/INS
├── Tri par nom ou date
└── Clic pour accéder au détail
```

#### 2. **Création d'un patient**
```
Patients → [+ Nouveau Patient]
├── Formulaire réactif avec validation
├── Champs obligatoires marqués (*)
├── Consentement RGPD requis
└── Sauvegarde avec audit
```

#### 3. **Consultation du dossier patient**
```
Patient → Détail complet
├── Fiche patient résumée
├── Allergies documentées
├── Antécédents médicaux
├── Constantes vitales dernières
├── Actions: Modifier | Supprimer | Urgence
```

### Signalement d'Urgence

Chaque patient affiche un **badge de niveau d'urgence**:
- 🟢 **Vert**: Normal
- 🟡 **Jaune**: Attention requise
- 🟠 **Orange**: Urgent
- 🔴 **Rouge**: Critique

Un bouton "⚠️ Urgence" permet de signaler une situation critique.

## 🔧 Modules et Composants

### PatientList (Liste des Patients)
- Affichage paginé avec recherche en temps réel
- Tri par nom ou date de création
- Indicateurs visuels d'urgence et d'allergies
- Navigation rapide

```typescript
// Utilisation
<app-patient-list></app-patient-list>
```

### PatientCard (Carte Patient)
- Affichage compact d'un patient
- @Input: patient, showSensitiveData
- @Output: patientSelected, urgenceSignalee
- Badge avec initiales
- Affichage contrôlé des données sensibles

```typescript
// Utilisation
<app-patient-card
  [patient]="patient"
  [showSensitiveData]="currentUser.role === 'medecin'"
  (urgenceSignalee)="onUrgence($event)"
></app-patient-card>
```

### PatientForm (Formulaire Réactif)
- Création et modification de patients
- Validation en temps réel
- Gestion des adresses
- Consentement RGPD obligatoire
- Navigation intelligente (new vs edit)

```typescript
// Utilisation en route
/patients/new          → Création
/patients/:id/edit     → Modification
```

### PatientDetail (Détail Patient)
- Dossier patient complet
- Historique d'allergies
- Graphique des constantes vitales
- Actions: Edit, Delete, Urgence
- Audit des consultations

## 🛠️ Services

### AuthService
```typescript
// Authentification
auth.login(email, password, role): Observable<User>
auth.logout(): void
auth.getCurrentUser(): User | null
auth.hasRole(roleName): boolean
```

**Rôles disponibles**: `medecin`, `infirmier`, `admin`, `patient`

### AuditService
```typescript
// Journalisation (HDS/RGPD obligatoire)
audit.log(action, patientId?, details?): void
audit.getLogs(): AuditLog[]
audit.getLogsForPatient(patientId): AuditLog[]
audit.getLogsForUser(userId): AuditLog[]
```

**Actions tracées**:
- VIEW_PATIENT_LIST
- SELECTED_PATIENT
- PATIENT_CREATED
- PATIENT_UPDATED
- DELETE_PATIENT
- URGENCE_SIGNALED
- VIEW_PATIENT_DETAIL

### NotificationService
```typescript
// Alertes et notifications
notification.info(message): void
notification.warning(message): void
notification.error(message): void
notification.urgence(message): void  // Avec son d'alerte
```

### PatientService
```typescript
// Gestion d'état des patients
patients$: Observable<Patient[]>
getPatients(): Observable<Patient[]>
getPatientById(id): Patient | undefined
addPatient(patient): Patient
updatePatient(id, updates): void
deletePatient(id): void
addAllergy(patientId, allergie): void
updateVitals(patientId, vitals): void
```

### PatientApiService
```typescript
// Intégration FHIR R4 (API REST)
getPatients(): Observable<FHIR Bundle>
getPatientById(id): Observable<Patient>
createPatient(patient): Observable<Patient>
updatePatient(id, patient): Observable<Patient>
deletePatient(id): Observable<void>
searchPatients(params): Observable<FHIR Bundle>
```

**Point d'entrée**: `http://localhost:3000/api` (à configurer)

## 📏 Pipes Personnalisés

### AgePipe
Calcul automatique de l'âge depuis une date de naissance.
```html
<!-- Utilisation -->
<p>Âge: {{ patient.dateNaissance | age }} ans</p>
<!-- Output: Âge: 48 ans -->
```

### InsFormatPipe
Formatage de l'Identité Nationale de Santé (13-18 chiffres).
```html
<!-- Format complet -->
{{ patient.ins | insFormat }}
<!-- Output: 123 456 78901 23456 78 -->

<!-- Format masqué (pour les non-admins) -->
{{ patient.ins | insFormat:true }}
<!-- Output: *** *** ***** **56 78 -->
```

### Cim10Pipe
Conversion des codes CIM-10 en libellés médicaux.
```html
<!-- Format complet -->
{{ codeICD | cim10 }}
<!-- Output: E11 - Diabète sucré non insulino-dépendant -->

<!-- Libellé seul -->
{{ codeICD | cim10:false }}
<!-- Output: Diabète sucré non insulino-dépendant -->
```

## 🔐 Conformité et Sécurité

### Standards Applicables

#### 🏥 HDS (Hébergement de Données de Santé)
- Certification obligatoire en France
- Audit automatique de tous les accès aux données
- Cryptage des données sensibles

#### 📋 RGPD / GDPR
- Consentement explicite requis
- Droit à l'oubli implémenté
- Anonymisation des données
- Propriété des données chez le patient

#### 🔄 FHIR R4 (Fast Healthcare Interoperability Resources)
- Modèle de données conforme
- API REST standard HL7
- Interopérabilité avec systèmes tiers

#### 🏷️ Terminologies Standardisées
- **INS**: Identifiant unique patient (NIR)
- **CIM-10**: Codes diagnostiques internationaux
- **SNOMED CT**: Codes cliniques
- **LOINC**: Tests et observations

#### 🔒 ISO 27001 / ISO 13485
- Normes de sécurité informatique
- Qualité des logiciels médicaux

### Mesures de Sécurité Implémentées

1. **Authentification par rôles (RBAC)**
   - Médecin: accès complet
   - Infirmier: accès limité
   - Admin: gestion du syst ème
   - Patient: accès propre dossier

2. **Journalisation d'audit**
   - Toutes les actions tracées
   - Conservation dans localStorage (dev)
   - À connecter à une base HDS en production

3. **Validation des données**
   - Validations côté client
   - Typage TypeScript strict
   - Interfaces FHIR conformes

4. **Stockage sécurisé**
   - localStorage pour données de démo
   - HTTPS obligatoire en production
   - Tokens JWT pour l'authentification

## 🎓 Concepts Angular Couverts

✅ **Modules** - NgModule et architectured par domaine  
✅ **Composants** - Standalone et declarations  
✅ **Templates** - Property binding, event binding, two-way binding  
✅ **Directives** - *ngIf, *ngFor, ngClass, ngStyle  
✅ **Pipes** - Pipes intégrés et personnalisés  
✅ **Services** - Injection de dépendances, providedIn: 'root'  
✅ **Observables** - RxJS, Subjects, subscribers  
✅ **Routage** - Router, Routes, ActivatedRoute  
✅ **Formulaires** - ReactiveFormsModule, FormGroup, Validators  
✅ **Cycle de vie** - OnInit, OnDestroy, ngOnChanges  
✅ **HTTP Client** - HttpClient, InterceptorS  
✅ **Communication** - @Input, @Output, EventEmitter  

## 📝 Fichiers Clés

- `src/app/app.ts` - Composant root
- `src/app/app.routes.ts` - Configuration de routage principale
- `src/app/app.config.ts` - Configuration de l'application
- `src/app/features/patients/patients-module.ts` - Module patients
- `src/app/features/patients/models/patient.model.ts` - Interfaces FHIR
- `src/main.ts` - Point d'entrée bootstrap

## 🚀 Prochaines Étapes (Future)

- [ ] Module Consultations avec historique
- [ ] Module Ordonnances avec médicaments
- [ ] Dashboard clinique
- [ ] Intégration API FHIR réelle
- [ ] Graphiques avec Chart.js pour constantes vitales
- [ ] Export PDF des dossiers
- [ ] Signature électronique des documents
- [ ] Telemedicine (vidéo-consultation)
- [ ] Web Workers pour recherche performante
- [ ] PWA pour accès hors ligne

## 📚 Ressources

- [Angular Docs](https://angular.io)
- [FHIR R4 Spec](https://www.hl7.org/fhir/r4/)
- [HDS Requirements (France)](https://www.ansm.gouv.fr)
- [RGPD Compliance](https://gdpr-info.eu)
- [RxJS Documentation](https://rxjs.dev)

## 👨‍💻 Auteur

**Sabri BARBARIA**  
Angular 101 - Atelier Pratique de 4 Heures  
Sante Numerique & Applications Medicales

---

**⚠️ AVERTISSEMENT**: Les données patients utilisées dans cette démo sont fictives et à usage pédagogique uniquement. Aucune donnée médicale réelle n'est stockée.

**License**: MIT  
**Version**: 1.0.0  
**Date**: 2026-03-19