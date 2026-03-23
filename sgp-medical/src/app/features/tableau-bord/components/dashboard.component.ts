import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, Statistique, Alerte, Consultation } from '../services/dashboard.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  statistiques$: Observable<Statistique[]>;
  alertes$: Observable<Alerte[]>;
  consultations$: Observable<Consultation[]>;
  dateActuelle: Date = new Date();
  Math = Math; // Expose Math pour le template

  constructor(private dashboardService: DashboardService) {
    this.statistiques$ = this.dashboardService.getStatistiques();
    this.alertes$ = this.dashboardService.getAlertes();
    this.consultations$ = this.dashboardService.getConsultations();
  }

  ngOnInit(): void {}

  supprimerAlerte(alerteId: string): void {
    this.dashboardService.supprimerAlerte(alerteId);
    this.alertes$ = this.dashboardService.getAlertes();
  }

  getAlertColor(type: string): string {
    switch (type) {
      case 'urgent':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'urgent':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📌';
    }
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'confirmée':
        return '#10b981';
      case 'en attente':
        return '#f59e0b';
      case 'annulée':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }
}
