import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-error-modal',
  imports: [ButtonComponent],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorModalComponent {
  title = input.required<string>();
  message = input.required<string>();
  actionLabel = input<string>('Go back to ingredients');

  close = output<void>();
}
