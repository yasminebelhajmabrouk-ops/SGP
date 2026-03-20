import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultationFormComponent } from './consultation-form.component';
import { ConsultationService } from '../../services/consultation.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('ConsultationFormComponent', () => {
  let component: ConsultationFormComponent;
  let fixture: ComponentFixture<ConsultationFormComponent>;
  let consultationService: ConsultationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationFormComponent, CommonModule, ReactiveFormsModule],
      providers: [ConsultationService]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultationFormComponent);
    component = fixture.componentInstance;
    consultationService = TestBed.inject(ConsultationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields', () => {
    expect(component.consultationForm.get('medecin')?.value).toBe('');
    expect(component.consultationForm.get('diagnostic')?.value).toBe('');
    expect(component.consultationForm.get('observations')?.value).toBe('');
    expect(component.consultationForm.get('traitement')?.value).toBe('');
  });

  it('should set dateConsultation to today', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(component.consultationForm.get('dateConsultation')?.value).toBe(today);
  });

  it('should validate required fields', () => {
    const form = component.consultationForm;
    expect(form.invalid).toBeTruthy();

    form.get('dateConsultation')?.setValue(new Date().toISOString().split('T')[0]);
    form.get('medecin')?.setValue('Dr. Test');
    form.get('diagnostic')?.setValue('Test diagnostic');
    expect(form.invalid).toBeFalsy();
  });

  it('should validate medecin minLength', () => {
    const medecin = component.consultationForm.get('medecin');
    medecin?.setValue('Dr');
    expect(medecin?.hasError('minlength')).toBeTruthy();

    medecin?.setValue('Dr. Test');
    expect(medecin?.hasError('minlength')).toBeFalsy();
  });

  it('should validate diagnostic minLength', () => {
    const diagnostic = component.consultationForm.get('diagnostic');
    diagnostic?.setValue('Test');
    expect(diagnostic?.hasError('minlength')).toBeTruthy();

    diagnostic?.setValue('Test diagnostic condition');
    expect(diagnostic?.hasError('minlength')).toBeFalsy();
  });

  it('should emit consultationAdded on successful submit', () => {
    spyOn(component.consultationAdded, 'emit');

    component.patientId = 'patient-1';
    component.consultationForm.patchValue({
      dateConsultation: new Date().toISOString().split('T')[0],
      medecin: 'Dr. Test',
      diagnostic: 'Test diagnostic',
      observations: 'Test observations',
      traitement: 'Test treatment'
    });

    component.onSubmit();

    expect(component.consultationAdded.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      patientId: 'patient-1',
      medecin: 'Dr. Test',
      diagnostic: 'Test diagnostic'
    }));
  });

  it('should not emit on invalid form', () => {
    spyOn(component.consultationAdded, 'emit');
    component.onSubmit();
    expect(component.consultationAdded.emit).not.toHaveBeenCalled();
  });

  it('should reset form after successful submit', () => {
    component.patientId = 'patient-1';
    component.consultationForm.patchValue({
      dateConsultation: new Date().toISOString().split('T')[0],
      medecin: 'Dr. Test',
      diagnostic: 'Test diagnostic'
    });

    component.onSubmit();
    expect(component.submitted).toBeFalsy();
  });

  it('should reset form on resetForm call', () => {
    component.consultationForm.patchValue({
      medecin: 'Dr. Test',
      diagnostic: 'Test diagnostic'
    });

    component.resetForm();
    expect(component.consultationForm.get('medecin')?.value).toBeNull();
    expect(component.consultationForm.get('diagnostic')?.value).toBeNull();
  });
});
