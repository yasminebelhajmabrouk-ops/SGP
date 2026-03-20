import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * LoadingService
 * Global loading state management
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private requestCount = 0;

  constructor() {}

  show(): void {
    this.requestCount++;
    this.updateLoadingState();
  }

  hide(): void {
    this.requestCount = Math.max(0, this.requestCount - 1);
    this.updateLoadingState();
  }

  reset(): void {
    this.requestCount = 0;
    this.loadingSubject.next(false);
  }

  isLoading(): boolean {
    return this.loadingSubject.value;
  }

  private updateLoadingState(): void {
    this.loadingSubject.next(this.requestCount > 0);
  }
}
