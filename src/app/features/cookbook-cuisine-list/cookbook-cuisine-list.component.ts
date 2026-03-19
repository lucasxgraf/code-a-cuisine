import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeListRowComponent } from '../../shared/ui/recipe-list-row/recipe-list-row.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs';
import { RecipeService } from '../../core/services/recipe.service';

@Component({
  selector: 'app-cookbook-cuisine-list',
  standalone: true,
  imports: [RecipeListRowComponent, ButtonComponent, RouterLink],
  templateUrl: './cookbook-cuisine-list.component.html',
  styleUrl: './cookbook-cuisine-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CookbookCuisineListComponent {
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);

  protected cuisineId = toSignal(
    this.route.params.pipe(map(p => p['id'] as string)),
    { initialValue: '' }
  );

  private recipes$ = this.route.params.pipe(
    map(params => params['id'] as string),
    filter(id => !!id),
    switchMap(id => this.recipeService.getRecipesByCuisine(id))
  );

  protected recipes = toSignal(this.recipes$, { initialValue: [] });

  private cuisineNames: Record<string, string> = {
    'italian': 'Italian cuisine',
    'german': 'German cuisine',
    'indian': 'Indian cuisine',
    'japanese': 'Japanese cuisine',
    'gourmet': 'Gourmet cuisine',
    'fusion': 'Fusion cuisine'
  };

  protected cuisineTitle = computed(() => {
    const id = this.cuisineId();
    return id ? this.cuisineNames[id] : 'Cuisine';
  });
}