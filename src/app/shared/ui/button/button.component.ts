import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type ButtonVariant = 'primary' | 'secondary';
type ButtonColor = 'green' | 'creme';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  colorScheme = input<ButtonColor>('green');
  type = input<'button' | 'submit' | 'reset'>('button');

  protected buttonClasses = computed(() => {
    return `btn btn--${this.variant()}-${this.colorScheme()}`;
  });
}
