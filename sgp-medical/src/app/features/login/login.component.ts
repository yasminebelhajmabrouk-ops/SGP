import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { NotificationService } from '../../core/services/notification';
import { trackByIndex } from '../../shared/utils/trackBy.util';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  roles = ['medecin', 'infirmier', 'admin', 'patient'];
  trackByIndex = trackByIndex;

  private roleLabels: { [key: string]: string } = {
    medecin: 'Médecin',
    infirmier: 'Infirmier',
    admin: 'Administrateur',
    patient: 'Patient'
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['medecin', Validators.required]
    });
  }

  getRoleLabel(role: string): string {
    return this.roleLabels[role] || role;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { email, password, role } = this.loginForm.value;

    this.authService.login(email, password, role).subscribe({
      next: (user) => {
        this.notificationService.info(`Bienvenue ${user.nom} (${user.role})!`);
        this.router.navigate(['/patients']);
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error(`Erreur: ${error.message}`);
        this.loading = false;
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get role() {
    return this.loginForm.get('role');
  }
}
