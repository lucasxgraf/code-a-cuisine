import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { RecipeCardComponent } from '../../../shared/ui/recipe-card/recipe-card.component';
import { TagComponent } from '../../../shared/ui/tag/tag.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';

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

  recipes = signal([
    { id: '1', title: 'Pasta with spinach and cherry tomatoes', time: '20min' },
    { id: '2', title: 'Creamy garlic shrimp pasta', time: '22min' },
    { id: '3', title: 'Pasta alla Trapanese (Sicilian Pesto)', time: '20min' }
  ]);

  onViewRecipe(id: string) {
    this.router.navigate(['/recipe-detail']);
  }

  generateNew() {
    this.router.navigate(['/generate-input-user']);
  }
}
