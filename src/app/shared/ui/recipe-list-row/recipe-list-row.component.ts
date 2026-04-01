import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TagComponent } from '../tag/tag.component';
import { HeartButtonComponent } from "../heart-button/heart-button.component";

@Component({
  selector: 'app-recipe-list-row',
  imports: [TagComponent, HeartButtonComponent],
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
  isLiked = input<boolean>(false);

  rowClick = output<void>();
  toggleLike = output<void>();
}
