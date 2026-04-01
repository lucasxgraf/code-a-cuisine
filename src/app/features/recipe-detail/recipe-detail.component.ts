import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, filter } from 'rxjs/operators';

import { RecipeService } from '../../core/services/recipe.service';
import { RecipeGeneratorService } from '../../core/services/recipe-generator.service';
import { FullRecipe, Ingredient } from '../../core/models/recipe.model';

import { TagComponent } from "../../shared/ui/tag/tag.component";
import { ChefsLabelComponent } from "../../shared/ui/chefs-label/chefs-label.component";
import { IngredientListItemComponent } from "../../shared/ui/ingredient-list-item/ingredient-list-item.component";
import { HeartButtonComponent } from "../../shared/ui/heart-button/heart-button.component";
import { ButtonComponent } from "../../shared/ui/button/button.component";

@Component({
  selector: 'app-recipe-detail',
  imports: [
    TagComponent,
    ChefsLabelComponent,
    IngredientListItemComponent,
    HeartButtonComponent,
    RouterLink,
    ButtonComponent
  ],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  protected readonly recipeService = inject(RecipeService);
  protected readonly generatorService = inject(RecipeGeneratorService);
  
  protected initiallyLikedAtLoad = signal<boolean>(false);

  /** Observable stream extracting the recipe ID from route parameters. */
  private readonly recipeId$ = this.route.params.pipe(
    map(params => params['id'] as string),
    filter(id => !!id)
  );

  /** Fetches raw recipe data and tracks the initial like status. */
  private readonly rawRecipe$ = this.recipeId$.pipe(
    switchMap(id => {
      this.initiallyLikedAtLoad.set(this.checkIfLikedInitially(id));
      return this.recipeService.getRecipeById(id);
    })
  );

  /** Signal holding the raw database response for the recipe. */
  protected readonly rawRecipe = toSignal(this.rawRecipe$, { initialValue: null as FullRecipe | null });

  /** 
   * Main transformation signal that prepares the recipe data for the template.
   */
  protected readonly recipe = computed(() => {
    const data = this.rawRecipe();
    if (!data) return null;

    const factor = this.calculateScalingFactor(data.base_portions);
    const scaledAll = this.processIngredients(data.ingredients || [], factor);
    const isFromGenerator = this.generatorService.ingredients().length > 0;

    return this.assembleRecipeObject(data, scaledAll, isFromGenerator);
  });

  /** Computes the current like count including optimistic local updates. */
  protected readonly displayLikes = computed(() => {
    const data = this.rawRecipe();
    if (!data) return 0;
    return this.calculateLiveLikes(data.likes, this.recipeService.isLiked(data.id), this.initiallyLikedAtLoad());
  });

  /** Toggles the like status via the shared recipe service. */
  toggleLike(): void {
    const id = this.rawRecipe()?.id;
    if (id) this.recipeService.toggleLike(id);
  }

  /**
   * Calculates the multiplier for ingredient quantities based on user selection.
   * @param basePortions The original servings count the recipe was created for.
   */
  private calculateScalingFactor(basePortions: number): number {
    return this.generatorService.preferences().portions / (basePortions || 2);
  }

  /**
   * Applies the scaling factor to a list of ingredients.
   * @param ingredients Array of original ingredients.
   * @param factor The scaling multiplier.
   * @returns Array of ingredients enriched with scaledAmount.
   */
  private processIngredients(ingredients: Ingredient[], factor: number): Ingredient[] {
    return ingredients.map(ing => ({
      ...ing,
      scaledAmount: this.scaleQuantity(ing.amount, factor)
    }));
  }

  /**
   * Converts an amount into a scaled string representation.
   * @param amount The original amount (number or string).
   * @param factor The scaling multiplier.
   */
  private scaleQuantity(amount: number | string, factor: number): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return !isNaN(num) && num > 0 ? (num * factor).toFixed(0) : amount.toString();
  }

  /**
   * Constructs the final recipe view model with sorted steps and grouped ingredients.
   * @param data Original full recipe data.
   * @param scaledAll Ingredients with updated quantities.
   * @param isFromGenerator Flag to determine UI layout.
   */
  private assembleRecipeObject(data: FullRecipe, scaledAll: Ingredient[], isFromGenerator: boolean) {
    const userNames = new Set(this.generatorService.ingredients().map(i => i.name.toLowerCase()));
    return {
      ...data,
      isFromGenerator,
      timeLabel: `${data.cooking_time} min`,
      chefsArray: Array.from({ length: data.base_chefs }, (_, i) => i + 1),
      tags: [data.diet_type, data.cooking_time <= 25 ? 'Quick' : 'Medium'].filter(Boolean),
      sortedSteps: [...(data.recipe_steps || [])].sort((a, b) => a.step_number - b.step_number),
      userIngredients: isFromGenerator ? scaledAll.filter(i => userNames.has(i.name.toLowerCase())) : [],
      extraIngredients: isFromGenerator ? scaledAll.filter(i => !userNames.has(i.name.toLowerCase())) : [],
      displayIngredients: scaledAll
    };
  }

  /**
   * Determines the live display count for likes without re-fetching from the database.
   * @param base Database like count.
   * @param active Current reactive like status.
   * @param initial Status at component load time.
   */
  private calculateLiveLikes(base: number, active: boolean, initial: boolean): number {
    if (active && !initial) return base + 1;
    if (!active && initial) return base - 1;
    return base;
  }

  /**
   * Checks browser storage to see if the user previously liked this recipe.
   * @param id The recipe identifier.
   */
  private checkIfLikedInitially(id: string): boolean {
    const stored = localStorage.getItem('likedRecipes');
    return stored ? (JSON.parse(stored) as string[]).includes(id) : false;
  }
}