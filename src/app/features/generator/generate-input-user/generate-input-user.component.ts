import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { IngredientListItemComponent } from '../../../shared/ui/ingredient-list-item/ingredient-list-item.component';
import { Ingredient } from '../../../core/models/ingredient.model';

@Component({
  selector: 'app-generate-input-user',
  imports: [ReactiveFormsModule, ButtonComponent, IngredientListItemComponent],
  templateUrl: './generate-input-user.component.html',
  styleUrl: './generate-input-user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'closeAllDropdowns()'
  }
})
export class GenerateInputUserComponent {
  private router = inject(Router);

  private availableIngredients: string[] = ['Pasta', 'Pastrami', 'Passionsfrut', 'Pesto', 'Paprika', 'Parmesan'];

  ingredients = signal<Ingredient[]>([]);
  isUnitDropdownOpen = signal(false);
  isIngredientDropdownOpen = signal(false);
  units: string[] = ['piece', 'ml', 'gram'];

  ingredientForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    amount: new FormControl<number | string>('100', { nonNullable: true, validators: [Validators.required] }),
    unit: new FormControl('gram', { nonNullable: true }),
  });

  private nameChanges = toSignal(this.ingredientForm.controls.name.valueChanges, { initialValue: '' });

  filteredIngredients = computed(() => {
    const term = this.nameChanges().toLowerCase();
    if (term.length < 1) return [];
    return this.availableIngredients
      .filter(i => i.toLowerCase().startsWith(term))
      .slice(0, 3);
  });

  toggleUnitDropdown(event: Event): void {
    event.stopPropagation();
    this.isIngredientDropdownOpen.set(false);
    this.isUnitDropdownOpen.update(v => !v);
  }

  toggleIngredientDropdown(event: Event): void {
    event.stopPropagation();
    this.isUnitDropdownOpen.set(false);
    this.isIngredientDropdownOpen.set(true);
  }

  closeAllDropdowns(): void {
    this.isUnitDropdownOpen.set(false);
    this.isIngredientDropdownOpen.set(false);
  }

  selectIngredient(name: string): void {
    this.ingredientForm.patchValue({ name });
    this.closeAllDropdowns();
  }

  selectUnit(unit: string, event: Event): void {
    event.stopPropagation();
    this.ingredientForm.patchValue({ unit });
    this.isUnitDropdownOpen.set(false);
  }

  addIngredient(): void {
    if (this.ingredientForm.valid) {
      const { name, amount, unit } = this.ingredientForm.getRawValue();
      this.ingredients.update(current => [...current, { id: crypto.randomUUID(), name, amount, unit }]);
      this.ingredientForm.controls.name.reset();
      this.closeAllDropdowns();
    }
  }

  removeIngredient(id: string): void {
    this.ingredients.update(current => current.filter(ing => ing.id !== id));
  }


  updateIngredient(id: string, newData: { amount: number | string, unit: string }) {
    this.ingredients.update(current => 
      current.map(ing => ing.id === id ? { ...ing, ...newData } : ing)
    );
  }

  nextStep(): void {
    if (this.ingredients().length > 0) {
      this.router.navigate(['/']);
    }
  }
}