import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-chefs-label',
  imports: [],
  templateUrl: './chefs-label.component.html',
  styleUrl: './chefs-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChefsLabelComponent {
  chefId = input.required<number>();

  protected labelClasses = computed(() => {
    return `chef-label chef-label--${this.chefId()}`;
  });
}
