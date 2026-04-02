import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

type TagVariant = 'creme' | 'green';

@Component({
  selector: 'app-tag',
  imports: [],
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagComponent {
  variant = input<TagVariant>('creme');

  /** 
   * Dynamically computes the CSS classes based on the current variant.
   * @returns A BEM-formatted class string.
   */
  protected tagClasses = computed(() => {
    return `tag tag--${this.variant()}`;
  });
}
