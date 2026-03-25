import { Injectable, inject, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private router = inject(Router);
  private readonly STORAGE_KEY = 'app_navigation_history';

  private readonly history = signal<string[]>(
    this.loadHistory()
  );

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      
      this.history.update(h => {
        if (h.length > 0 && h[h.length - 1] === url) return h;
        
        const newHistory = [...h, url].slice(-10);
        this.saveHistory(newHistory);
        return newHistory;
      });
    });
  }

  readonly previousUrl = computed(() => {
    const h = this.history();
    return h.length > 1 ? h[h.length - 2] : '/';
  });

  private loadHistory(): string[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveHistory(history: string[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }
}