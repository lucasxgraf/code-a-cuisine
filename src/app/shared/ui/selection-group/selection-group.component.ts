import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TagComponent } from '../tag/tag.component';

@Component({
  selector: 'app-selection-group',
  standalone: true,
  imports: [TagComponent],
  templateUrl: './selection-group.component.html',
  styleUrl: './selection-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectionGroupComponent {
  label = input.required<string>();
  icon = input<string>();
  options = input.required<string[]>();
  activeOption = input.required<string>();

  select = output<string>();
}
