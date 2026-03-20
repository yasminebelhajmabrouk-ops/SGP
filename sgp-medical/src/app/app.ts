import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionTimeoutService } from './core/services/session-timeout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app-simple.html',
  styleUrl: './app.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = 'sgp-medical';

  constructor(private sessionTimeoutService: SessionTimeoutService) {
    // SessionTimeoutService initialized automatically
  }
}
