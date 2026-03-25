import { ChangeDetectionStrategy, Component, computed, inject, signal, untracked } from '@angular/core';
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

  protected cuisineId = toSignal(
    this.route.params.pipe(map(p => p['id'] as string)),
    { initialValue: '' }
  );

  private dbRecipes$ = this.route.params.pipe(
    map(params => params['id'] as string),
    filter(id => !!id),
    switchMap(id => this.recipeService.getRecipesByCuisine(id))
  );

  private dbRecipes = toSignal(this.dbRecipes$, { initialValue: [] as RecipeWithCuisine[] });

  private likedAtLoad = computed(() => {
    const recipes = this.dbRecipes();
    const currentLikes = untracked(() => this.recipeService.likedIds());
    return new Set(recipes.filter(r => currentLikes.includes(r.id)).map(r => r.id));
  });

  protected displayRecipes = computed(() => {
    const rawList = this.dbRecipes();
    const likedIds = this.recipeService.likedIds(); 
    const initialLikes = this.likedAtLoad();

    return rawList.map(r => {
      const isNowLiked = likedIds.includes(r.id);
      const wasLikedAtLoad = initialLikes.has(r.id);

      let likes = r.likes;
      if (isNowLiked && !wasLikedAtLoad) likes++;
      if (!isNowLiked && wasLikedAtLoad) likes--;

      return {
        ...r,
        isLiked: isNowLiked,
        liveLikes: likes
      };
    });
  });

  toggleLike(id: string): void {
    this.recipeService.toggleLike(id);
  }

  private readonly cuisineNames: Record<string, string> = {
    'italian': 'Italian cuisine',
    'german': 'German cuisine',
    'indian': 'Indian cuisine',
    'japanese': 'Japanese cuisine',
    'gourmet': 'Gourmet cuisine',
    'fusion': 'Fusion cuisine'
  };

  protected cuisineTitle = computed(() => {
    return this.cuisineNames[this.cuisineId()] || 'Cuisine';
  });

  protected readonly filteredRecipes = computed(() => {
    let list = this.displayRecipes();
    const diet = this.selectedDiet();
    const time = this.selectedTime();

    if (diet !== 'All') {
      list = list.filter(r => r.diet_type === diet);
    }

    if (time !== 'All') {
      list = list.filter(r => {
        if (time === 'Quick') return r.cooking_time <= 25;
        if (time === 'Medium') return r.cooking_time > 25 && r.cooking_time <= 45;
        if (time === 'Complex') return r.cooking_time > 45;
        return true;
      });
    }

    return list;
  });

  setDietFilter(value: string): void {
    this.selectedDiet.set(value);
  }

  setTimeFilter(value: string): void {
    this.selectedTime.set(value);
  }
}