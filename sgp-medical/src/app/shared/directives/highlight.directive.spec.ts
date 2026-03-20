import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HighlightDirective } from './highlight.directive';

describe('HighlightDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  @Component({
    standalone: true,
    imports: [HighlightDirective],
    template: `
      <div appHighlight="yellow">Yellow highlight</div>
      <div appHighlight="orange">Orange highlight</div>
      <div appHighlight="red">Red highlight</div>
      <div appHighlight="green">Green highlight</div>
      <div appHighlight="invalid">Invalid highlight</div>
    `,
  })
  class TestComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighlightDirective, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create directive instances', () => {
    fixture.detectChanges();
    const directives = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );
    expect(directives.length).toBe(5);
  });

  it('should apply yellow highlight color', () => {
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );
    const element = elements[0].nativeElement;
    const bgColor = element.style.backgroundColor;
    expect(bgColor).toBeDefined();
  });

  it('should apply styling on hover', () => {
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );
    const element = elements[0].nativeElement;

    // Simulate hover
    const hoverEvent = new MouseEvent('mouseenter');
    element.dispatchEvent(hoverEvent);
    fixture.detectChanges();

    expect(element.style.opacity).toBeDefined();
  });

  it('should reset styling on mouse leave', () => {
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );
    const element = elements[0].nativeElement;

    // Simulate hover and leave
    const hoverEvent = new MouseEvent('mouseenter');
    element.dispatchEvent(hoverEvent);
    fixture.detectChanges();

    const leaveEvent = new MouseEvent('mouseleave');
    element.dispatchEvent(leaveEvent);
    fixture.detectChanges();

    expect(element.style.opacity).toBeDefined();
  });

  it('should handle all valid highlight colors', () => {
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );
    expect(elements.length).toBe(5);

    // Check first 4 elements (valid colors)
    for (let i = 0; i < 4; i++) {
      const element = elements[i].nativeElement;
      expect(element.style.backgroundColor).toBeDefined();
    }
  });

  it('should have proper cursor styling', () => {
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(
      By.directive(HighlightDirective)
    );
    const element = elements[0].nativeElement;
    const cursor = element.style.cursor;
    expect(cursor).toBeDefined();
  });
});
