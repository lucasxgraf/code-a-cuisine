import { Injectable, signal } from '@angular/core';
import { Ingredient } from '../models/ingredient.model';

export interface RecipePreferences {
  portions: number;
  people: number;
  cookingTime: string;
  cuisine: string;
  diet: string;
}

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

  reset() {
    this.ingredients.set([]);
  }
}