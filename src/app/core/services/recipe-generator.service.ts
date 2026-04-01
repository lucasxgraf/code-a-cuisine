import { effect, inject, Injectable, signal } from '@angular/core';
import { Ingredient, Recipe, RecipePreferences } from '../models/recipe.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeGeneratorService {
  private http = inject(HttpClient);
  
  isGenerating = signal(false);
  errorMessage = signal<string | null>(null);

  ingredients = signal<Ingredient[]>([]);
  preferences = signal<RecipePreferences>({
    portions: 2,
    people: 1,
    cookingTime: 'Quick',
    cuisine: 'Italian',
    diet: 'No preferences'
  });
  resultIds = signal<string[]>(JSON.parse(localStorage.getItem('last_generated_ids') || '[]'));

  constructor() {
    effect(() => {
      localStorage.setItem('last_generated_ids', JSON.stringify(this.resultIds()));
    });
  }

  /**
   * Adjusts numeric preference values (portions/people) within allowed bounds.
   * @param key The specific preference to update.
   * @param delta The value to add or subtract.
   */
  changeCount(key: 'portions' | 'people', delta: number) {
    this.preferences.update(p => {
      const min = 1;
      const max = key === 'portions' ? 12 : 3;

      const newVal = Math.min(max, Math.max(min, p[key] + delta));
      return { ...p, [key]: newVal };
    });
  }

  /** Resets the service state to its initial default values. */
  reset() {
    this.ingredients.set([]);
    this.resultIds.set([]);
    this.errorMessage.set(null);
    this.isGenerating.set(false);
  }

  /**
   * Triggers the AI generation process by sending inputs to the backend webhook.
   * @returns Observable containing the array of generated recipe IDs.
   */
  generateRecipes() {
    this.resultIds.set([]);
    this.isGenerating.set(true);
    const payload = { 
      ingredients: this.ingredients(), 
      preferences: this.preferences() 
    };
    
    const n8nUrl = 'http://localhost:5678/webhook/generate-recipes';

    return this.http.post<{ recipeIds: string[] }>(n8nUrl, payload);
  }
}