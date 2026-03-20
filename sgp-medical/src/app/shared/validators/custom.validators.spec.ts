import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import {
  insValidator,
  dateOfBirthValidator,
  bloodGroupValidator,
  phoneValidator,
  postalCodeValidator,
  cim10Validator,
  matchValidator,
  allergyValidator,
  vitalSignValidator,
} from './custom.validators';

describe('Custom Validators', () => {
  describe('insValidator', () => {
    it('should validate valid 13-digit INS', () => {
      const control = new FormControl('1234567890123');
      const result = insValidator()(control);
      expect(result).toBeNull();
    });

    it('should validate valid 18-digit INS', () => {
      const control = new FormControl('123456789012345678');
      const result = insValidator()(control);
      expect(result).toBeNull();
    });

    it('should reject less than 13 digits', () => {
      const control = new FormControl('123456789012');
      const result = insValidator()(control);
      expect(result).not.toBeNull();
      expect(result?.['invalidIns']).toBeDefined();
    });

    it('should reject more than 18 digits', () => {
      const control = new FormControl('1234567890123456789');
      const result = insValidator()(control);
      expect(result).not.toBeNull();
    });

    it('should reject non-numeric values', () => {
      const control = new FormControl('123456789012A');
      const result = insValidator()(control);
      expect(result).not.toBeNull();
    });

    it('should reject empty value', () => {
      const control = new FormControl('');
      const result = insValidator()(control);
      expect(result).not.toBeNull();
    });
  });

  describe('dateOfBirthValidator', () => {
    it('should validate valid past date', () => {
      const control = new FormControl('1990-05-15');
      const result = dateOfBirthValidator()(control);
      expect(result).toBeNull();
    });

    it('should reject future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      const control = new FormControl(dateString);
      const result = dateOfBirthValidator()(control);
      expect(result).not.toBeNull();
    });

    it('should reject date before 1850', () => {
      const control = new FormControl('1800-01-01');
      const result = dateOfBirthValidator()(control);
      expect(result).not.toBeNull();
    });

    it('should accept date in year 1850', () => {
      const control = new FormControl('1850-01-01');
      const result = dateOfBirthValidator()(control);
      expect(result).toBeNull();
    });
  });

  describe('bloodGroupValidator', () => {
    const validGroups = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
    const invalidGroups = ['C+', 'O', 'AB', 'invalid', ''];

    validGroups.forEach(group => {
      it(`should validate blood group ${group}`, () => {
        const control = new FormControl(group);
        const result = bloodGroupValidator()(control);
        expect(result).toBeNull();
      });
    });

    invalidGroups.forEach(group => {
      it(`should reject blood group ${group}`, () => {
        const control = new FormControl(group);
        const result = bloodGroupValidator()(control);
        expect(result).not.toBeNull();
      });
    });
  });

  describe('phoneValidator', () => {
    it('should validate French format with +33', () => {
      const control = new FormControl('+33123456789');
      const result = phoneValidator()(control);
      expect(result).toBeNull();
    });

    it('should validate 10-digit French number', () => {
      const control = new FormControl('0123456789');
      const result = phoneValidator()(control);
      expect(result).toBeNull();
    });

    it('should reject invalid format', () => {
      const control = new FormControl('123456');
      const result = phoneValidator()(control);
      expect(result).not.toBeNull();
    });

    it('should reject non-numeric characters', () => {
      const control = new FormControl('01234567AB');
      const result = phoneValidator()(control);
      expect(result).not.toBeNull();
    });
  });

  describe('postalCodeValidator', () => {
    it('should validate 5-digit postal code', () => {
      const control = new FormControl('75001');
      const result = postalCodeValidator()(control);
      expect(result).toBeNull();
    });

    it('should reject less than 5 digits', () => {
      const control = new FormControl('7500');
      const result = postalCodeValidator()(control);
      expect(result).not.toBeNull();
    });

    it('should reject more than 5 digits', () => {
      const control = new FormControl('750001');
      const result = postalCodeValidator()(control);
      expect(result).not.toBeNull();
    });

    it('should reject non-numeric characters', () => {
      const control = new FormControl('7500A');
      const result = postalCodeValidator()(control);
      expect(result).not.toBeNull();
    });
  });

  describe('cim10Validator', () => {
    it('should validate valid CIM-10 code A00', () => {
      const control = new FormControl('A00');
      const result = cim10Validator()(control);
      expect(result).toBeNull();
    });

    it('should validate valid CIM-10 code Z99.99', () => {
      const control = new FormControl('Z99.99');
      const result = cim10Validator()(control);
      expect(result).toBeNull();
    });

    it('should validate code with 2 decimal places', () => {
      const control = new FormControl('J10.01');
      const result = cim10Validator()(control);
      expect(result).toBeNull();
    });

    it('should reject invalid letter start', () => {
      const control = new FormControl('1AB.00');
      const result = cim10Validator()(control);
      expect(result).not.toBeNull();
    });

    it('should reject invalid format', () => {
      const control = new FormControl('INVALID');
      const result = cim10Validator()(control);
      expect(result).not.toBeNull();
    });

    it('should reject code beyond Z99.99', () => {
      const control = new FormControl('AA00.00');
      const result = cim10Validator()(control);
      expect(result).not.toBeNull();
    });
  });

  describe('matchValidator', () => {
    it('should validate matching field values', () => {
      const group = new FormGroup({
        password: new FormControl('test123'),
        confirmPassword: new FormControl('test123'),
      });
      const result = matchValidator('password', 'confirmPassword')(group);
      expect(result).toBeNull();
    });

    it('should reject non-matching values', () => {
      const group = new FormGroup({
        password: new FormControl('test123'),
        confirmPassword: new FormControl('test456'),
      });
      const result = matchValidator('password', 'confirmPassword')(group);
      expect(result).not.toBeNull();
      expect(result?.['mismatch']).toBeDefined();
    });
  });

  describe('allergyValidator', () => {
    it('should validate array with valid allergy objects', () => {
      const control = new FormControl([
        {
          substance: 'Pénicilline',
          severite: 'grave',
          reaction: 'Choc anaphylactique',
        },
      ]);
      const result = allergyValidator()(control);
      expect(result).toBeNull();
    });

    it('should reject invalid severity level', () => {
      const control = new FormControl([
        {
          substance: 'Pénicilline',
          severite: 'invalid',
          reaction: 'Réaction',
        },
      ]);
      const result = allergyValidator()(control);
      expect(result).not.toBeNull();
    });

    it('should accept empty allergy array', () => {
      const control = new FormControl([]);
      const result = allergyValidator()(control);
      expect(result).toBeNull();
    });
  });

  describe('vitalSignValidator', () => {
    it('should validate vital sign within range', () => {
      const control = new FormControl(120);
      const result = vitalSignValidator(100, 140)(control);
      expect(result).toBeNull();
    });

    it('should reject vital sign below minimum', () => {
      const control = new FormControl(90);
      const result = vitalSignValidator(100, 140)(control);
      expect(result).not.toBeNull();
    });

    it('should reject vital sign above maximum', () => {
      const control = new FormControl(150);
      const result = vitalSignValidator(100, 140)(control);
      expect(result).not.toBeNull();
    });

    it('should accept boundary values', () => {
      const control = new FormControl(100);
      const result = vitalSignValidator(100, 140)(control);
      expect(result).toBeNull();
    });
  });
});
