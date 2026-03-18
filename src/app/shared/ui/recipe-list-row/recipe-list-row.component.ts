import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-recipe-list-row',
  standalone: true,
  imports: [TagComponent],
  templateUrl: './recipe-list-row.component.html',
  styleUrl: './recipe-list-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeListRowComponent {
  index = input.required<number>();
  title = input.required<string>();
  time = input.required<string>();
  tags = input<string[]>([]);
  likes = input<number>(0);
  
  rowClick = output<void>();
}
