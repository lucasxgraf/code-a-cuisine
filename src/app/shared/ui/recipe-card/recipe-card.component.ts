import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-recipe-card',
  imports: [ButtonComponent],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeCardComponent {
  recipeNumber = input<number>(1);
  title = input.required<string>();
  cookingTime = input.required<string>();

  viewDetails = output<void>();
}
