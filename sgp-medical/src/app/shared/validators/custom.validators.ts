import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/**
 * Custom Validators for Medical Forms
 */

/**
 * Validator: INS (Identité Nationale de Santé) Format
 * Must be 13-18 digits
 */
export function insValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Don't validate empty values
    }

    const ins = control.value.toString().replace(/\s+/g, '');

    if (!/^\d{13,18}$/.test(ins)) {
      return {
        invalidIns: {
          value: control.value,
          message: 'INS doit contenir 13 à 18 chiffres'
        }
      };
    }

    return null;
  };
}

/**
 * Validator: Date of Birth (Must be between 1850 and today)
 */
export function dateOfBirthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const date = new Date(control.value);
    const today = new Date();
    const minDate = new Date('1850-01-01');

    if (date > today) {
      return { futureDate: { value: control.value } };
    }

    if (date < minDate) {
      return { tooOldDate: { value: control.value } };
    }

    // Calculate age
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--;
    }

    if (age < 0) {
      return { invalidAge: { value: control.value } };
    }

    return null;
  };
}

/**
 * Validator: Blood Group Format (A+, B-, AB+, O-, etc.)
 */
export function bloodGroupValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const validGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

    if (!validGroups.includes(control.value)) {
      return {
        invalidBloodGroup: {
          value: control.value,
          validGroups: validGroups.join(', ')
        }
      };
    }

    return null;
  };
}

/**
 * Validator: Phone Number (French format)
 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const phone = control.value.toString().replace(/\s+/g, '');

    // French phone: 9-10 digits or +33
    if (!/^(?:\+33\d{9}|\d{9,10})$/.test(phone)) {
      return {
        invalidPhone: {
          value: control.value,
          message: 'Numéro de téléphone invalide'
        }
      };
    }

    return null;
  };
}

/**
 * Validator: Postal Code (French format)
 */
export function postalCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const postalCode = control.value.toString().trim();

    if (!/^\d{5}$/.test(postalCode)) {
      return {
        invalidPostalCode: {
          value: control.value,
          message: 'Code postal invalide (5 chiffres)'
        }
      };
    }

    return null;
  };
}

/**
 * Validator: Medical Code (CIM-10)
 */
export function cim10Validator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const code = control.value.toString().toUpperCase();

    // CIM-10 format: Letter followed by 2 digits
    if (!/^[A-Z]\d{2}(\.\d{1,2})?$/.test(code)) {
      return {
        invalidCim10: {
          value: control.value,
          format: 'A00 à Z99.99'
        }
      };
    }

    return null;
  };
}

/**
 * Validator: Match Two Form Controls
 * Usage: matchValidator('password', 'confirmPassword')
 */
export function matchValidator(password: string, confirmPassword: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const passwordControl = group.get(password);
    const confirmPasswordControl = group.get(confirmPassword);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      const errors = confirmPasswordControl.errors;
      if (errors) {
        delete errors['passwordMismatch'];
        confirmPasswordControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
    }

    return null;
  };
}

/**
 * Async Validator: Check INS Uniqueness (mock)
 */
export function insUniqueValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    // Simulate API call with delay
    return timer(500).pipe(
      switchMap(() => {
        // Mock: Some INS are already taken
        const takenINS = ['1950634081234567'];
        const ins = control.value.toString().replace(/\s+/g, '');

        if (takenINS.includes(ins)) {
          return of({ insAlreadyExists: { value: control.value } });
        }

        return of(null);
      })
    );
  };
}

/**
 * Validator: At least one allergy must have severity
 */
export function allergyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !Array.isArray(control.value)) {
      return null;
    }

    const allergies = control.value;

    // At least one allergy with filled substance
    const hasValidAllergy = allergies.some(
      (allergy) => allergy && allergy.substance && allergy.substance.trim()
    );

    if (allergies.length > 0 && !hasValidAllergy) {
      return { noValidAllergies: true };
    }

    return null;
  };
}

/**
 * Validator: Vital Signs Within Normal Range
 */
export function vitalSignValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === null || control.value === undefined || control.value === '') {
      return null;
    }

    const value = Number(control.value);

    if (isNaN(value)) {
      return { notANumber: true };
    }

    if (value < min || value > max) {
      return {
        outOfRange: {
          value: control.value,
          min,
          max
        }
      };
    }

    return null;
  };
}
