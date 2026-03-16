import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CounterComponent {
  label = input.required<string>();
  value = input.required<number>();
  unit = input.required<string>();
  
  changed = output<number>();

  protected unitLabel = computed(() => {
    return this.value() === 1 ? this.unit() : `${this.unit()}s`;
  });

  decrement() {
    if (this.value() > 1) {
      this.changed.emit(this.value() - 1);
    }
  }

  increment() {
    this.changed.emit(this.value() + 1);
  }
}
