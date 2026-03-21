import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Patient } from '../../models/patient.model';
import { InsFormatPipe } from '../../../../shared/pipes/ins-format-pipe';
import { trackByIndex } from '../../../../shared/utils/trackBy.util';
import { SensitiveDataDirective, HighlightDirective } from '../../../../shared/directives';

@Component({
  selector: 'app-patient-card',
  imports: [CommonModule, InsFormatPipe, SensitiveDataDirective, HighlightDirective],
  templateUrl: './patient-card.html',
  styleUrl: './patient-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientCard implements OnInit, OnDestroy {
  @Input() patient!: Patient;
  @Input() showSensitiveData = false;
  @Output() patientSelected = new EventEmitter<Patient>();
  @Output() urgenceSignalee = new EventEmitter<{ patient: Patient; motif: string }>();

  trackByIndex = trackByIndex;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    console.log('Carte patient initialisée:', this.patient?.ins);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get age(): number {
    const now = new Date();
    const birth = new Date(this.patient.dateNaissance);
    let currentAge = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
      currentAge--;
    }
    return currentAge;
  }

  get initiales(): string {
    return `${this.patient.prenom[0]}${this.patient.nom[0]}`.toUpperCase();
  }

  selectPatient(): void {
    this.patientSelected.emit(this.patient);
  }

  signalerUrgence(motif: string): void {
    this.urgenceSignalee.emit({ patient: this.patient, motif });
  }

  getUrgencyColor(): string {
    switch (this.patient.niveauUrgence) {
      case 'rouge':
        return '#cc0000';
      case 'orange':
        return '#ff6600';
      case 'jaune':
        return '#ffcc00';
      case 'vert':
        return '#00cc00';
      default:
        return '#666';
    }
  }

  getSeverityColor(severite: string): string {
    switch (severite) {
      case 'severe':
        return '#cc0000';
      case 'moderee':
        return '#ff9900';
      case 'legere':
        return '#ffcc00';
      default:
        return '#666';
    }
  }
}
