import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ingredient-list-item',
  imports: [FormsModule],
  templateUrl: './ingredient-list-item.component.html',
  styleUrl: './ingredient-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientListItemComponent {
  amount = input.required<number | string>();
  unit = input<string>('');
  name = input.required<string>();
  isEditable = input<boolean>(true);

  remove = output<void>();
  update = output<{ amount: number | string, unit: string }>();

  isEditing = signal(false);
  isDropdownOpen = signal(false);
  
  editAmount: number | string = '';
  editUnit: string = '';

  /** 
   * Computes the human-readable quantity string (e.g., '100g' or '2').
   * @returns Formatted quantity string.
   */
  protected displayQuantity = computed(() => {
    const val = this.amount();
    const unit = this.unitMap[this.unit().toLowerCase()] ?? this.unit();
    return `${val}${unit}`;
  });

  /** 
   * Map for transforming technical unit names into short display symbols.
   */
  private readonly unitMap: Record<string, string> = {
    'gram': 'g',
    'ml': 'ml',
    'piece': ''
  };

  /** Initializes the local edit state and activates the edit view. */
  startEdit() {
    this.editAmount = this.amount();
    this.editUnit = this.unit();
    this.isEditing.set(true);
  }

  /**
   * Toggles the unit selection dropdown.
   * @param event The DOM event used to stop propagation.
   */
  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen.update(v => !v);
  }

  /**
   * Updates the local unit state and closes the dropdown.
   * @param unit The selected unit string.
   * @param event The DOM event used to stop propagation.
   */
  selectUnit(unit: string, event: Event) {
    event.stopPropagation();
    this.editUnit = unit;
    this.isDropdownOpen.set(false);
  }

  /** Emits the updated values and returns to display mode. */
  saveEdit() {
    this.update.emit({ amount: this.editAmount, unit: this.editUnit });
    this.isEditing.set(false);
  }
}
