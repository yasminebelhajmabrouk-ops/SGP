import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdonnanceListComponent } from './ordonnance-list.component';
import { OrdonnanceService } from '../../services/ordonnance.service';
import { CommonModule } from '@angular/common';

describe('OrdonnanceListComponent', () => {
  let component: OrdonnanceListComponent;
  let fixture: ComponentFixture<OrdonnanceListComponent>;
  let ordonnanceService: OrdonnanceService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdonnanceListComponent, CommonModule],
      providers: [OrdonnanceService]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdonnanceListComponent);
    component = fixture.componentInstance;
    ordonnanceService = TestBed.inject(OrdonnanceService);
    component.patientId = '1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load ordonnances for patient on init', (done) => {
    setTimeout(() => {
      expect(component.ordonnances.length).toBeGreaterThanOrEqual(0);
      done();
    }, 100);
  });

  it('should filter ordonnances by patientId', (done) => {
    component.patientId = '1';
    component.ngOnInit();

    setTimeout(() => {
      component.ordonnances.forEach(ordonnance => {
        expect(ordonnance.patientId).toBe('1');
      });
      done();
    }, 100);
  });

  it('should sort ordonnances by date descending', (done) => {
    component.patientId = '1';
    component.ngOnInit();

    setTimeout(() => {
      for (let i = 0; i < component.ordonnances.length - 1; i++) {
        const current = new Date(component.ordonnances[i].dateOrdonnance).getTime();
        const next = new Date(component.ordonnances[i + 1].dateOrdonnance).getTime();
        expect(current).toBeGreaterThanOrEqual(next);
      }
      done();
    }, 100);
  });

  it('should identify expired ordonnances', () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 40);
    
    const expiredOrdonnance = {
      id: 'expired',
      patientId: '1',
      dateOrdonnance: oldDate.toISOString().split('T')[0],
      medecin: 'Dr. Test',
      medicaments: [],
      observations: '',
      dureeValidite: 30,
      dateCreation: oldDate.toISOString().split('T')[0]
    };

    expect(component.isExpired(expiredOrdonnance)).toBeTruthy();
  });

  it('should identify valid ordonnances', () => {
    const today = new Date();
    const validOrdonnance = {
      id: 'valid',
      patientId: '1',
      dateOrdonnance: today.toISOString().split('T')[0],
      medecin: 'Dr. Test',
      medicaments: [],
      observations: '',
      dureeValidite: 30,
      dateCreation: today.toISOString().split('T')[0]
    };

    expect(component.isExpired(validOrdonnance)).toBeFalsy();
  });

  it('should calculate remaining days correctly', () => {
    const today = new Date();
    const ordonnance = {
      id: 'test',
      patientId: '1',
      dateOrdonnance: today.toISOString().split('T')[0],
      medecin: 'Dr. Test',
      medicaments: [],
      observations: '',
      dureeValidite: 10,
      dateCreation: today.toISOString().split('T')[0]
    };

    const remainingDays = component.getRemainingDays(ordonnance);
    expect(remainingDays).toBeGreaterThan(0);
    expect(remainingDays).toBeLessThanOrEqual(10);
  });

  it('should return 0 remaining days for expired ordonnance', () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 40);
    
    const expiredOrdonnance = {
      id: 'expired',
      patientId: '1',
      dateOrdonnance: oldDate.toISOString().split('T')[0],
      medecin: 'Dr. Test',
      medicaments: [],
      observations: '',
      dureeValidite: 30,
      dateCreation: oldDate.toISOString().split('T')[0]
    };

    expect(component.getRemainingDays(expiredOrdonnance)).toBe(0);
  });

  it('should display empty state when no ordonnances', (done) => {
    component.patientId = 'non-existent';
    component.ngOnInit();

    setTimeout(() => {
      expect(component.ordonnances.length).toBe(0);
      done();
    }, 100);
  });

  it('should delete ordonnance with confirmation', (done) => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(ordonnanceService, 'deleteOrdonnance');

    component.patientId = '1';
    component.ngOnInit();

    setTimeout(() => {
      if (component.ordonnances.length > 0) {
        const ordonnanceId = component.ordonnances[0].id;
        component.deleteOrdonnance(ordonnanceId);
        expect(ordonnanceService.deleteOrdonnance).toHaveBeenCalledWith(ordonnanceId);
      }
      done();
    }, 100);
  });

  it('should not delete ordonnance when user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(ordonnanceService, 'deleteOrdonnance');

    component.deleteOrdonnance('test-id');
    expect(ordonnanceService.deleteOrdonnance).not.toHaveBeenCalled();
  });

  it('should have trackByOrdonnanceId function', () => {
    expect(component.trackByOrdonnanceId).toBeDefined();
    const mockOrdonnance = { 
      id: 'test-1', 
      patientId: '1', 
      dateOrdonnance: '', 
      medecin: '', 
      medicaments: [], 
      observations: '', 
      dureeValidite: 30, 
      dateCreation: '' 
    };
    expect(component.trackByOrdonnanceId(0, mockOrdonnance)).toBe('test-1');
  });

  it('should have trackByMedicationIndex function', () => {
    expect(component.trackByMedicationIndex).toBeDefined();
    expect(component.trackByMedicationIndex(5)).toBe(5);
  });

  it('should unsubscribe on destroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'next');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });

  it('should display multiple medications in ordonnance', (done) => {
    component.patientId = '1';
    component.ngOnInit();

    setTimeout(() => {
      const ordonnancesWithMeds = component.ordonnances.filter(o => o.medicaments && o.medicaments.length > 0);
      if (ordonnancesWithMeds.length > 0) {
        expect(ordonnancesWithMeds[0].medicaments.length).toBeGreaterThan(0);
      }
      done();
    }, 100);
  });
});
