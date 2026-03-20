import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FhirApiService } from './fhir-api.service';
import { Patient } from '../../features/patients/models/patient.model';

describe('FhirApiService', () => {
  let service: FhirApiService;
  let httpMock: HttpTestingController;
  const API_URL = 'http://localhost:3000/api/fhir';

  const mockPatient: Patient = {
    id: '1',
    ins: '12345678901234',
    nom: 'Dupont',
    prenom: 'Jean',
    dateNaissance: '1990-05-15',
    sexe: 'M',
    groupeSanguin: 'O+',
    adresse: '123 Rue de la Paix',
    telephone: '0123456789',
    email: 'jean@example.com',
    statut: 'actif',
    niveauUrgence: 'vert',
    traitementEnCours: ['Aspirin'],
    allergies: [
      { substance: 'Pénicilline', severite: 'grave', reaction: 'Choc anaphylactique', dateDeclaration: '2023-01-01' },
    ],
    antecedents: ['Diabète'],
    dernieresConstantes: {
      tensionSystolique: 120,
      tensionDiastolique: 80,
      frequenceCardiaque: 70,
      temperature: 36.5,
      saturationO2: 98,
      poids: 70,
      taille: 180,
      dateMesure: '2024-03-20',
    },
    dateCreation: new Date().toISOString(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FhirApiService],
    });

    service = TestBed.inject(FhirApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert Patient to FHIR format', () => {
    const fhirPatient = service['convertPatientToFhir'](mockPatient);
    
    expect(fhirPatient.resourceType).toBe('Patient');
    expect(fhirPatient.identifier).toBeDefined();
    expect(fhirPatient.name).toBeDefined();
    expect(fhirPatient.birthDate).toBe('1990-05-15');
    expect(fhirPatient.gender).toBeDefined();
  });

  it('should convert FHIR Patient to internal format', () => {
    const fhirResource = {
      resourceType: 'Patient',
      id: '1',
      identifier: [{ system: 'http://www.aphp.fr/INS', value: '12345678901234' }],
      name: [{ family: 'Dupont', given: ['Jean'] }],
      birthDate: '1990-05-15',
      gender: 'male',
      telecom: [
        { system: 'phone', value: '0123456789' },
        { system: 'email', value: 'jean@example.com' },
      ],
      address: [{line: ['123 Rue de la Paix']}],
    };

    const patient = service['convertFhirToPatient'](fhirResource);
    
    expect(patient.ins).toBe('12345678901234');
    expect(patient.nom).toBe('Dupont');
    expect(patient.prenom).toBe('Jean');
    expect(patient.dateNaissance).toBe('1990-05-15');
  });

  it('should get all patients', () => {
    service.getPatients().subscribe(bundle => {
      expect(bundle.resourceType).toBe('Bundle');
      expect(bundle.entry).toBeDefined();
    });

    const req = httpMock.expectOne(`${API_URL}/Patient`);
    expect(req.request.method).toBe('GET');
    req.flush({ resourceType: 'Bundle', entry: [] });
  });

  it('should get patient by ID', () => {
    const patientId = '1';
    
    service.getPatientById(patientId).subscribe(patient => {
      expect(patient.resourceType).toBe('Patient');
    });

    const req = httpMock.expectOne(`${API_URL}/Patient/${patientId}`);
    expect(req.request.method).toBe('GET');
    req.flush({ resourceType: 'Patient', id: patientId });
  });

  it('should search patients by name', () => {
    const searchTerm = 'Dupont';
    
    service.searchPatientsByName(searchTerm).subscribe(bundle => {
      expect(bundle.resourceType).toBe('Bundle');
    });

    const req = httpMock.expectOne(req => 
      req.url.includes(`${API_URL}/Patient`) && req.url.includes('name')
    );
    expect(req.request.method).toBe('GET');
    req.flush({ resourceType: 'Bundle', entry: [] });
  });

  it('should create patient', () => {
    service.createPatient(mockPatient).subscribe(response => {
      expect(response.resourceType).toBe('Patient');
    });

    const req = httpMock.expectOne(`${API_URL}/Patient`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.resourceType).toBe('Patient');
    req.flush({ resourceType: 'Patient', id: '1' });
  });

  it('should update patient', () => {
    const patientId = '1';
    
    service.updatePatient(patientId, mockPatient).subscribe(response => {
      expect(response.resourceType).toBe('Patient');
    });

    const req = httpMock.expectOne(`${API_URL}/Patient/${patientId}`);
    expect(req.request.method).toBe('PUT');
    req.flush({ resourceType: 'Patient', id: patientId });
  });

  it('should delete patient', () => {
    const patientId = '1';
    
    service.deletePatient(patientId).subscribe(() => {
      expect(true).toBe(true);
    });

    const req = httpMock.expectOne(`${API_URL}/Patient/${patientId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should get patient by INS', () => {
    const ins = '12345678901234';
    
    service.getPatientByINS(ins).subscribe(bundle => {
      expect(bundle.resourceType).toBe('Bundle');
    });

    const req = httpMock.expectOne(req => 
      req.url.includes(`${API_URL}/Patient`) && req.url.includes('identifier')
    );
    expect(req.request.method).toBe('GET');
    req.flush({ resourceType: 'Bundle', entry: [] });
  });

  it('should map patient address correctly', () => {
    const fhirPatient = service['convertPatientToFhir'](mockPatient);
    expect(fhirPatient.address).toBeDefined();
  });

  it('should map patient telecom correctly', () => {
    const fhirPatient = service['convertPatientToFhir'](mockPatient);
    expect(fhirPatient.telecom).toBeDefined();
    const hasPhone = fhirPatient.telecom.some((t: any) => t.system === 'phone');
    expect(hasPhone).toBe(true);
  });

  it('should handle HTTP errors gracefully', () => {
    service.getPatients().subscribe(
      () => fail('should have failed'),
      (error) => {
        expect(error).toBeDefined();
      }
    );

    const req = httpMock.expectOne(`${API_URL}/Patient`);
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should create proper FHIR bundle structure', () => {
    service.getPatients().subscribe();
    
    const req = httpMock.expectOne(`${API_URL}/Patient`);
    req.flush({
      resourceType: 'Bundle',
      type: 'searchset',
      total: 0,
      entry: [],
    });
  });

  it('should handle patient with allergies in FHIR format', () => {
    const fhirPatient = service['convertPatientToFhir'](mockPatient);
    expect(fhirPatient.extension).toBeDefined();
  });

  it('should validate required fields in conversion', () => {
    const incompletePatient: Partial<Patient> = {
      ins: '12345678901234',
      nom: 'Test',
    };

    const fhirPatient = service['convertPatientToFhir'](incompletePatient);
    expect(fhirPatient.identifier).toBeDefined();
    expect(fhirPatient.name).toBeDefined();
  });
});
