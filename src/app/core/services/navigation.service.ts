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
    ).subscribe((event: NavigationEnd) => this.updateHistory(event.urlAfterRedirects));
  }

  /** 
   * Computed signal providing the second-to-last URL in history.
   * Returns '/' as a fallback if history is insufficient.
   */
  readonly previousUrl = computed(() => {
    const h = this.history();
    return h.length > 1 ? h[h.length - 2] : '/';
  });

  /**
   * Updates the history signal and triggers persistence.
   * @param url The current successful navigation target URL.
   */
  private updateHistory(url: string): void {
    this.history.update(h => {
      if (h.length > 0 && h[h.length - 1] === url) return h;
      
      const updatedHistory = [...h, url].slice(-10);
      this.saveHistory(updatedHistory);
      return updatedHistory;
    });
  }

  /**
   * Retrieves stored navigation history from browser LocalStorage.
   * @returns An array of URLs or an empty array on error/absence.
   */
  private loadHistory(): string[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Persists the current history list to LocalStorage.
   * @param history The list of URLs to save.
   */
  private saveHistory(history: string[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }
}