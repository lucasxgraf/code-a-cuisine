import { effect, inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, map, Observable } from 'rxjs';
import { Cuisine, Recipe, RecipeWithCuisine, FullRecipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private supabase = inject(SupabaseService).client;

  likedIds = signal<string[]>(JSON.parse(localStorage.getItem('likedRecipes') || '[]'));

  constructor() {
    effect(() => {
      localStorage.setItem('likedRecipes', JSON.stringify(this.likedIds()));
    });
  }

  isLiked(id: string): boolean {
    return this.likedIds().includes(id);
  }

  toggleLike(id: string): number {
    const currentlyLiked = this.isLiked(id);
    const delta = currentlyLiked ? -1 : 1;

    this.likedIds.update(ids => 
      currentlyLiked ? ids.filter(i => i !== id) : [...ids, id]
    );

    from(this.supabase.rpc('handle_recipe_like', { 
      recipe_id: id, 
      increment_val: delta 
    })).subscribe();

    return delta;
  }

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