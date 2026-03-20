import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientList } from './components/patient-list/patient-list';
import { PatientDetail } from './components/patient-detail/patient-detail';
import { PatientForm } from './components/patient-form/patient-form';

const routes: Routes = [
  {
    path: '',
    component: PatientList,
  },
  {
    path: 'new',
    component: PatientForm,
  },
  {
    path: ':id',
    component: PatientDetail,
  },
  {
    path: ':id/edit',
    component: PatientForm,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientsRoutingModule {}
