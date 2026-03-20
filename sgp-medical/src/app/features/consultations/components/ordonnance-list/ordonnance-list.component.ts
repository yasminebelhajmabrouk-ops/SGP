import { Component, Input, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Ordonnance } from '../../models/consultation.model';
import { OrdonnanceService } from '../../services/ordonnance.service';

@Component({
  selector: 'app-ordonnance-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordonnance-list.component.html',
  styleUrls: ['./ordonnance-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrdonnanceListComponent implements OnInit, OnDestroy {
  @Input() patientId!: string;

  ordonnances: Ordonnance[] = [];
  private destroy$ = new Subject<void>();

  constructor(private ordonnanceService: OrdonnanceService) {}

  ngOnInit(): void {
    this.loadOrdonnances();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadOrdonnances(): void {
    this.ordonnanceService.ordonnances$
      .pipe(takeUntil(this.destroy$))
      .subscribe(ordonnances => {
        this.ordonnances = ordonnances
          .filter(o => o.patientId === this.patientId)
          .sort((a, b) => new Date(b.dateOrdonnance).getTime() - new Date(a.dateOrdonnance).getTime());
      });
  }

  isExpired(ordonnance: Ordonnance): boolean {
    const creationDate = new Date(String(ordonnance.dateCreation));
    const dureeValiditeNum = Number(ordonnance.dureeValidite);
    const expiryDate = new Date(creationDate.getTime() + dureeValiditeNum * 24 * 60 * 60 * 1000);
    return new Date() > expiryDate;
  }

  getRemainingDays(ordonnance: Ordonnance): number {
    const creationDate = new Date(String(ordonnance.dateCreation));
    const dureeValiditeNum = Number(ordonnance.dureeValidite);
    const expiryDate = new Date(creationDate.getTime() + dureeValiditeNum * 24 * 60 * 60 * 1000);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  deleteOrdonnance(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ordonnance ?')) {
      this.ordonnanceService.deleteOrdonnance(id);
    }
  }

  trackByOrdonnanceId = (index: number, ordonnance: Ordonnance) => ordonnance.id;
  trackByMedicationIndex = (index: number) => index;
}
