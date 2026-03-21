import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patient';
import { AuditService } from '../../../../core/services/audit';
import { Patient } from '../../models/patient.model';
import { trackByIndex } from '../../../../shared/utils/trackBy.util';

@Component({
  selector: 'app-patient-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientForm implements OnInit {
  patientForm!: FormGroup;
  isEditMode = false;
  patientId: string | null = null;
  submitted = false;
  trackByIndex = trackByIndex;

  // Validator personnalisé pour la date
  static validatePastDate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today ? null : { futureDate: true };
  }

  // Validator personnalisé pour l'INS
  static validateINS(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const ins = control.value.toString();
    const pattern = /^[12]\d{12}$/; // Commence par 1 ou 2, suivi de 12 chiffres
    return pattern.test(ins) ? null : { invalidINS: true };
  }

  // Validator personnalisé pour le téléphone français
  static validateFrenchPhone(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const phone = control.value.toString().replace(/\s/g, '');
    const pattern = /^0[1-9]\d{8}$/; // Format français
    return pattern.test(phone) ? null : { invalidPhone: true };
  }

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private auditService: AuditService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id'] && params['id'] !== 'new') {
        this.isEditMode = true;
        this.patientId = params['id'];
        this.loadPatient();
      }
    });
  }

  private initForm(): void {
    this.patientForm = this.formBuilder.group({
      nom: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      dateNaissance: ['', [Validators.required, PatientForm.validatePastDate]],
      sexe: ['', Validators.required],
      ins: ['', [Validators.required, PatientForm.validateINS]],
      email: ['', [Validators.email]],
      telephone: ['', [Validators.required, PatientForm.validateFrenchPhone]],
      groupeSanguin: [''],
      adresse_ligne1: ['', Validators.required],
      adresse_codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      adresse_ville: ['', Validators.required],
      medecinTraitantId: ['', Validators.required],
      antecedents: this.formBuilder.array([]),
      allergies: this.formBuilder.array([]),
      consentement: [false, Validators.requiredTrue]
    });
  }

  get antecedents(): FormArray {
    return this.patientForm.get('antecedents') as FormArray;
  }

  get allergies(): FormArray {
    return this.patientForm.get('allergies') as FormArray;
  }

  addAntecedent(): void {
    const antecedentControl = this.formBuilder.control('', Validators.required);
    this.antecedents.push(antecedentControl);
  }

  removeAntecedent(index: number): void {
    this.antecedents.removeAt(index);
  }

  addAllergie(): void {
    const allergyGroup = this.formBuilder.group({
      substance: ['', Validators.required],
      reaction: ['', Validators.required],
      severite: ['moderee', Validators.required],
      dateDeclaration: [new Date().toISOString().split('T')[0], Validators.required]
    });
    this.allergies.push(allergyGroup);
  }

  removeAllergie(index: number): void {
    this.allergies.removeAt(index);
  }

  private loadPatient(): void {
    if (this.patientId) {
      const patient = this.patientService.getPatientById(this.patientId);
      if (patient) {
        this.patientForm.patchValue({
          nom: patient.nom,
          prenom: patient.prenom,
          dateNaissance: this.formatDate(patient.dateNaissance),
          sexe: patient.sexe,
          ins: patient.ins,
          email: patient.email,
          telephone: patient.telephone,
          groupeSanguin: patient.groupeSanguin,
          adresse_ligne1: patient.adresse.ligne1,
          adresse_codePostal: patient.adresse.codePostal,
          adresse_ville: patient.adresse.ville,
          medecinTraitantId: patient.medecinTraitantId,
          consentement: patient.consentement
        });

        // Charger les antécédents
        patient.antecedents.forEach(antecedent => {
          this.antecedents.push(this.formBuilder.control(antecedent, Validators.required));
        });

        // Charger les allergies
        patient.allergies.forEach(allergie => {
          this.allergies.push(this.formBuilder.group({
            substance: [allergie.substance, Validators.required],
            reaction: [allergie.reaction, Validators.required],
            severite: [allergie.severite, Validators.required],
            dateDeclaration: [this.formatDate(allergie.dateDeclaration), Validators.required]
          }));
        });
      }
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.patientForm.invalid) {
      console.warn('Formulaire invalide:', this.patientForm.errors, this.getFormErrors());
      return;
    }

    const formValue = this.patientForm.value;
    
    // Construire les allergies avec les dates converties
    const allergies = formValue.allergies.map((allergie: any) => ({
      substance: allergie.substance,
      reaction: allergie.reaction,
      severite: allergie.severite,
      dateDeclaration: new Date(allergie.dateDeclaration)
    }));

    const patientData = {
      nom: formValue.nom,
      prenom: formValue.prenom,
      dateNaissance: new Date(formValue.dateNaissance),
      sexe: formValue.sexe,
      ins: formValue.ins,
      email: formValue.email,
      telephone: formValue.telephone,
      groupeSanguin: formValue.groupeSanguin,
      adresse: {
        ligne1: formValue.adresse_ligne1,
        codePostal: formValue.adresse_codePostal,
        ville: formValue.adresse_ville,
        pays: 'France'
      },
      medecinTraitantId: formValue.medecinTraitantId,
      antecedents: formValue.antecedents || [],
      allergies: allergies,
      statut: 'actif' as const,
      niveauUrgence: 'vert' as const,
      traitementEnCours: [],
      consentement: formValue.consentement
    };

    if (this.isEditMode && this.patientId) {
      this.patientService.updatePatient(this.patientId, patientData as any);
      this.auditService.log('PATIENT_UPDATED', this.patientId);
    } else {
      const newPatient = this.patientService.addPatient(patientData as any);
      this.auditService.log('PATIENT_CREATED', newPatient.id);
    }

    this.router.navigate(['/patients']);
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.patientForm.controls).forEach(key => {
      const control = this.patientForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
  }

  cancel(): void {
    this.router.navigate(['/patients']);
  }
}
