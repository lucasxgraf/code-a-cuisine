import { ChangeDetectionStrategy, Component, computed, inject, signal, untracked } from '@angular/core';
import { MostLikedCardComponent } from "../../shared/ui/most-liked-card/most-liked-card.component";
import { CuisineCardComponent } from "../../shared/ui/cuisine-card/cuisine-card.component";
import { ButtonComponent } from "../../shared/ui/button/button.component";
import { Router, RouterLink } from "@angular/router";
import { RecipeService } from '../../core/services/recipe.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Recipe } from '../../core/models/recipe.model';

@Component({
  selector: 'app-cookbook',
  standalone: true,
  imports: [MostLikedCardComponent, CuisineCardComponent, ButtonComponent, RouterLink],
  templateUrl: './cookbook.component.html',
  styleUrl: './cookbook.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookbookComponent {
  protected recipeService = inject(RecipeService);
  private router = inject(Router);
  
  private cuisinesRaw = toSignal(this.recipeService.getCuisines(), { initialValue: [] });
  private featuredRecipesRaw = toSignal(this.recipeService.getFeaturedRecipes(), {
    initialValue: [] as Recipe[]
  });

  private likedAtLoad = computed(() => {
    const recipes = this.featuredRecipesRaw();
    const currentLikes = untracked(() => this.recipeService.likedIds());
    return new Set(recipes.filter(r => currentLikes.includes(r.id)).map(r => r.id));
  });
  
  readonly featuredRecipes = computed(() => {
    const raw = this.featuredRecipesRaw();
    const currentLikedIds = this.recipeService.likedIds();
    const initialLiked = this.likedAtLoad();

    return raw.map(recipe => {
      const isNowLiked = currentLikedIds.includes(recipe.id);
      const wasLikedAtLoad = initialLiked.has(recipe.id);

      let displayLikes = recipe.likes;
      if (isNowLiked && !wasLikedAtLoad) displayLikes += 1;
      if (!isNowLiked && wasLikedAtLoad) displayLikes -= 1;

      return {
        ...recipe,
        isLiked: isNowLiked,
        displayLikes: displayLikes
      };
    });
  });

  readonly cuisines = computed(() => {
    return this.cuisinesRaw().map(c => ({
      ...c,
      image: `assets/img/cookbook/${c.slug}.png`
    }));
  });

  navigateToRecipe(id: string): void {
    this.router.navigate(['/recipe', id]);
  }

  onToggleLike(id: string): void {
    this.recipeService.toggleLike(id);
  }
}