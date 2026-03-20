import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultations-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="content-wrapper">
      <div class="header-section">
        <h1>Consultations Médicales</h1>
        <p class="subtitle">Gestion des consultations patient (Module 5)</p>
      </div>

      <div class="feature-box">
        <h2>En Développement</h2>
        <p>Ce module permettra de:</p>
        <ul>
          <li>Planifier les consultations médicales</li>
          <li>Consulter l'historique des rendez-vous</li>
          <li>Enregistrer les motifs de consultation</li>
          <li>Générer les dossiers de consultation</li>
        </ul>
        <p><strong>Statut:</strong> Annoncé pour la prochaine version</p>
      </div>
    </div>
  `,
  styles: [`
    .content-wrapper {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 20px;
    }

    .header-section {
      margin-bottom: 40px;

      h1 {
        margin: 0;
        font-size: 32px;
        color: #0B5394;
        font-weight: 700;
      }

      .subtitle {
        color: #7F8C8D;
        margin: 10px 0 0 0;
      }
    }

    .feature-box {
      background: white;
      border: 1px solid #E0E3E8;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

      h2 {
        margin-top: 0;
        color: #0B5394;
        font-size: 20px;
      }

      p {
        color: #2C3E50;
        line-height: 1.6;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 15px 0;

        li {
          padding: 8px 0;
          padding-left: 24px;
          position: relative;
          color: #7F8C8D;

          &::before {
            content: '→';
            position: absolute;
            left: 0;
            color: #0B5394;
            font-weight: bold;
          }
        }
      }

      strong {
        color: #0B5394;
      }
    }
  `]
})
export class ConsultationsListComponent {}
