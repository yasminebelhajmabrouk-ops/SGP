import { Directive, ElementRef, Input, OnInit } from '@angular/core';

/**
 * Directive appMedicalAlert
 * Highlight critical medical values that exceed normal thresholds
 * Usage: <div [appMedicalAlert]="value" [alertThreshold]="180"></div>
 */
@Directive({
  selector: '[appMedicalAlert]',
  standalone: true
})
export class MedicalAlertDirective implements OnInit {
  @Input() appMedicalAlert: number | null = null;
  @Input() alertThreshold: number = 100;
  @Input() warningThreshold: number | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    if (this.appMedicalAlert === null || this.appMedicalAlert === undefined) {
      return;
    }

    const value = this.appMedicalAlert;
    const element = this.el.nativeElement;

    // Reset classes
    element.classList.remove('medical-alert-danger', 'medical-alert-warning', 'medical-alert-normal');

    // Critical threshold exceeded - Red alert
    if (value >= this.alertThreshold) {
      element.classList.add('medical-alert-danger');
      element.style.backgroundColor = 'rgba(183, 68, 68, 0.1)';
      element.style.borderLeft = '4px solid #B74444';
      element.style.paddingLeft = '12px';
      this.addAlertIcon('danger');
    }
    // Warning threshold exceeded - Orange alert
    else if (this.warningThreshold && value >= this.warningThreshold) {
      element.classList.add('medical-alert-warning');
      element.style.backgroundColor = 'rgba(214, 137, 16, 0.1)';
      element.style.borderLeft = '4px solid #D68910';
      element.style.paddingLeft = '12px';
      this.addAlertIcon('warning');
    }
    // Normal - Green background
    else {
      element.classList.add('medical-alert-normal');
      element.style.backgroundColor = 'rgba(17, 122, 101, 0.05)';
      element.style.borderLeft = '4px solid #117A65';
      element.style.paddingLeft = '12px';
    }
  }

  private addAlertIcon(type: 'danger' | 'warning' | 'normal'): void {
    const icon = document.createElement('span');
    icon.style.marginRight = '8px';
    icon.style.fontWeight = 'bold';
    icon.style.fontSize = '16px';

    switch (type) {
      case 'danger':
        icon.textContent = '⚠';
        icon.style.color = '#B74444';
        break;
      case 'warning':
        icon.textContent = '!';
        icon.style.color = '#D68910';
        break;
      case 'normal':
        icon.textContent = '✓';
        icon.style.color = '#117A65';
        break;
    }

    const element = this.el.nativeElement;
    if (element.firstChild) {
      element.insertBefore(icon, element.firstChild);
    } else {
      element.appendChild(icon);
    }
  }
}
