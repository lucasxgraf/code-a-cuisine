import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  label = input.required<string>();
  value = input.required<number>();
  unit = input.required<string>();
  min = input<number>(1);
  max = input<number>(100);
  
  changed = output<number>();

  /** 
   * Computes the display unit, adding an 's' for plural values.
   * @returns String representing the current unit label.
   */
  protected unitLabel = computed(() => {
    return this.value() === 1 ? this.unit() : `${this.unit()}s`;
  });

  /** Decreases the counter value if it is above the minimum threshold. */
  decrement() {
    if (this.value() > 1) {
      this.changed.emit(this.value() - 1);
    }
  }

  /** Increases the counter value if it is below the maximum threshold. */
  increment() {
    this.changed.emit(this.value() + 1);
  }
}
