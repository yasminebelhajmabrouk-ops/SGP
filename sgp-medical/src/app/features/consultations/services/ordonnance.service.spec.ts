import { TestBed } from '@angular/core/testing';
import { OrdonnanceService } from './ordonnance.service';
import { Ordonnance, Medication } from '../models/consultation.model';

describe('OrdonnanceService', () => {
  let service: OrdonnanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdonnanceService]
    });
    service = TestBed.inject(OrdonnanceService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default ordonnances', () => {
    let ordonnances: Ordonnance[] = [];
    service.ordonnances$.subscribe(o => {
      ordonnances = o;
    });
    expect(ordonnances.length).toBeGreaterThan(0);
  });

  it('should get all ordonnances', () => {
    let ordonnances: Ordonnance[] = [];
    service.getAllOrdonnances().subscribe(o => {
      ordonnances = o;
    });
    expect(Array.isArray(ordonnances)).toBeTruthy();
    expect(ordonnances.length).toBeGreaterThan(0);
  });

  it('should get ordonnances by patient ID', () => {
    const patientId = '1';
    let ordonnances: Ordonnance[] = [];
    service.getOrdonnancesByPatient(patientId).subscribe(o => {
      ordonnances = o;
    });
    ordonnances.forEach(ordonnance => {
      expect(ordonnance.patientId).toBe(patientId);
    });
  });

  it('should return empty array for non-existent patient', () => {
    let ordonnances: Ordonnance[] = [];
    service.getOrdonnancesByPatient('non-existent-id').subscribe(o => {
      ordonnances = o;
    });
    expect(ordonnances.length).toBe(0);
  });

  it('should get ordonnance by ID', () => {
    let ordonnances: Ordonnance[] = [];
    service.ordonnances$.subscribe(o => {
      ordonnances = o;
    });
    
    if (ordonnances.length > 0) {
      const ordonnanceId = ordonnances[0].id;
      const ordonnance = service.getOrdonnanceById(ordonnanceId);
      expect(ordonnance).toBeTruthy();
      expect(ordonnance?.id).toBe(ordonnanceId);
    }
  });

  it('should return undefined for non-existent ordonnance ID', () => {
    const ordonnance = service.getOrdonnanceById('non-existent-id');
    expect(ordonnance).toBeUndefined();
  });

  it('should add new ordonnance with medications', () => {
    const medications: Medication[] = [
      {
        id: 'med-1',
        nom: 'Métformine',
        dosage: '500mg',
        frequence: '2 fois par jour',
        duree: '30 jours',
        posologie: 'Pendant les repas'
      }
    ];

    const newOrdonnance = {
      patientId: '2',
      dateOrdonnance: '2024-03-15',
      medecin: 'Dr. Test',
      medicaments: medications,
      observations: 'Test notes',
      dureeValidite: '30 jours'
    };

    const addedOrdonnance = service.addOrdonnance(newOrdonnance);
    expect(addedOrdonnance).toBeTruthy();
    expect(addedOrdonnance.id).toBeDefined();
    expect(addedOrdonnance.medicaments.length).toBe(1);

    let ordonnances: Ordonnance[] = [];
    service.ordonnances$.subscribe(o => {
      ordonnances = o;
    });
    const found = ordonnances.find(o => o.patientId === '2');
    expect(found).toBeTruthy();
  });

  it('should update ordonnance', () => {
    let ordonnances: Ordonnance[] = [];
    service.ordonnances$.subscribe(o => {
      ordonnances = o;
    });
    
    if (ordonnances.length > 0) {
      const ordonnanceId = ordonnances[0].id;
      const updated = service.updateOrdonnance(ordonnanceId, { observations: 'Updated observations' });
      expect(updated?.observations).toBe('Updated observations');
    }
  });

  it('should delete ordonnance', () => {
    let ordonnances: Ordonnance[] = [];
    service.ordonnances$.subscribe(o => {
      ordonnances = o;
    });
    
    if (ordonnances.length > 0) {
      const ordonnanceIdToDelete = ordonnances[0].id;
      service.deleteOrdonnance(ordonnanceIdToDelete);
      const deleted = service.getOrdonnanceById(ordonnanceIdToDelete);
      expect(deleted).toBeUndefined();
    }
  });

  it('should handle ordonnance with multiple medications', () => {
    const medications: Medication[] = [
      {
        id: 'med-1',
        nom: 'Amoxicilline',
        dosage: '500mg',
        frequence: '3 fois par jour',
        duree: '7 jours',
        posologie: 'Une capsule par dose'
      },
      {
        id: 'med-2',
        nom: 'Doliprane',
        dosage: '500mg',
        frequence: 'Selon besoin',
        duree: '14 jours',
        posologie: 'Max 4 grammes par jour'
      }
    ];

    const multiMedOrdonnance = {
      patientId: '3',
      dateOrdonnance: '2024-03-16',
      medecin: 'Dr. Multi',
      medicaments: medications,
      observations: 'Multiple medications test',
      dureeValidite: '14 jours'
    };

    service.addOrdonnance(multiMedOrdonnance);
    const addedOrdonnances: Ordonnance[] = [];
    service.ordonnances$.subscribe(o => {
      addedOrdonnances.push(...o);
    });
    const multiMed = addedOrdonnances.find(o => o.medicaments.length === 2);
    expect(multiMed?.medicaments.length).toBe(2);
  });

  it('should persist ordonnances to localStorage', () => {
    const newOrdonnance = {
      patientId: '4',
      dateOrdonnance: '2024-03-17',
      medecin: 'Dr. Persist',
      medicaments: [],
      observations: '',
      dureeValidite: '30 jours'
    };

    service.addOrdonnance(newOrdonnance);
    const stored = localStorage.getItem('ordonnances');
    expect(stored).toBeTruthy();
    const parsedOrdonnances = JSON.parse(stored!);
    expect(parsedOrdonnances.some((o: Ordonnance) => o.patientId === '4')).toBeTruthy();
  });

  it('should load ordonnances from localStorage', () => {
    const mockOrdonnances: Ordonnance[] = [
      {
        id: 'mock-ord',
        patientId: '1',
        dateOrdonnance: '2024-03-10',
        medecin: 'Dr. Mock',
        medicaments: [],
        observations: '',
        dureeValidite: '30 jours',
        dateCreation: '2024-03-10'
      }
    ];
    localStorage.setItem('ordonnances', JSON.stringify(mockOrdonnances));

    const newService = new OrdonnanceService();
    expect(newService).toBeTruthy();
  });

  it('should emit updated ordonnances on subscription', () => {
    let emissionCount = 0;
    const subscription = service.ordonnances$.subscribe(() => {
      emissionCount++;
    });

    const newOrdonnance = {
      patientId: '5',
      dateOrdonnance: '2024-03-18',
      medecin: 'Dr. Emission',
      medicaments: [],
      observations: '',
      dureeValidite: '30 jours'
    };

    service.addOrdonnance(newOrdonnance);
    expect(emissionCount).toBeGreaterThan(0);
    subscription.unsubscribe();
  });

  it('should generate unique IDs for ordonnances', () => {
    const ordonnance1 = {
      patientId: '6',
      dateOrdonnance: '2024-03-19',
      medecin: 'Dr. Test',
      medicaments: [],
      observations: '',
      dureeValidite: '30 jours'
    };

    const ordonnance2 = {
      patientId: '6',
      dateOrdonnance: '2024-03-20',
      medecin: 'Dr. Test',
      medicaments: [],
      observations: '',
      dureeValidite: '30 jours'
    };

    const added1 = service.addOrdonnance(ordonnance1);
    const added2 = service.addOrdonnance(ordonnance2);

    expect(added1.id).not.toBe(added2.id);
  });
});
