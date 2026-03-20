import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsultationService } from '../../services/consultation.service';
import { Consultation } from '../../models/consultation.model';

@Component({
  selector: 'app-consultation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './consultation-form.component.html',
  styleUrl: './consultation-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultationFormComponent implements OnInit {
  @Input() patientId: string = '';
  @Output() consultationAdded = new EventEmitter<Consultation>();

  consultationForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private consultationService: ConsultationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Pré-remplir la date actuelle
    this.consultationForm.patchValue({
      dateConsultation: new Date().toISOString().split('T')[0]
    });
  }

  private initForm(): void {
    this.consultationForm = this.formBuilder.group({
      dateConsultation: ['', [Validators.required]],
      medecin: ['', [Validators.required, Validators.minLength(3)]],
      diagnostic: ['', [Validators.required, Validators.minLength(5)]],
      observations: ['', [Validators.minLength(5)]],
      traitement: ['', [Validators.minLength(5)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.consultationForm.invalid) {
      return;
    }

    const newConsultation = this.consultationService.addConsultation({
      patientId: this.patientId,
      dateConsultation: this.consultationForm.get('dateConsultation')?.value,
      medecin: this.consultationForm.get('medecin')?.value,
      diagnostic: this.consultationForm.get('diagnostic')?.value,
      observations: this.consultationForm.get('observations')?.value,
      traitement: this.consultationForm.get('traitement')?.value
    });

    this.consultationAdded.emit(newConsultation);
    this.resetForm();
  }

  resetForm(): void {
    this.submitted = false;
    this.consultationForm.reset({
      dateConsultation: new Date().toISOString().split('T')[0]
    });
  }

  get dateConsultation() {
    return this.consultationForm.get('dateConsultation');
  }

  get medecin() {
    return this.consultationForm.get('medecin');
  }

  get diagnostic() {
    return this.consultationForm.get('diagnostic');
  }

  get observations() {
    return this.consultationForm.get('observations');
  }

  get traitement() {
    return this.consultationForm.get('traitement');
  }
}
