import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, map, Observable } from 'rxjs';
import { Cuisine, Recipe, RecipeWithCuisine, FullRecipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private supabase = inject(SupabaseService).client;

  getCuisines(): Observable<Cuisine[]> {
    return from(
      this.supabase.from('cuisines')
        .select('*')
        .order('name')
    ).pipe(map(res => (res.data as Cuisine[]) || []));
  }

  getFeaturedRecipes(): Observable<Recipe[]> {
    return from(
      this.supabase
        .from('recipes')
        .select('*')
        .order('likes', { ascending: false })
        .limit(3)
    ).pipe(map(res => (res.data as Recipe[]) || []));
  }

  getRecipesByCuisine(slug: string): Observable<RecipeWithCuisine[]> {
    return from(
      this.supabase
        .from('recipes')
        .select('*, cuisines!inner(slug)')
        .eq('cuisines.slug', slug)
    ).pipe(map(res => (res.data as RecipeWithCuisine[]) || []));
  }

  getRecipeById(id: string): Observable<FullRecipe | null> {
    return from(
      this.supabase
        .from('recipes')
        .select('*, ingredients(*), recipe_steps(*)')
        .eq('id', id)
        .single()
    ).pipe(map(res => (res.data as FullRecipe) || null));
  }

  toggleRecipeLike(id: string, delta: number) {
    return from(
      this.supabase.rpc('handle_recipe_like', { 
        recipe_id: id, 
        increment_val: delta 
      })
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        return res.data;
      })
    );
  }
}