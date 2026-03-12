import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type ChefId = 1 | 2 | 3 | 4;

@Component({
  selector: 'app-chefs-label',
  imports: [],
  templateUrl: './chefs-label.component.html',
  styleUrl: './chefs-label.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChefsLabelComponent {
  chefId = input.required<ChefId>();

  protected labelClasses = computed(() => {
    return `chef-label chef-label--${this.chefId()}`;
  });
}
