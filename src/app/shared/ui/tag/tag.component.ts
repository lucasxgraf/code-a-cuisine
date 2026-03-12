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

  protected tagClasses = computed(() => {
    return `tag tag--${this.variant()}`;
  });
}
