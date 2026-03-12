import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-ingredient-list-item',
  imports: [],
  templateUrl: './ingredient-list-item.component.html',
  styleUrl: './ingredient-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientListItemComponent {
  amount = input.required<number | string>();
  unit = input<string>('');
  name = input.required<string>();

  edit = output<void>();
  remove = output<void>();
}
