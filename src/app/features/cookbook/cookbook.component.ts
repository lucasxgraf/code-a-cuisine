import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MostLikedCardComponent } from "../../shared/ui/most-liked-card/most-liked-card.component";
import { HeartButtonComponent } from "../../shared/ui/heart-button/heart-button.component";
import { CuisineCardComponent } from "../../shared/ui/cuisine-card/cuisine-card.component";
import { ButtonComponent } from "../../shared/ui/button/button.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cookbook',
  standalone: true,
  imports: [MostLikedCardComponent, HeartButtonComponent, CuisineCardComponent, ButtonComponent, RouterLink],
  templateUrl: './cookbook.component.html',
  styleUrl: './cookbook.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookbookComponent {
  readonly cuisines = signal([
    { id: 'italian', name: 'Italian cuisine 🌮', image: 'assets/img/cookbook/italian.png' },
    { id: 'german', name: 'German cuisine 🥨', image: 'assets/img/cookbook/german.png' },
    { id: 'japanese', name: 'Japanese cuisine 🥢', image: 'assets/img/cookbook/japanese.png' },
    { id: 'gourmet', name: 'Gourmet cuisine ✨', image: 'assets/img/cookbook/gourmet.png' },
    { id: 'indian', name: 'Indian cuisine 🍛', image: 'assets/img/cookbook/indian.png' },
    { id: 'fusion', name: 'Fusion cuisine 🍢', image: 'assets/img/cookbook/fusion.png' }
  ]);

  readonly featuredRecipes = signal([
    { title: 'Pasta with spinach and cherry tomatoes', time: '20min', likes: 66 },
    { title: 'Low Carb Vegan No-Bake Paleo Bars', time: '35min', likes: 57 },
    { title: 'Summer Quinoa Salad with Lemon', time: '15min', likes: 42 }
  ]);
}