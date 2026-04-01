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
  
  /** Signal containing raw cuisine data from the database. */
  private readonly cuisinesRaw = toSignal(this.recipeService.getCuisines(), { initialValue: [] });
  
  /** Signal containing the top 3 most liked recipes. */
  private readonly featuredRecipesRaw = toSignal(this.recipeService.getFeaturedRecipes(), {
    initialValue: [] as Recipe[]
  });

  /** 
   * Captures which of the featured recipes were already liked at component initialization. 
   * Used to calculate the live delta for like counts.
   */
  private readonly likedAtLoad = computed(() => {
    const recipes = this.featuredRecipesRaw();
    const currentLikes = untracked(() => this.recipeService.likedIds());
    return new Set(recipes.filter(r => currentLikes.includes(r.id)).map(r => r.id));
  });
  
  /** 
   * Computes a list of featured recipes with live reactive like status and counters.
   * @returns Array of recipes with additional display metadata.
   */
  readonly featuredRecipes = computed(() => 
    this.featuredRecipesRaw().map(recipe => this.mapToFeaturedDisplay(recipe))
  );

  /** 
   * Computes cuisine categories and maps corresponding local image paths.
   * @returns Array of cuisines with visual metadata.
   */
  readonly cuisines = computed(() => 
    this.cuisinesRaw().map(c => ({ ...c, image: `assets/img/cookbook/${c.slug}.png` }))
  );

  /**
   * Redirects the user to the detail view of a specific recipe.
   * @param id Unique identifier of the recipe.
   */
  navigateToRecipe(id: string): void {
    this.router.navigate(['/recipe', id]);
  }

  /**
   * Delegates the like-toggle operation to the RecipeService.
   * @param id Unique identifier of the recipe to toggle.
   */
  onToggleLike(id: string): void {
    this.recipeService.toggleLike(id);
  }

  /**
   * Maps a raw recipe to a display model by calculating the current reactive like count.
   * @param recipe The original recipe data.
   */
  private mapToFeaturedDisplay(recipe: Recipe) {
    const isNowLiked = this.recipeService.isLiked(recipe.id);
    const wasLikedAtLoad = this.likedAtLoad().has(recipe.id);

    return {
      ...recipe,
      isLiked: isNowLiked,
      displayLikes: this.calculateLiveLikes(recipe.likes, isNowLiked, wasLikedAtLoad)
    };
  }

  /**
   * Logic to determine the live count display without an extra DB fetch.
   * @param base The like count stored in the database.
   * @param active Current state of the user's like.
   * @param initial State of the user's like at load time.
   */
  private calculateLiveLikes(base: number, active: boolean, initial: boolean): number {
    if (active && !initial) return base + 1;
    if (!active && initial) return base - 1;
    return base;
  }
}