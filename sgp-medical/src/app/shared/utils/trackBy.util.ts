/**
 * Utilitaires de performance pour Angular
 * Fournit des fonctions trackBy pour les listes et gestion de la détection de changement
 */

/**
 * TrackBy simple par ID
 * @example *ngFor="let item of items; trackBy: trackById"
 */
export function trackByIndex(index: number): number {
  return index;
}

/**
 * TrackBy par ID
 * @example *ngFor="let item of items; trackBy: trackById"
 */
export function trackById<T extends { id: any }>(
  index: number,
  item: T
): any {
  return item.id;
}

/**
 * TrackBy par propriété personnalisée
 * @example *ngFor="let item of items; trackBy: trackByProperty('ins')"
 */
export function trackByProperty<T>(property: keyof T) {
  return (index: number, item: T): any => {
    return item[property];
  };
}

/**
 * TrackBy par multiple propriétés
 * @example *ngFor="let item of items; trackBy: trackByProperties('id', 'email')"
 */
export function trackByProperties<T>(...properties: (keyof T)[]) {
  return (index: number, item: T): string => {
    return properties.map(prop => item[prop]).join('-');
  };
}

/**
 * TrackBy par fonction personnalisée
 * @example *ngFor="let item of items; trackBy: trackByFn(item => item.id + item.nom)"
 */
export function trackByFn<T>(fn: (item: T) => any) {
  return (index: number, item: T): any => {
    return fn(item);
  };
}

/**
 * TrackBy safe - évite les erreurs null/undefined
 * @example *ngFor="let item of items; trackBy: trackBySafe('id')"
 */
export function trackBySafe<T>(property: keyof T) {
  return (index: number, item: T): any => {
    const value = item?.[property];
    return value !== null && value !== undefined ? value : index;
  };
}
