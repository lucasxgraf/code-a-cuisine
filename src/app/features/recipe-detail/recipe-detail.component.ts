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
  standalone: true,
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
  private route = inject(ActivatedRoute);
  protected recipeService = inject(RecipeService);
  protected generatorService = inject(RecipeGeneratorService);
  
  protected initiallyLikedAtLoad = signal<boolean>(false);

  private recipeId$ = this.route.params.pipe(
    map(params => params['id'] as string),
    filter(id => !!id)
  );

  private rawRecipe$ = this.recipeId$.pipe(
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

    const selectedPortions = this.generatorService.preferences().portions;
    const basePortions = data.base_portions || 2;
    const factor = selectedPortions / basePortions;

    const scale = (amount: number | string): string => {
      const num = typeof amount === 'string' ? parseFloat(amount) : amount;
      return !isNaN(num) && num > 0 ? (num * factor).toFixed(0) : amount.toString();
    };

    return {
      id: data.id,
      title: data.title,
      time: data.cooking_time + 'min',
      likes: data.likes,
      baseChefs: data.base_chefs,
      tags: data.diet_type ? [data.diet_type, 'Quick'] : ['Quick'],
      nutrition: {
        kcal: data.kcal,
        protein: data.protein,
        fat: data.fat,
        carbs: data.carbs
      },
      userIngredients: data.ingredients?.filter(i => !i.is_extra).map(ing => ({
        ...ing,
        scaledAmount: scale(ing.amount)
      })) || [],
      extraIngredients: data.ingredients?.filter(i => i.is_extra).map(ing => ({
        ...ing,
        scaledAmount: scale(ing.amount)
      })) || [],
      steps: data.recipe_steps?.sort((a, b) => a.step_number - b.step_number).map(step => ({
        ...step,
        chefId: step.chef_id as 1 | 2 | 3 | 4
      })) || []
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