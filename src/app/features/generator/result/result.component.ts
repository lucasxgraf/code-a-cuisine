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

  activeCuisine = computed(() => this.generatorService.preferences().cuisine);
  activeTime = computed(() => this.generatorService.preferences().cookingTime);

  private recipes$ = toObservable(this.generatorService.resultIds).pipe(
    switchMap((ids: string[]): Observable<Recipe[]> => 
      this.recipeService.getRecipesByIds(ids)
    )
  );

  recipes = toSignal(this.recipes$, { initialValue: [] as Recipe[] });

  onViewRecipe(id: string) {
    this.router.navigate(['/recipe', id]);
  }

  generateNew() {
    this.generatorService.reset();
    this.router.navigate(['/generate-input-user']);
  }
}
