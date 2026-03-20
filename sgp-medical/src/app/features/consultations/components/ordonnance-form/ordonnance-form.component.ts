import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Ordonnance, Medication } from '../../models/consultation.model';

@Component({
  selector: 'app-ordonnance-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ordonnance-form.component.html',
  styleUrls: ['./ordonnance-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdonnanceFormComponent implements OnInit {
  @Input() patientId!: string;
  @Output() ordonnanceAdded = new EventEmitter<Ordonnance>();

  ordonnanceForm!: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.ordonnanceForm = this.fb.group({
      dateOrdonnance: [this.getTodayDate(), Validators.required],
      medecin: ['', [Validators.required, Validators.minLength(3)]],
      observations: ['', Validators.minLength(5)],
      dureeValidite: [30, [Validators.required, Validators.min(1), Validators.max(365)]],
      medicaments: this.fb.array([])
    });

    // Ajouter un médicament vide par défaut
    this.addMedication();
  }

  get medicaments(): FormArray {
    return this.ordonnanceForm.get('medicaments') as FormArray;
  }

  addMedication(): void {
    const medicationForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      dosage: ['', [Validators.required, Validators.minLength(2)]],
      frequence: ['', [Validators.required, Validators.minLength(5)]],
      duree: ['', [Validators.required, Validators.minLength(5)]],
      posologie: ['', Validators.minLength(5)]
    });
    this.medicaments.push(medicationForm);
  }

  removeMedication(index: number): void {
    if (this.medicaments.length > 1) {
      this.medicaments.removeAt(index);
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.ordonnanceForm.invalid || this.medicaments.length === 0) {
      return;
    }

    const formValue = this.ordonnanceForm.value;
    const ordonnance: Ordonnance = {
      id: this.generateId(),
      patientId: this.patientId,
      dateOrdonnance: formValue.dateOrdonnance,
      medecin: formValue.medecin,
      medicaments: formValue.medicaments,
      observations: formValue.observations || '',
      dureeValidite: formValue.dureeValidite,
      dateCreation: new Date().toISOString().split('T')[0]
    };

    this.ordonnanceAdded.emit(ordonnance);
    this.resetForm();
  }

  resetForm(): void {
    this.submitted = false;
    this.ordonnanceForm.reset({
      dateOrdonnance: this.getTodayDate(),
      medicaments: []
    });
    this.medicaments.clear();
    this.addMedication();
  }

  private getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  private generateId(): string {
    return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  }
}
