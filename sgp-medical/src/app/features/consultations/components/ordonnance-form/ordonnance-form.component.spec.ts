import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdonnanceFormComponent } from './ordonnance-form.component';
import { OrdonnanceService } from '../../services/ordonnance.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('OrdonnanceFormComponent', () => {
  let component: OrdonnanceFormComponent;
  let fixture: ComponentFixture<OrdonnanceFormComponent>;
  let ordonnanceService: OrdonnanceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdonnanceFormComponent, CommonModule, ReactiveFormsModule],
      providers: [OrdonnanceService]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdonnanceFormComponent);
    component = fixture.componentInstance;
    ordonnanceService = TestBed.inject(OrdonnanceService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with at least one medication', () => {
    expect(component.medicaments.length).toBeGreaterThanOrEqual(1);
  });

  it('should set dateOrdonnance to today', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(component.ordonnanceForm.get('dateOrdonnance')?.value).toBe(today);
  });

  it('should set default dureeValidite to 30 days', () => {
    expect(component.ordonnanceForm.get('dureeValidite')?.value).toBe(30);
  });

  it('should add medication to form array', () => {
    const initialLength = component.medicaments.length;
    component.addMedication();
    expect(component.medicaments.length).toBe(initialLength + 1);
  });

  it('should not remove last medication', () => {
    component.medicaments.clear();
    component.addMedication();
    expect(component.medicaments.length).toBe(1);
    component.removeMedication(0);
    expect(component.medicaments.length).toBe(1);
  });

  it('should remove medication from array', () => {
    component.addMedication();
    const initialLength = component.medicaments.length;
    component.removeMedication(0);
    expect(component.medicaments.length).toBe(initialLength - 1);
  });

  it('should validate medication fields', () => {
    const medicationForm = component.medicaments.at(0);
    expect(medicationForm.invalid).toBeTruthy();

    medicationForm.patchValue({
      nom: 'Aspirin',
      dosage: '500mg',
      frequence: '3 fois par jour',
      duree: '7 jours'
    });
    expect(medicationForm.invalid).toBeFalsy();
  });

  it('should validate dureeValidite range', () => {
    const duree = component.ordonnanceForm.get('dureeValidite');
    
    duree?.setValue(0);
    expect(duree?.hasError('min')).toBeTruthy();

    duree?.setValue(366);
    expect(duree?.hasError('max')).toBeTruthy();

    duree?.setValue(30);
    expect(duree?.invalid).toBeFalsy();
  });

  it('should emit ordonnanceAdded on successful submit', () => {
    spyOn(component.ordonnanceAdded, 'emit');

    component.patientId = 'patient-1';
    component.ordonnanceForm.patchValue({
      dateOrdonnance: new Date().toISOString().split('T')[0],
      medecin: 'Dr. Test',
      dureeValidite: 30
    });

    const medication = component.medicaments.at(0);
    medication.patchValue({
      nom: 'Test Med',
      dosage: '500mg',
      frequence: '2 fois par jour',
      duree: '7 jours'
    });

    component.onSubmit();
    expect(component.ordonnanceAdded.emit).toHaveBeenCalledWith(jasmine.objectContaining({
      patientId: 'patient-1',
      medecin: 'Dr. Test'
    }));
  });

  it('should not emit with empty medications', () => {
    spyOn(component.ordonnanceAdded, 'emit');

    component.medicaments.clear();
    component.ordonnanceForm.patchValue({
      dateOrdonnance: new Date().toISOString().split('T')[0],
      medecin: 'Dr. Test'
    });

    component.onSubmit();
    expect(component.ordonnanceAdded.emit).not.toHaveBeenCalled();
  });

  it('should not emit with invalid form', () => {
    spyOn(component.ordonnanceAdded, 'emit');
    component.onSubmit();
    expect(component.ordonnanceAdded.emit).not.toHaveBeenCalled();
  });

  it('should reset medications on reset', () => {
    component.medicaments.at(0).patchValue({
      nom: 'Test Med',
      dosage: '500mg'
    });

    component.resetForm();
    expect(component.medicaments.length).toBe(1);
    expect(component.medicaments.at(0).get('nom')?.value).toBeNull();
  });

  it('should emit include all medications in ordonnance', () => {
    spyOn(component.ordonnanceAdded, 'emit');

    component.patientId = 'patient-1';
    component.ordonnanceForm.patchValue({
      dateOrdonnance: new Date().toISOString().split('T')[0],
      medecin: 'Dr. Multi-Med'
    });

    // Add and fill first medication
    component.medicaments.at(0).patchValue({
      nom: 'Med 1',
      dosage: '500mg',
      frequence: '2 fois',
      duree: '7 jours'
    });

    // Add second medication
    component.addMedication();
    component.medicaments.at(1).patchValue({
      nom: 'Med 2',
      dosage: '250mg',
      frequence: '3 fois',
      duree: '10 jours'
    });

    component.onSubmit();
    
    const emittedOrdonnance = (component.ordonnanceAdded.emit as jasmine.Spy).calls.mostRecent().args[0];
    expect(emittedOrdonnance.medicaments.length).toBe(2);
    expect(emittedOrdonnance.medicaments[0].nom).toBe('Med 1');
    expect(emittedOrdonnance.medicaments[1].nom).toBe('Med 2');
  });
});
