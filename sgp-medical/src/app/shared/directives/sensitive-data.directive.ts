import { Directive, ElementRef, Input, OnInit } from '@angular/core';

/**
 * Directive appSensitiveData
 * Mask sensitive medical data based on user permissions
 * Usage: <span appSensitiveData="INS" [canView]="isAdmin">{{ patient.ins }}</span>
 */
@Directive({
  selector: '[appSensitiveData]',
  standalone: true
})
export class SensitiveDataDirective implements OnInit {
  @Input() appSensitiveData: string = 'DATA'; // Type of sensitive data
  @Input() canView: boolean = false; // Whether user can view the data

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const element = this.el.nativeElement;
    const originalContent = element.textContent?.trim() || '';

    if (!this.canView && originalContent) {
      // Mask the content
      const masked = this.maskContent(originalContent);
      element.textContent = masked;

      // Add visual indicator
      element.style.borderBottom = '2px dashed #D68910';
      element.style.cursor = 'not-allowed';
      element.style.backgroundColor = 'rgba(214, 137, 16, 0.05)';
      element.style.padding = '2px 6px';
      element.style.borderRadius = '2px';

      // Add title for hover tooltip
      element.setAttribute('title', `Donnée sensible ${this.appSensitiveData} - Accès non autorisé`);
    } else if (this.canView && originalContent) {
      // Show data but highlight as authorized
      element.style.borderBottom = '2px solid #117A65';
      element.style.backgroundColor = 'rgba(17, 122, 101, 0.05)';
      element.style.padding = '2px 6px';
      element.style.borderRadius = '2px';
      element.setAttribute('title', `${this.appSensitiveData} - Autorisé de voir`);
    }
  }

  private maskContent(content: string): string {
    // Remove spaces and special characters for counting
    const cleanContent = content.replace(/\s|\-/g, '');

    switch (this.appSensitiveData) {
      case 'INS':
        // INS format: XXX XXX XXXXX XXXXX XX
        // Show only last 4 digits
        if (cleanContent.length >= 4) {
          return '*** *** ***** **' + cleanContent.slice(-4);
        }
        return '*'.repeat(cleanContent.length);

      case 'PHONE':
        // Phone: Show only last 4 digits
        if (cleanContent.length >= 4) {
          return '*'.repeat(cleanContent.length - 4) + cleanContent.slice(-4);
        }
        return '*'.repeat(cleanContent.length);

      case 'EMAIL':
        // Email: Show first letter and domain
        const parts = content.split('@');
        if (parts.length === 2) {
          const name = parts[0];
          const domain = parts[1];
          return name.charAt(0) + '*'.repeat(name.length - 1) + '@' + domain;
        }
        return '***@***';

      case 'ADDRESS':
        // Address: Show only postcode and city
        return '*** *** ****';

      default:
        // Generic masking: show first and last character
        if (cleanContent.length > 2) {
          return cleanContent.charAt(0) + '*'.repeat(cleanContent.length - 2) + cleanContent.charAt(cleanContent.length - 1);
        }
        return '*'.repeat(cleanContent.length);
    }
  }
}
