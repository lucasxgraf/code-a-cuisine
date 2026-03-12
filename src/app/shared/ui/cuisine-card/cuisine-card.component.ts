import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-cuisine-card',
  imports: [NgOptimizedImage],
  templateUrl: './cuisine-card.component.html',
  styleUrl: './cuisine-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuisineCardComponent {
  name = input.required<string>();
  imageUrl = input.required<string>();
  cardClick = output<void>();
}
