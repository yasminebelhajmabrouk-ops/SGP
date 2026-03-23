import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'patients',
    loadChildren: () =>
      import('./features/patients/patients-module').then(
        m => m.PatientsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'consultations',
    loadChildren: () =>
      import('./features/consultations/consultations-module').then(
        (m) => m.ConsultationsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'ordonnances',
    loadChildren: () =>
      import('./features/ordonnances/ordonnances-module').then(
        (m) => m.OrdonnancesModule
      ),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['medecin', 'admin'] },
  },
  {
    path: 'tableau-bord',
    loadChildren: () =>
      import('./features/tableau-bord/tableau-bord.module').then(
        (m) => m.TableauBordModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/tableau-bord',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
