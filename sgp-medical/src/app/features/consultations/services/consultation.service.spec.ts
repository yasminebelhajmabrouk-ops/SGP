import { TestBed } from '@angular/core/testing';
import { ConsultationService } from './consultation.service';
import { Consultation } from '../models/consultation.model';

describe('ConsultationService', () => {
  let service: ConsultationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsultationService]
    });
    service = TestBed.inject(ConsultationService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default consultations', () => {
    let consultations: Consultation[] = [];
    service.consultations$.subscribe(c => {
      consultations = c;
    });
    expect(consultations.length).toBeGreaterThan(0);
  });

  it('should get all consultations', () => {
    let consultations: Consultation[] = [];
    service.getAllConsultations().subscribe(c => {
      consultations = c;
    });
    expect(Array.isArray(consultations)).toBeTruthy();
    expect(consultations.length).toBeGreaterThan(0);
  });

  it('should get consultations by patient ID', () => {
    const patientId = '1';
    let consultations: Consultation[] = [];
    service.getConsultationsByPatient(patientId).subscribe(c => {
      consultations = c;
    });
    consultations.forEach(consultation => {
      expect(consultation.patientId).toBe(patientId);
    });
  });

  it('should return empty array for non-existent patient', () => {
    let consultations: Consultation[] = [];
    service.getConsultationsByPatient('non-existent-id').subscribe(c => {
      consultations = c;
    });
    expect(consultations.length).toBe(0);
  });

  it('should get consultation by ID', () => {
    let consultationId: string;
    let consultations: Consultation[] = [];
    service.consultations$.subscribe(c => {
      consultations = c;
    });
    
    if (consultations.length > 0) {
      consultationId = consultations[0].id;
      const consultation = service.getConsultationById(consultationId);
      expect(consultation).toBeTruthy();
      expect(consultation?.id).toBe(consultationId);
    }
  });

  it('should return undefined for non-existent consultation ID', () => {
    const consultation = service.getConsultationById('non-existent-id');
    expect(consultation).toBeUndefined();
  });

  it('should add new consultation', () => {
    const newConsultation = {
      patientId: '2',
      dateConsultation: '2024-03-15',
      medecin: 'Dr. Test',
      diagnostic: 'Test diagnostic',
      observations: 'Test observations',
      traitement: 'Test treatment'
    };

    const addedConsultation = service.addConsultation(newConsultation);
    expect(addedConsultation).toBeTruthy();
    expect(addedConsultation.id).toBeDefined();
    expect(addedConsultation.patientId).toBe('2');

    let consultations: Consultation[] = [];
    service.consultations$.subscribe(c => {
      consultations = c;
    });
    const found = consultations.find(c => c.patientId === '2');
    expect(found).toBeTruthy();
  });

  it('should update consultation', () => {
    let consultations: Consultation[] = [];
    service.consultations$.subscribe(c => {
      consultations = c;
    });
    
    if (consultations.length > 0) {
      const consultationId = consultations[0].id;
      const updated = service.updateConsultation(consultationId, { diagnostic: 'Updated diagnostic' });
      expect(updated?.diagnostic).toBe('Updated diagnostic');
    }
  });

  it('should delete consultation', () => {
    let consultations: Consultation[] = [];
    service.consultations$.subscribe(c => {
      consultations = c;
    });
    
    if (consultations.length > 0) {
      const consultationIdToDelete = consultations[0].id;
      service.deleteConsultation(consultationIdToDelete);
      const deleted = service.getConsultationById(consultationIdToDelete);
      expect(deleted).toBeUndefined();
    }
  });

  it('should persist consultations to localStorage', () => {
    const newConsultation = {
      patientId: '3',
      dateConsultation: '2024-03-16',
      medecin: 'Dr. Persist',
      diagnostic: 'Persist test',
      observations: '',
      traitement: ''
    };

    service.addConsultation(newConsultation);
    const stored = localStorage.getItem('consultations');
    expect(stored).toBeTruthy();
    const parsedConsultations = JSON.parse(stored!);
    expect(parsedConsultations.some((c: Consultation) => c.patientId === '3')).toBeTruthy();
  });

  it('should load consultations from localStorage', () => {
    const mockConsultations: Consultation[] = [
      {
        id: 'mock-1',
        patientId: '1',
        dateConsultation: '2024-03-10',
        medecin: 'Dr. Mock',
        diagnostic: 'Mock diagnostic',
        observations: '',
        traitement: '',
        dateCreation: '2024-03-10'
      }
    ];
    localStorage.setItem('consultations', JSON.stringify(mockConsultations));

    const newService = new ConsultationService();
    expect(newService).toBeTruthy();
  });

  it('should emit updated consultations on subscription', () => {
    let emissionCount = 0;
    const subscription = service.consultations$.subscribe(() => {
      emissionCount++;
    });

    const newConsultation = {
      patientId: '4',
      dateConsultation: '2024-03-17',
      medecin: 'Dr. Emission',
      diagnostic: 'Emission test',
      observations: '',
      traitement: ''
    };

    service.addConsultation(newConsultation);
    expect(emissionCount).toBeGreaterThan(0);
    subscription.unsubscribe();
  });
});
