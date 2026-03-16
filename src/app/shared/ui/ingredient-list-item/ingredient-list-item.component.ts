import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingredient-list-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ingredient-list-item.component.html',
  styleUrl: './ingredient-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientListItemComponent {
  amount = input.required<number | string>();
  unit = input<string>('');
  name = input.required<string>();

  remove = output<void>();
  update = output<{ amount: number | string, unit: string }>();

  isEditing = signal(false);
  isDropdownOpen = signal(false);
  
  editAmount: number | string = '';
  editUnit: string = '';

  protected displayQuantity = computed(() => `${this.amount()} ${this.unit()}`);

  startEdit() {
    this.editAmount = this.amount();
    this.editUnit = this.unit();
    this.isEditing.set(true);
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen.update(v => !v);
  }

  selectUnit(unit: string, event: Event) {
    event.stopPropagation();
    this.editUnit = unit;
    this.isDropdownOpen.set(false);
  }

  saveEdit() {
    this.update.emit({ amount: this.editAmount, unit: this.editUnit });
    this.isEditing.set(false);
  }
}
