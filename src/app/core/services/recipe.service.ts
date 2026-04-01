import { effect, inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, map, Observable, of } from 'rxjs';
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

  /**
   * Checks if a recipe is currently liked by the user.
   * @param id The UUID of the recipe to check.
   * @returns boolean indicating like status.
   */
  isLiked(id: string): boolean {
    return this.likedIds().includes(id);
  }

  /**
   * Toggles the like status of a recipe and synchronizes with the database.
   * @param id The UUID of the recipe.
   * @returns The change value (1 if liked, -1 if unliked).
   */

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

  /**
   * Fetches all available cuisines from the database, sorted by name.
   * @returns Observable of Cuisine array.
   */
  getCuisines(): Observable<Cuisine[]> {
    return from(
      this.supabase.from('cuisines')
        .select('*')
        .order('name')
    ).pipe(map(res => (res.data as Cuisine[]) || []));
  }

  /**
   * Retrieves the top 3 recipes based on the number of likes.
   * @returns Observable of Recipe array.
   */
  getFeaturedRecipes(): Observable<Recipe[]> {
    return from(
      this.supabase
        .from('recipes')
        .select('*')
        .order('likes', { ascending: false })
        .limit(3)
    ).pipe(map(res => (res.data as Recipe[]) || []));
  }

  /**
   * Fetches all recipes associated with a specific cuisine slug.
   * @param slug The unique URL-friendly string of the cuisine.
   * @returns Observable of RecipeWithCuisine array.
   */
  getRecipesByCuisine(slug: string): Observable<RecipeWithCuisine[]> {
    return from(
      this.supabase
        .from('recipes')
        .select('*, cuisines!inner(slug)')
        .eq('cuisines.slug', slug)
    ).pipe(map(res => (res.data as RecipeWithCuisine[]) || []));
  }

  /**
   * Retrieves a single recipe including its ingredients and cooking steps.
   * @param id The UUID of the recipe.
   * @returns Observable of FullRecipe or null if not found.
   */
  getRecipeById(id: string): Observable<FullRecipe | null> {
    return from(
      this.supabase
        .from('recipes')
        .select('*, ingredients(*), recipe_steps(*)')
        .eq('id', id)
        .single()
    ).pipe(map(res => (res.data as FullRecipe) || null));
  }

  /**
   * Fetches a set of recipes by their IDs and maintains the provided order.
   * @param ids Array of recipe UUIDs.
   * @returns Observable of Recipe array.
   */
  getRecipesByIds(ids: string[]): Observable<Recipe[]> {
    if (!ids.length) return of([] as Recipe[]);

    return from(
      this.supabase
        .from('recipes')
        .select('*')
        .in('id', ids)
    ).pipe(
      map(res => {
        if (res.error) throw res.error;
        const data = res.data as Recipe[] || [];
        return data.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
      })
    );
  }

  /**
   * Low-level database call to update the like counter of a recipe.
   * @param id The recipe UUID.
   * @param delta The increment/decrement value.
   * @returns Observable of the operation result.
   */
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