import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'insFormat',
  standalone: true
})
export class InsFormatPipe implements PipeTransform {
  transform(ins: string | undefined, maskForNonAdmin: boolean = false): string {
    if (!ins) {
      return '';
    }

    // Format INS: XXX XXX XXXXX XXXXX XX
    // Si maskForNonAdmin, afficher seulement les 4 derniers chiffres
    if (maskForNonAdmin) {
      const lastFour = ins.slice(-4);
      return '*** *** ***** **' + lastFour.slice(0, 2) + ' ' + lastFour.slice(2);
    }

    // Format complet
    if (ins.length >= 13) {
      return (
        ins.slice(0, 3) +
        ' ' +
        ins.slice(3, 6) +
        ' ' +
        ins.slice(6, 11) +
        ' ' +
        ins.slice(11, 16) +
        (ins.length > 16 ? ' ' + ins.slice(16, 18) : '')
      );
    }

    return ins;
  }
}
