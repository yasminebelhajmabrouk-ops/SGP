import { Directive, ElementRef, Input, OnInit } from '@angular/core';

/**
 * Directive appHighlight
 * Highlight important medical information
 * Usage: <p appHighlight [highlightColor]="'yellow'">Important info</p>
 */
@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective implements OnInit {
  @Input() highlightColor: 'yellow' | 'orange' | 'red' | 'green' = 'yellow';
  @Input() textBold: boolean = false;

  private colorMap: { [key: string]: { bg: string; text: string } } = {
    yellow: {
      bg: 'rgba(214, 137, 16, 0.15)',
      text: '#B8860B'
    },
    orange: {
      bg: 'rgba(214, 137, 16, 0.2)',
      text: '#D68910'
    },
    red: {
      bg: 'rgba(183, 68, 68, 0.15)',
      text: '#B74444'
    },
    green: {
      bg: 'rgba(17, 122, 101, 0.15)',
      text: '#117A65'
    }
  };

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const colors = this.colorMap[this.highlightColor];
    const element = this.el.nativeElement;

    element.style.backgroundColor = colors.bg;
    element.style.color = colors.text;
    element.style.padding = '4px 8px';
    element.style.borderRadius = '3px';
    element.style.fontWeight = this.textBold ? 'bold' : 'normal';
    element.style.transition = 'all 0.2s ease';

    // Add hover effect
    element.addEventListener('mouseenter', () => {
      element.style.backgroundColor = colors.bg.replace('0.15', '0.25').replace('0.2', '0.3');
      element.style.transform = 'scale(1.02)';
    });

    element.addEventListener('mouseleave', () => {
      element.style.backgroundColor = colors.bg;
      element.style.transform = 'scale(1)';
    });
  }
}
