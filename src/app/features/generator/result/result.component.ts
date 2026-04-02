import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { RecipeCardComponent } from '../../../shared/ui/recipe-card/recipe-card.component';
import { TagComponent } from '../../../shared/ui/tag/tag.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, Observable } from 'rxjs';
import { RecipeGeneratorService } from '../../../core/services/recipe-generator.service';
import { Recipe } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [NgOptimizedImage, RecipeCardComponent, TagComponent, ButtonComponent],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultComponent {
  private router = inject(Router);
  private recipeService = inject(RecipeService);
  private generatorService = inject(RecipeGeneratorService);

  /** Derived signal providing the cuisine name from user preferences. */
  readonly activeCuisine = computed(() => this.generatorService.preferences().cuisine);

  /** Derived signal providing the cooking time category from user preferences. */
  readonly activeTime = computed(() => this.generatorService.preferences().cookingTime);

  /** 
   * Internal observable stream that reacts to changes in generated result IDs 
   * and triggers a database fetch for the corresponding recipe objects.
   */
  private readonly recipes$ = toObservable(this.generatorService.resultIds).pipe(
    switchMap((ids: string[]): Observable<Recipe[]> => 
      this.recipeService.getRecipesByIds(ids)
    )
  );

  /** Signal containing the list of fetched Recipe objects, initialized as an empty array. */
  readonly recipes = toSignal(this.recipes$, { initialValue: [] as Recipe[] });

  /**
   * Navigates to the detailed view of a specific recipe.
   * @param id The unique identifier of the recipe.
   */
  onViewRecipe(id: string): void {
    this.router.navigate(['/recipe', id]);
  }

  /**
   * Resets the generator state and redirects the user back to the ingredient input.
   */
  generateNew(): void {
    this.generatorService.reset();
    this.router.navigate(['/generate-input-user']);
  }
}