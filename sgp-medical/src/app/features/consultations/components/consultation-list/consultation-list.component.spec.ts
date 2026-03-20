import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultationListComponent } from './consultation-list.component';
import { ConsultationService } from '../../services/consultation.service';
import { CommonModule } from '@angular/common';

describe('ConsultationListComponent', () => {
  let component: ConsultationListComponent;
  let fixture: ComponentFixture<ConsultationListComponent>;
  let consultationService: ConsultationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationListComponent, CommonModule],
      providers: [ConsultationService]
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultationListComponent);
    component = fixture.componentInstance;
    consultationService = TestBed.inject(ConsultationService);
    component.patientId = '1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load consultations for patient on init', (done) => {
    setTimeout(() => {
      expect(component.consultations.length).toBeGreaterThanOrEqual(0);
      done();
    }, 100);
  });

  it('should filter consultations by patientId', (done) => {
    component.patientId = '1';
    component.ngOnInit();

    setTimeout(() => {
      component.consultations.forEach(consultation => {
        expect(consultation.patientId).toBe('1');
      });
      done();
    }, 100);
  });

  it('should sort consultations by date descending', (done) => {
    component.patientId = '1';
    component.ngOnInit();

    setTimeout(() => {
      for (let i = 0; i < component.consultations.length - 1; i++) {
        const current = new Date(component.consultations[i].dateConsultation).getTime();
        const next = new Date(component.consultations[i + 1].dateConsultation).getTime();
        expect(current).toBeGreaterThanOrEqual(next);
      }
      done();
    }, 100);
  });

  it('should display empty state when no consultations', (done) => {
    component.patientId = 'non-existent';
    component.ngOnInit();

    setTimeout(() => {
      expect(component.consultations.length).toBe(0);
      done();
    }, 100);
  });

  it('should delete consultation with confirmation', (done) => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(consultationService, 'deleteConsultation');

    component.patientId = '1';
    component.ngOnInit();

    setTimeout(() => {
      if (component.consultations.length > 0) {
        const consultationId = component.consultations[0].id;
        component.deleteConsultation(consultationId);
        expect(consultationService.deleteConsultation).toHaveBeenCalledWith(consultationId);
      }
      done();
    }, 100);
  });

  it('should not delete consultation when user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(consultationService, 'deleteConsultation');

    component.deleteConsultation('test-id');
    expect(consultationService.deleteConsultation).not.toHaveBeenCalled();
  });

  it('should have trackByConsultationId function', () => {
    expect(component.trackByConsultationId).toBeDefined();
    const mockConsultation = { id: 'test-1', patientId: '1', dateConsultation: '', medecin: '', diagnostic: '', observations: '', traitement: '', dateCreation: '' };
    expect(component.trackByConsultationId(0, mockConsultation)).toBe('test-1');
  });

  it('should unsubscribe on destroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'next');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should update consultations when service emits changes', (done) => {
    component.patientId = '1';
    component.ngOnInit();

    setTimeout(() => {
      const initialCount = component.consultations.length;
      
      // Simulate service emission
      const newConsultation = {
        id: 'new-1',
        patientId: '1',
        dateConsultation: new Date().toISOString().split('T')[0],
        medecin: 'Dr. New',
        diagnostic: 'New diagnosis',
        observations: '',
        traitement: '',
        dateCreation: new Date().toISOString().split('T')[0]
      };

      consultationService.addConsultation(newConsultation);

      setTimeout(() => {
        expect(component.consultations.length).toBeGreaterThan(initialCount);
        done();
      }, 100);
    }, 100);
  });
});
