import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-heart-button',
  imports: [],
  templateUrl: './heart-button.component.html',
  styleUrl: './heart-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeartButtonComponent {
  isLiked = input<boolean>(false);
  toggle = output<void>();
}
