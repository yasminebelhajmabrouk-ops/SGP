# 🧪 Guide de Test et Continuation

Guide complet pour tester la démo et continuer le développement du projet SGP.

## ✅ Vérification Post-Deployment

### 1. Vérifier le Serveur de Développement

Le serveur doit être en cours d'exécution sur le terminal avec ce message:
```
Local: http://localhost:4200/
press h + enter to show help
```

Si ce n'est pas le cas, redémarrez:
```bash
cd c:/Users/YASMINE/OneDrive/Desktop/new/sgp-medical
ng serve --open --port=4200
```

### 2. Accéder à l'Application

Ouvrez votre navigateur et allez à: **http://localhost:4200/**

Vous devriez voir:
- ✅ En-tête avec "🏥 SGP - Système de Gestion de Patients"
- ✅ Navigation (Patients, Consultations, Ordonnances)
- ✅ Liste de 2 patients fictifs (Jean Dupont, Marie Martin)
- ✅ Pied de page avec "Conforme HDS & RGPD"

## 🎯 Scénarios de Test

### Test 1: Navigation et Affichage de Liste

**Étapes**:
1. Ouvrez http://localhost:4200/
2. Vous êtes automatiquement redirigé vers `/patients`
3. Vous voyez une liste de patients avec des cartes

**Vérifications**:
- ✅ 2 patients affichés: "Jean DUPONT" et "Marie MARTIN"
- ✅ Chaque patient affiche: initiales, âge, INS formaté, allergies
- ✅ Un badge d'urgence (vert/jaune/orange/rouge)
- ✅ Nombre d'allergies dans un badge

### Test 2: Recherche de Patient

**Étapes**:
1. Tapez "Jean" dans le champ de recherche
2. Observez la liste se filtrer en temps réel

**Vérifications**:
- ✅ Filtre par nom: "Jean" → affiche "Jean DUPONT"
- ✅ Filtre par prénom: "Marie" → affiche "Marie MARTIN"
- ✅ Filtre par INS partiellement
- ✅ Cas insensible (fonctionne avec majuscules/minuscules)

### Test 3: Tri de la Liste

**Étapes**:
1. Observez le menu déroulant "Tri:" en haut à gauche
2. Changez le tri entre "Nom (A-Z)" et "Le plus récent"

**Vérifications**:
- ✅ Tri par nom: ordre alphabétique (A-Z)
- ✅ Tri par date: patients les plus récents d'abord
- ✅ Le tri fonctionne même avec une recherche active

### Test 4: Consulter le Détail d'un Patient

**Étapes**:
1. Cliquez sur la carte "Jean DUPONT"
2. Vous êtes redirigé vers `/patients/1`

**Vérifications**:
- ✅ Affiche le dossier complet du patient
- ✅ Section "Renseignements" avec identité
- ✅ Section "Allergies" avec détails
- ✅ Section "Antécédents" avec historique
- ✅ Section "Constantes vitales" avec 7+ mesures
- ✅ Boutons: "Modifier", "Supprimer", "⚠️ Urgence"

### Test 5: Créer un Nouveau Patient

**Étapes**:
1. Cliquez sur "[+ Nouveau Patient]" en haut à gauche
2. Remplissez le formulaire avec:
   - Nom: `Dupont`
   - Prénom: `Pierre`
   - Date de naissance: `01/06/1985`
   - Sexe: `Masculin`
   - INS: `1850601011234`
   - Email: `pierre.dupont@gmail.com`
   - Téléphone: `0123456789`
   - Groupe sanguin: `A+`
   - Adresse: `123 Rue de la Paix, 75000 Paris`
3. Cochez "Je consens au traitement"
4. Cliquez "Créer Patient"

**Vérifications**:
- ✅ Formulaire valide (aucune erreur)
- ✅ Le patient est ajouté à la liste
- ✅ Redirection vers le détail du nouveau patient
- ✅ Les données persistent après rafraîchissement (localStorage)

### Test 6: Modifier un Patient

**Étapes**:
1. Sur le détail d'un patient, cliquez "Modifier"
2. Vous accédez à `/patients/1/edit`
3. Modifiez par ex. le email
4. Cliquez "Mettre à jour"

