import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { RecipeCardComponent } from '../../../shared/ui/recipe-card/recipe-card.component';
import { TagComponent } from '../../../shared/ui/tag/tag.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { RecipeService } from '../../../core/services/recipe.service';
import { toSignal } from '@angular/core/rxjs-interop';

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

  protected recipes = toSignal(this.recipeService.getFeaturedRecipes(), { initialValue: [] });

  onViewRecipe(id: string) {
    this.router.navigate(['/recipe', id]);
  }

  generateNew() {
    this.router.navigate(['/generate-input-user']);
  }
}
