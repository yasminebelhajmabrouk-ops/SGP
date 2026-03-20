import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient';
import { AuditService } from '../../../../core/services/audit';
import { InsFormatPipe } from '../../../../shared/pipes/ins-format-pipe';
import { AgePipe } from '../../../../shared/pipes/age-pipe';
import { trackById, trackByIndex } from '../../../../shared/utils/trackBy.util';

@Component({
  selector: 'app-patient-list',
  imports: [CommonModule, FormsModule, InsFormatPipe, AgePipe],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientList implements OnInit, OnDestroy {
  // Expose trackBy functions to template
  trackById = trackById;
  trackByIndex = trackByIndex;
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';
  sortBy: 'nom' | 'dateCreation' = 'nom';
  private destroy$ = new Subject<void>();

  constructor(
    private patientService: PatientService,
    private auditService: AuditService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.auditService.log('VIEW_PATIENT_LIST');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPatients(): void {
    this.patientService.patients$
      .pipe(takeUntil(this.destroy$))
      .subscribe(patients => {
        this.patients = patients;
        this.filterAndSort();
      });
  }

  search(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.filterAndSort();
  }

  filterAndSort(): void {
    this.filteredPatients = this.patients
      .filter(p =>
        p.nom.toLowerCase().includes(this.searchTerm) ||
        p.prenom.toLowerCase().includes(this.searchTerm) ||
        p.ins.includes(this.searchTerm)
      )
      .sort((a, b) => {
        if (this.sortBy === 'nom') {
          return a.nom.localeCompare(b.nom);
        } else {
          return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
        }
      });
  }

  selectPatient(patient: Patient): void {
    this.auditService.log('SELECTED_PATIENT', patient.id);
    this.router.navigate(['/patients', patient.id]);
  }

  createNewPatient(): void {
    this.router.navigate(['/patients/new']);
  }

  onUrgence(data: { patient: Patient; motif: string }): void {
    this.auditService.log('URGENCE_SIGNALED', data.patient.id, data.motif);
    alert(`Urgence signalée pour ${data.patient.prenom} ${data.patient.nom}: ${data.motif}`);
  }

  getUrgencyColor(urgence?: string): string {
    switch (urgence) {
      case 'rouge': return '#cc0000';
      case 'orange': return '#ff6600';
      case 'jaune': return '#ffcc00';
      case 'vert': return '#00cc00';
      default: return '#666';
    }
  }
}
