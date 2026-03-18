import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecipeListRowComponent } from '../../shared/ui/recipe-list-row/recipe-list-row.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

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

  protected cuisineId = toSignal(this.route.params.pipe(map(p => p['id'])));

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

  recipes = signal([
    { id: '1', title: 'Pasta with spinach and cherry tomatoes', time: '20min', likes: 66, tags: ['Vegetarian', 'Quick'] },
    { id: '2', title: 'Creamy garlic shrimp pasta', time: '22min', likes: 32, tags: ['Quick'] },
    { id: '3', title: 'Funghi salami pizza', time: '16min', likes: 42, tags: ['Quick'] },
    { id: '4', title: 'Pasta with spinach and cherry tomatoes', time: '20min', likes: 66, tags: ['Vegetarian', 'Quick'] },
    { id: '5', title: 'Creamy garlic shrimp pasta', time: '22min', likes: 32, tags: ['Quick'] },
    { id: '6', title: 'Funghi salami pizza', time: '16min', likes: 42, tags: ['Quick'] },
    { id: '7', title: 'Pasta with spinach and cherry tomatoes', time: '20min', likes: 66, tags: ['Vegetarian', 'Quick'] },
    { id: '8', title: 'Creamy garlic shrimp pasta', time: '22min', likes: 32, tags: ['Quick'] }
  ]);
}