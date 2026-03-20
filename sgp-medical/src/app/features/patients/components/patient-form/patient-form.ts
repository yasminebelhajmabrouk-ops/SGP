import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      sexe: ['', Validators.required],
      ins: ['', Validators.required],
      email: ['', [Validators.email]],
      telephone: ['', Validators.required],
      groupeSanguin: [''],
      adresse_ligne1: ['', Validators.required],
      adresse_codePostal: ['', Validators.required],
      adresse_ville: ['', Validators.required],
      medecinTraitantId: ['', Validators.required],
      consentement: [false, Validators.requiredTrue]
    });
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
      }
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.patientForm.invalid) {
      return;
    }

    const formValue = this.patientForm.value;
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
      statut: 'actif' as const,
      niveauUrgence: 'vert' as const,
      allergies: [],
      antecedents: [],
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
