import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop'; // Wichtig
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs'; // Wichtig
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { IngredientListItemComponent } from '../../../shared/ui/ingredient-list-item/ingredient-list-item.component';
import { Ingredient } from '../../../core/models/recipe.model';
import { IngredientService } from '../../../core/services/ingredient.service';
import { RecipeGeneratorService } from '../../../core/services/recipe-generator.service';

@Component({
  selector: 'app-generate-input-user',
  standalone: true,
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
  private ingredientService = inject(IngredientService);
  private generatorService = inject(RecipeGeneratorService);

  ingredientForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    amount: new FormControl<number | string>('100', { nonNullable: true, validators: [Validators.required] }),
    unit: new FormControl('gram', { nonNullable: true }),
  });

  ingredients = this.generatorService.ingredients;
  isUnitDropdownOpen = signal(false);
  isIngredientDropdownOpen = signal(false);
  units: string[] = ['piece', 'ml', 'gram'];

  private autocompleteStream = this.ingredientForm.controls.name.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => {
      if (term.length < 2) return of([]);
      return this.ingredientService.searchIngredients(term);
    })
  );

  filteredIngredients = toSignal(this.autocompleteStream, { initialValue: [] as string[] });

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

  selectIngredient(name: string, event: Event): void {
    event.stopPropagation();
    this.ingredientForm.patchValue({ name });
    this.closeAllDropdowns();
  }

  selectUnit(unit: string, event: Event): void {
    event.stopPropagation();
    this.ingredientForm.patchValue({ unit });
    this.closeAllDropdowns();
  }

  addIngredient(): void {
    if (this.ingredientForm.valid) {
      const { name, amount, unit } = this.ingredientForm.getRawValue();
      const newIngredient: Ingredient = { id: crypto.randomUUID(), name, amount, unit, is_extra: false };

      this.ingredients.update(current => [newIngredient, ...current]);
      this.ingredientForm.controls.name.reset();
      this.closeAllDropdowns();
    }
  }

  removeIngredient(id: string): void {
    this.ingredients.update(current => current.filter(ing => ing.id !== id));
  }

  updateIngredient(id: string, newData: { amount: number | string, unit: string }): void {
    this.ingredients.update(current =>
      current.map(ing => ing.id === id ? { ...ing, ...newData } : ing)
    );
  }

  nextStep(): void {
    if (this.ingredients().length > 0) {
      this.router.navigate(['/generate-preferences']);
    }
  }
}