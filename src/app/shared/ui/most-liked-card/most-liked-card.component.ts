import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-most-liked-card',
  imports: [TagComponent],
  templateUrl: './most-liked-card.component.html',
  styleUrl: './most-liked-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MostLikedCardComponent {
  title = input.required<string>();
  cookingTime = input.required<string>();
  likes = input.required<number>();

  cardClick = output<void>();
}
