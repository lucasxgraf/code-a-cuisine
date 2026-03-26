import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, filter } from 'rxjs/operators';

import { RecipeService } from '../../core/services/recipe.service';
import { RecipeGeneratorService } from '../../core/services/recipe-generator.service';
import { FullRecipe } from '../../core/models/recipe.model';

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

  private readonly recipeId$ = this.route.params.pipe(
    map(params => params['id'] as string),
    filter(id => !!id)
  );

  private readonly rawRecipe$ = this.recipeId$.pipe(
    switchMap(id => {
      const liked = this.checkIfLikedInitially(id);
      this.initiallyLikedAtLoad.set(liked);
      return this.recipeService.getRecipeById(id);
    })
  );

  protected rawRecipe = toSignal(this.rawRecipe$, { initialValue: null as FullRecipe | null });

  protected recipe = computed(() => {
    const data = this.rawRecipe();
    if (!data) return null;

    const userInputIngredients = this.generatorService.ingredients();
    const isFromGenerator = userInputIngredients.length > 0;

    const selectedPortions = this.generatorService.preferences().portions;
    const factor = selectedPortions / (data.base_portions || 2);

    const scale = (amount: number | string): string => {
      const num = typeof amount === 'string' ? parseFloat(amount) : amount;
      return !isNaN(num) && num > 0 ? (num * factor).toFixed(0) : amount.toString();
    };

    const allIngredients = data.ingredients || [];
    const scaledAll = allIngredients.map(ing => ({ ...ing, scaledAmount: scale(ing.amount) }));

    const userIngredientNames = new Set(userInputIngredients.map(i => i.name.toLowerCase()));
    
    const userIngredients = isFromGenerator 
      ? scaledAll.filter(i => userIngredientNames.has(i.name.toLowerCase())) 
      : [];
      
    const extraIngredients = isFromGenerator 
      ? scaledAll.filter(i => !userIngredientNames.has(i.name.toLowerCase())) 
      : [];

    return {
      ...data,
      isFromGenerator,
      timeLabel: `${data.cooking_time} min`,
      chefsArray: Array.from({ length: data.base_chefs }, (_, i) => i + 1),
      tags: [data.diet_type, data.cooking_time <= 25 ? 'Quick' : 'Medium'].filter(Boolean),
      sortedSteps: [...(data.recipe_steps || [])].sort((a, b) => a.step_number - b.step_number),
      userIngredients,
      extraIngredients,
      displayIngredients: scaledAll
    };
  });

  protected displayLikes = computed(() => {
    const data = this.rawRecipe();
    if (!data) return 0;
    
    const isNowLiked = this.recipeService.isLiked(data.id);
    const wasLikedAtLoad = this.initiallyLikedAtLoad();

    if (isNowLiked && !wasLikedAtLoad) return data.likes + 1;
    if (!isNowLiked && wasLikedAtLoad) return data.likes - 1;
    return data.likes;
  });

  private checkIfLikedInitially(id: string): boolean {
    const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]');
    return likedRecipes.includes(id);
  }

  toggleLike(): void {
    const id = this.rawRecipe()?.id;
    if (id) this.recipeService.toggleLike(id);
  }
}