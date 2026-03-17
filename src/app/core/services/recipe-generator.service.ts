import { Injectable, signal } from '@angular/core';
import { Ingredient, RecipePreferences } from '../models/recepie.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeGeneratorService {
  ingredients = signal<Ingredient[]>([]);

  preferences = signal<RecipePreferences>({
    portions: 2,
    people: 1,
    cookingTime: 'Quick',
    cuisine: 'Italian',
    diet: 'No preferences'
  });

  changeCount(key: 'portions' | 'people', delta: number) {
    this.preferences.update(p => {
      const min = 1;
      const max = key === 'portions' ? 12 : 3;

      const newVal = Math.min(max, Math.max(min, p[key] + delta));
      return { ...p, [key]: newVal };
    });
  }

  reset() {
    this.ingredients.set([]);
  }
}