**Vérifications**:
- ✅ Formulaire pré-rempli avec les données actuelles
- ✅ Les modifications sont sauvegardées
- ✅ Redirection vers le détail du patient modifié
- ✅ Les données mises à jour s'affichent

### Test 7: Supprimer un Patient

**Étapes**:
1. Sur le détail d'un patient, cliquez "Supprimer"
2. Une confirmation s'affiche
3. Confirmez la suppression

**Vérifications**:
- ✅ Dialogue de confirmation appears
- ✅ Patient supprimé de la liste
- ✅ Redirection vers `/patients`
- ✅ Le patient ne réappparaît pas après refresh

### Test 8: Signalement d'Urgence

**Étapes**:
1. Sur n'importe quel patient, cliquez "⚠️ Urgence"

**Vérifications**:
- ✅ Une alerte urgence log en console
- ✅ L'application audit l'action dans localStorage
- ✅ Un son d'alerte joue (optionnel en navigateur)

### Test 9: Formatage des Données Affichées

**Vérifications d'affichage**:
- ✅ Date de naissance → Âge en années (pipe Age)
- ✅ INS → Format XXX XXX XXXXX XXXXX XX (pipe InsFormat)
- ✅ Code diagnostic → Libellé CIM-10 si disponible (pipe Cim10)

Exemples:
```
INS: 1 850 601 01 1234 →  1 850 601 01 1234 56 (si 18+ chiffres)
Date: 01/06/1975      →  49 ans
Code: E11             →  E11 - Diabète sucré non insulino
```

## 🐛 Dépannage

### Problème: Port 4200 déjà utilisé
```bash
# Trouvez le processus utilisant le port
netstat -ano | findstr :4200

# Tuez le processus ou utilisez un autre port
ng serve --port 4201
```

### Problème: Module not found errors
```bash
# Réinstallez les dépendances
rm -r node_modules package-lock.json
npm install
ng serve
```

### Problème: Compilation errors
```bash
# Nettoyez le cache Angular
rm -r .angular/cache
ng serve
```

### Problème: localStorage vide
- Ouvrez DevTools (F12)
- Allez à "Application" → "Local Storage"
- Vérifiez qu'il y a une clé "patients"

## 📊 Données de Test Pré-chargées

### Patient 1: Jean Dupont
```
ID: 1
INS: 1 950 634 08 12345 67
Age: 73 ans
Email: jean.dupont@example.com
Allergies: 
  - Pénicilline (Sévère)
  - Aspirine (Modérée)
Urgence: ROUGE (critique)
```

### Patient 2: Marie Martin
```
ID: 2
INS: 2 820 715 09 54321 89
Age: 48 ans
Email: marie.martin@example.com
Allergies: 
  - Sulfonamides (Légère)
Urgence: VERT (normal)
```

## 🔍 Inspection Browser DevTools

### Console (F12 → Console)
Vous devriez voir les logs d'audit:
```javascript
// Exemple
{action: "VIEW_PATIENT_LIST", timestamp: "2024-03-19T...", userId: "user123"}
{action: "SELECTED_PATIENT", patientId: "1", timestamp: "2024-03-19T..."}
{action: "PATIENT_CREATED", patientId: "3", timestamp: "2024-03-19T..."}
```

### Application Storage (F12 → Application → Local Storage)
Clés stockées:
- `patients`: Array de tous les patients
- `audit_logs`: Historique des actions
- `currentUser`: Utilisateur connecté (simulation)

### Network (F12 → Network)
- Ne devrait y avoir aucun appel HTTP (mode mock)
- Les appels seront présents après intégration API

## 🎯 Prochaines Étapes: Module 5 - Directives

Le module 5 du PDF couvre les **Directives Personnalisées** (custom directives).

### Directives à Implémenter

#### 1. **appMedicalAlert** - Alerte sur Valeurs Critiques
```typescript
// Usage
<div [appMedicalAlert]="systolicBP" alertThreshold="180">
  Tension: {{ systolicBP }} mmHg
</div>

// Comportement
// Si systolicBP > 180 → fond rouge, icône ⚠️

// Cas d'usage
// Mettre en évidence les constantes vitales en dehors des normes
```

