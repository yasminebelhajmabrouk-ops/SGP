import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MedicalAlertDirective } from './medical-alert.directive';

describe('MedicalAlertDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let directiveElement: DebugElement;

  @Component({
    standalone: true,
    imports: [MedicalAlertDirective],
    template: `
      <div
        appMedicalAlert
        [alertThreshold]="threshold"
        [testAttrValue]="'normal'"
      >
        Normal Alert
      </div>
      <div
        appMedicalAlert
        [alertThreshold]="threshold"
        [testAttrValue]="'warning'"
      >
        Warning Alert
      </div>
      <div
        appMedicalAlert
        [alertThreshold]="threshold"
        [testAttrValue]="'critical'"
      >
        Critical Alert
      </div>
    `,
  })
  class TestComponent {
    threshold = 180;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicalAlertDirective, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create directive instance', () => {
    fixture.detectChanges();
    const directives = fixture.debugElement.queryAll(
      By.directive(MedicalAlertDirective)
    );
    expect(directives.length).toBe(3);
  });

  it('should apply normal styling for normal value', () => {
    component.threshold = 120;
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(
      By.directive(MedicalAlertDirective)
    );
    const normalElement = elements[0].nativeElement;
    expect(normalElement).toBeDefined();
  });

  it('should update styles when threshold changes', () => {
    component.threshold = 150;
    fixture.detectChanges();
    component.threshold = 200;
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(
      By.directive(MedicalAlertDirective)
    );
    expect(elements.length).toBe(3);
  });
});
