import { Injectable, inject, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private router = inject(Router);

  private history = signal<string[]>([]);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.history.update(h => [...h, url]);
    });
  }

  readonly previousUrl = computed(() => {
    const h = this.history();
    return h.length > 1 ? h[h.length - 2] : '/home';
  });
}