#### 2. **appSensitiveData** - Masquage des Données Sensibles
```typescript
// Usage
<span appSensitiveData="INS" [canView]="isAdmin">
  {{ patient.ins | insFormat }}
</span>

// Comportement
// Si isAdmin=false → masque tout sauf derniers 4 chiffres
// Si isAdmin=true → affiche le numéro complet mais l'entoure d'une bordure

// Cas d'usage
// Protéger les données sensibles selon le rôle de l'utilisateur
```

#### 3. **appHighlight** - Surlignage de Texte (Bonus)
```typescript
// Usage
<p appHighlight [highlightColor]="'yellow'">
  Ceci est un texte important
</p>

// Comportement
// Surligne le texte avec la couleur spécifiée
```

### Fichiers à Créer

```
src/app/shared/directives/
├── alert.directive.ts        # appMedicalAlert
├── sensitive-data.directive.ts # appSensitiveData
│
├── alert.directive.spec.ts    # Tests unitaires
└── sensitive-data.directive.spec.ts
```

### Intégration dans les Composants

**patient-detail.ts** - Afficher les constantes vitales avec alerte:
```html
<div class="vitals-grid">
  <div *ngFor="let vital of patient.dernieresConstantes">
    <span 
      [appMedicalAlert]="vital.value" 
      [alertThreshold]="vital.normalMax">
      {{ vital.label }}: {{ vital.value }}{{ vital.unit }}
    </span>
  </div>
</div>
```

**patient-card.ts** - Masquer l'INS pour les non-admin:
```html
<p appSensitiveData="INS" [canView]="currentUser.role === 'admin'">
  INS: {{ patient.ins | insFormat }}
</p>
```

### Plan de Développement Module 5

**Durée estimée**: 1.5 - 2 heures

1. **Créer appMedicalAlert** (30 min)
   - Directive avec @Input threshold
   - Ajout de classe CSS `.alert-danger` si dépassé
   - Ajout d'une icône ⚠️ en-cas de critère

2. **Créer appSensitiveData** (30 min)
   - Directive avec @Input canView
   - Masquage automatique du contenu sensible
   - Affichage du dernier quadrant (X.XXX.XXXXX.XXXXX.XX)

3. **Intégrer dans Composants** (30 min)
   - Appliquer aux constantes vitales
   - Appliquer aux données sensibles patient
   - Ajouter CSS pour distinction

4. **Tester les Cas** (20 min)
   - Afficher alerte avec vitales critiques
   - Vérifier masquage INS pour différents rôles
   - Interaction avec pipes existants

## ✨ Après Module 5

**Module 6: Services Avancés**
- HTTP Interceptors pour JWT
- Error handling
- Loading states
- Caching strategy

**Module 7: Routing & Guards**
- AuthGuard (isAuthenticated)
- RoleGuard (hasRole)
- CanDeactivate (confirmation avant de quitter)

**Module 8: Forms Avancées**
- FormArray pour allergies
- Nested FormGroups
- Dynamic fields
- Custom Validators

**Module 9: HTTP/FHIR**
- Connexion API réelle
- FHIR compliance
- Error recovery
- Loading indicators

## 🎓 Rappel des Concepts Angulars Couverts

✅ Module 1 - 3: Fondamentaux (architecture, installation, composants)
✅ Module 4: Templates & Data Binding (2-way binding, pipes)
⏳ Module 5: Directives (EN COURS)
⏳ Module 6: Services Avancés
⏳ Module 7: Routing & Guards
⏳ Module 8: Reactive Forms Avancées
⏳ Module 9: HTTP & FHIR Integration

---

**Prochaine action**: 
1. ✅ Testez l'application sur http://localhost:4200/
2. ✅ Vérifiez tous les scénarios de test
3. 🔜 Commencez Module 5 avec appMedicalAlert après

Questions ou blocage? Consultez le PROJECT_README.md pour plus de détails.