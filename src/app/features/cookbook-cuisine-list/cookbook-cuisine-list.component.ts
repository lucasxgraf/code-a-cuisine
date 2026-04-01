import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs';

import { RecipeService } from '../../core/services/recipe.service';
import { RecipeWithCuisine } from '../../core/models/recipe.model';
import { RecipeListRowComponent } from '../../shared/ui/recipe-list-row/recipe-list-row.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { TagComponent } from '../../shared/ui/tag/tag.component';

@Component({
  selector: 'app-cookbook-cuisine-list',
  standalone: true,
  imports: [RecipeListRowComponent, ButtonComponent, RouterLink, TagComponent],
  templateUrl: './cookbook-cuisine-list.component.html',
  styleUrl: './cookbook-cuisine-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CookbookCuisineListComponent {
  private route = inject(ActivatedRoute);
  protected recipeService = inject(RecipeService);

  protected readonly dietOptions = ['All', 'Vegetarian', 'Vegan', 'Keto'] as const;
  protected readonly timeOptions = ['All', 'Quick', 'Medium', 'Complex'] as const;

  protected readonly selectedDiet = signal<string>('All');
  protected readonly selectedTime = signal<string>('All');

  protected readonly pageSize = 10;
  protected readonly currentPage = signal<number>(0);

  /** Maps internal slug names to display-friendly cuisine titles. */
  private readonly cuisineNames: Record<string, string> = {
    'italian': 'Italian cuisine', 'german': 'German cuisine', 'indian': 'Indian cuisine',
    'japanese': 'Japanese cuisine', 'gourmet': 'Gourmet cuisine', 'fusion': 'Fusion cuisine'
  };

  constructor() {
    effect(() => {
      this.selectedDiet();
      this.selectedTime();
      untracked(() => this.currentPage.set(0));
    });
  }

  /** Signal containing the current cuisine slug from the route. */
  protected readonly cuisineId = toSignal(
    this.route.params.pipe(map(p => p['id'] as string)),
    { initialValue: '' }
  );

  /** Fetches recipes from Supabase based on the route parameter. */
  private readonly dbRecipes = toSignal(
    this.route.params.pipe(
      map(params => params['id'] as string),
      filter(id => !!id),
      switchMap(id => this.recipeService.getRecipesByCuisine(id))
    ),
    { initialValue: [] as RecipeWithCuisine[] }
  );

  /** Identifies recipes already liked at the time of component loading. */
  private readonly likedAtLoad = computed(() => {
    const currentLikes = untracked(() => this.recipeService.likedIds());
    return new Set(this.dbRecipes().filter(r => currentLikes.includes(r.id)).map(r => r.id));
  });

  /** Maps database recipes to a display model with live reactive like counts. */
  protected readonly displayRecipes = computed(() => 
    this.dbRecipes().map(r => this.mapToDisplayRecipe(r))
  );

  /** Derived signal calculating the human-readable title of the current cuisine. */
  protected readonly cuisineTitle = computed(() => 
    this.cuisineNames[this.cuisineId()] || 'Cuisine'
  );

  /** Filters the displayed recipes based on diet and cooking time selection. */
  protected readonly filteredRecipes = computed(() => {
    let list = this.displayRecipes();
    list = this.applyDietFilter(list, this.selectedDiet());
    return this.applyTimeFilter(list, this.selectedTime());
  });

  /** Computes the specific slice of recipes to be displayed on the current page. */
  protected readonly pagedRecipes = computed(() => {
    const start = this.currentPage() * this.pageSize;
    return this.filteredRecipes().slice(start, start + this.pageSize);
  });

  /** Total number of pages available for the current filtered result set. */
  protected readonly totalPages = computed(() => 
    Math.ceil(this.filteredRecipes().length / this.pageSize)
  );

  /** Array of page indices for rendering pagination buttons. */
  protected readonly pageNumbers = computed(() => 
    Array.from({ length: this.totalPages() }, (_, i) => i)
  );

  /** Toggles the like status of a recipe. */
  toggleLike(id: string): void { this.recipeService.toggleLike(id); }

  /** Updates the pagination state and scrolls to the top of the container. */
  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /** Sets the dietary restriction filter. */
  setDietFilter(value: string): void { this.selectedDiet.set(value); }

  /** Sets the cooking time complexity filter. */
  setTimeFilter(value: string): void { this.selectedTime.set(value); }

  /**
   * Enriches a raw recipe with UI-specific metadata like current like status.
   * @param r The raw recipe data from the database.
   */
  private mapToDisplayRecipe(r: RecipeWithCuisine) {
    const isLiked = this.recipeService.isLiked(r.id);
    const wasLiked = this.likedAtLoad().has(r.id);
    return {
      ...r,
      isLiked,
      liveLikes: this.calculateLiveLikes(r.likes, isLiked, wasLiked)
    };
  }

  /**
   * Optimistically calculates the display like count based on local interactions.
   * @param base The original count from the database.
   * @param active Current state of the user's like.
   * @param initial State of the user's like when the component loaded.
   */
  private calculateLiveLikes(base: number, active: boolean, initial: boolean): number {
    if (active && !initial) return base + 1;
    if (!active && initial) return base - 1;
    return base;
  }

  /**
   * Filters an array of recipes based on the dietary choice.
   * @param list The array to filter.
   * @param diet The selected diet category.
   */
  private applyDietFilter(list: any[], diet: string) {
    return diet === 'All' ? list : list.filter(r => r.diet_type === diet);
  }

  /**
   * Filters an array of recipes based on the cooking time complexity.
   * @param list The array to filter.
   * @param time The selected time category (Quick, Medium, Complex).
   */
  private applyTimeFilter(list: any[], time: string) {
    if (time === 'All') return list;
    return list.filter(r => {
      if (time === 'Quick') return r.cooking_time <= 25;
      if (time === 'Medium') return r.cooking_time > 25 && r.cooking_time <= 45;
      return r.cooking_time > 45;
    });
  }
}