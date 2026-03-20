import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient';
import { AuditService } from '../../../../core/services/audit';
import { PatientCard } from '../patient-card/patient-card';
import { trackByIndex } from '../../../../shared/utils/trackBy.util';
import { ConsultationFormComponent } from '../../../../features/consultations/components/consultation-form/consultation-form.component';
import { ConsultationListComponent } from '../../../../features/consultations/components/consultation-list/consultation-list.component';
import { OrdonnanceFormComponent } from '../../../../features/consultations/components/ordonnance-form/ordonnance-form.component';
import { OrdonnanceListComponent } from '../../../../features/consultations/components/ordonnance-list/ordonnance-list.component';
import { ConsultationService } from '../../../../features/consultations/services/consultation.service';
import { OrdonnanceService } from '../../../../features/consultations/services/ordonnance.service';
import { Consultation, Ordonnance } from '../../../../features/consultations/models/consultation.model';

@Component({
  selector: 'app-patient-detail',
  imports: [
    CommonModule,
    PatientCard,
    ConsultationFormComponent,
    ConsultationListComponent,
    OrdonnanceFormComponent,
    OrdonnanceListComponent
  ],
  templateUrl: './patient-detail.html',
  styleUrl: './patient-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientDetail implements OnInit, OnDestroy {
  patient: Patient | null = null;
  trackByIndex = trackByIndex;
  showConsultationForm = false;
  showOrdonnanceForm = false;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private auditService: AuditService,
    private router: Router,
    private consultationService: ConsultationService,
    private ordonnanceService: OrdonnanceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['id']) {
          this.loadPatient(params['id']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPatient(id: string): void {
    this.patient = this.patientService.getPatientById(id) || null;
    if (this.patient) {
      this.auditService.log('VIEW_PATIENT_DETAIL', id);
    } else {
      alert('Patient non trouvé');
      this.router.navigate(['/patients']);
    }
  }

  editPatient(): void {
    if (this.patient) {
      this.router.navigate(['/patients', this.patient.id, 'edit']);
    }
  }

  deletePatient(): void {
    if (this.patient && confirm('Êtes-vous sûr de vouloir supprimer ce patient?')) {
      this.patientService.deletePatient(this.patient.id);
      this.auditService.log('DELETE_PATIENT', this.patient.id);
      this.router.navigate(['/patients']);
    }
  }

  onUrgence(data: { patient: Patient; motif: string }): void {
    alert(`Urgence signalée: ${data.motif}`);
    this.auditService.log('URGENCE', data.patient.id, data.motif);
  }

  onConsultationAdded(consultation: Consultation): void {
    this.consultationService.addConsultation(consultation);
    this.auditService.log('ADD_CONSULTATION', this.patient?.id || '', consultation.diagnostic);
    this.showConsultationForm = false;
    this.cdr.markForCheck();
  }

  onOrdonnanceAdded(ordonnance: Ordonnance): void {
    this.ordonnanceService.addOrdonnance(ordonnance);
    this.auditService.log('ADD_ORDONNANCE', this.patient?.id || '', `${ordonnance.medicaments.length} médicaments`);
    this.showOrdonnanceForm = false;
    this.cdr.markForCheck();
  }

  toggleConsultationForm(): void {
    this.showConsultationForm = !this.showConsultationForm;
    this.cdr.markForCheck();
  }

  toggleOrdonnanceForm(): void {
    this.showOrdonnanceForm = !this.showOrdonnanceForm;
    this.cdr.markForCheck();
  }
}
