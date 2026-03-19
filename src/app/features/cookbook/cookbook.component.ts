import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MostLikedCardComponent } from "../../shared/ui/most-liked-card/most-liked-card.component";
import { HeartButtonComponent } from "../../shared/ui/heart-button/heart-button.component";
import { CuisineCardComponent } from "../../shared/ui/cuisine-card/cuisine-card.component";
import { ButtonComponent } from "../../shared/ui/button/button.component";
import { RouterLink } from "@angular/router";
import { RecipeService } from '../../core/services/recipe.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-cookbook',
  standalone: true,
  imports: [MostLikedCardComponent, HeartButtonComponent, CuisineCardComponent, ButtonComponent, RouterLink],
  templateUrl: './cookbook.component.html',
  styleUrl: './cookbook.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookbookComponent {
  private recipeService = inject(RecipeService);

  private cuisinesRaw = toSignal(this.recipeService.getCuisines(), { initialValue: [] });

  readonly cuisines = computed(() => {
    return this.cuisinesRaw().map(c => ({
      ...c,
      image: `assets/img/cookbook/${c.slug}.png`
    }));
  });

  readonly featuredRecipes = signal([
    { title: 'Pasta with spinach and cherry tomatoes', time: '20min', likes: 66 },
    { title: 'Low Carb Vegan No-Bake Paleo Bars', time: '35min', likes: 57 },
    { title: 'Summer Quinoa Salad with Lemon', time: '15min', likes: 42 }
  ]);
}