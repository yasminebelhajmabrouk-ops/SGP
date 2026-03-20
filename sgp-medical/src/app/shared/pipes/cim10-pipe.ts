import { Pipe, PipeTransform } from '@angular/core';

interface CIM10Code {
  code: string;
  libelle: string;
  description?: string;
}

@Pipe({
  name: 'cim10',
  standalone: true
})
export class Cim10Pipe implements PipeTransform {
  private cim10Codes: Record<string, CIM10Code> = {
    'E11': { code: 'E11', libelle: 'Diabète sucré non insulino-dépendant' },
    'I10': { code: 'I10', libelle: 'Hypertension essentielle (primitive)' },
    'E78.5': { code: 'E78.5', libelle: 'Hyperlipidémie, non précisée' },
    'J44.9': { code: 'J44.9', libelle: 'Maladie pulmonaire obstructive chronique, non précisée' },
    'F32.9': { code: 'F32.9', libelle: 'Trouble dépressif caractérisé, non précisé' },
    'M79.3': { code: 'M79.3', libelle: 'Panniculite, non précisée' },
    'I50': { code: 'I50', libelle: 'Insuffisance cardiaque' },
    'B99': { code: 'B99', libelle: 'Maladie infectieuse, non précisée' },
    'J06.9': { code: 'J06.9', libelle: 'Infection aiguë des voies respiratoires supérieures, non précisée' },
  };

  transform(code: string | undefined, displayFull: boolean = true): string {
    if (!code) {
      return '';
    }

    const cimData = this.cim10Codes[code];
    
    if (!cimData) {
      return code; // Retourner le code tel quel s'il n'est pas reconnu
    }

    if (displayFull) {
      return `${cimData.code} - ${cimData.libelle}`;
    }

    return cimData.libelle;
  }
}
