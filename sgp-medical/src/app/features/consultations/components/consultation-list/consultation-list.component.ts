import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Consultation } from '../../models/consultation.model';
import { ConsultationService } from '../../services/consultation.service';

@Component({
  selector: 'app-consultation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consultation-list.component.html',
  styleUrls: ['./consultation-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConsultationListComponent implements OnInit, OnDestroy {
  @Input() patientId!: string;

  consultations: Consultation[] = [];
  private destroy$ = new Subject<void>();

  constructor(private consultationService: ConsultationService) {}

  ngOnInit(): void {
    this.loadConsultations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadConsultations(): void {
    this.consultationService.consultations$
      .pipe(takeUntil(this.destroy$))
      .subscribe(consultations => {
        this.consultations = consultations
          .filter(c => c.patientId === this.patientId)
          .sort((a, b) => new Date(b.dateConsultation).getTime() - new Date(a.dateConsultation).getTime());
      });
  }

  deleteConsultation(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
      this.consultationService.deleteConsultation(id);
    }
  }

  trackByConsultationId = (index: number, consultation: Consultation) => consultation.id;
}
