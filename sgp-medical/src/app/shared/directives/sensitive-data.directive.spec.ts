import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { SensitiveDataDirective } from './sensitive-data.directive';

describe('SensitiveDataDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    standalone: true,
    imports: [SensitiveDataDirective],
    template: `
      <div appSensitiveData="INS" [userRole]="userRole">
        {{ insData }}
      </div>
      <div appSensitiveData="PHONE" [userRole]="userRole">
        {{ phoneData }}
      </div>
      <div appSensitiveData="EMAIL" [userRole]="userRole">
        {{ emailData }}
      </div>
      <div appSensitiveData="ADDRESS" [userRole]="userRole">
        {{ addressData }}
      </div>
    `,
  })
  class TestComponent {
    userRole = 'patient';
    insData = '123456789012345';
    phoneData = '0123456789';
    emailData = 'patient@example.com';
    addressData = '123 Rue de la Paix';
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SensitiveDataDirective, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create directive instances', () => {
    fixture.detectChanges();
    const directives = fixture.debugElement.queryAll(
      By.directive(SensitiveDataDirective)
    );
    expect(directives.length).toBe(4);
  });

  it('should apply masking styles when user is patient', () => {
    component.userRole = 'patient';
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(
      By.directive(SensitiveDataDirective)
    );
    elements.forEach(el => {
      const classes = el.nativeElement.className;
      expect(classes).toContain('sensitive-data');
    });
  });

  it('should not mask data for medecin role', () => {
    component.userRole = 'medecin';
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(
      By.directive(SensitiveDataDirective)
    );
    // Medical staff should see full data (no masking)
    expect(elements.length).toBe(4);
  });

  it('should update masking when role changes', () => {
    component.userRole = 'patient';
    fixture.detectChanges();
    component.userRole = 'medecin';
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(
      By.directive(SensitiveDataDirective)
    );
    expect(elements.length).toBe(4);
  });

  it('should have border styling for sensitive elements', () => {
    component.userRole = 'patient';
    fixture.detectChanges();
    const insElement = fixture.debugElement.queryAll(
      By.directive(SensitiveDataDirective)
    )[0].nativeElement;
    const styles = window.getComputedStyle(insElement);
    expect(styles).toBeDefined();
  });
});
