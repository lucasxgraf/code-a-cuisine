import { ChangeDetectionStrategy, Component, signal, computed, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, of, max, tap } from 'rxjs';
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
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZäöüÄÖÜß\s-]+$/)] }),
    amount: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(5), Validators.minLength(1), Validators.pattern(/^[0-9]+$/)] }),
    unit: new FormControl('gram', { nonNullable: true }),
  });

  ingredients = this.generatorService.ingredients;
  isUnitDropdownOpen = signal(false);
  isIngredientDropdownOpen = signal(false);
  units: string[] = ['piece', 'ml', 'gram'];

  protected activeSelectedIndex = signal<number>(-1);

  private autocompleteStream = this.ingredientForm.controls.name.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => {
      if (term.length < 2) return of([]);
      return this.ingredientService.searchIngredients(term);
    })
  );

  filteredIngredients = toSignal(this.autocompleteStream.pipe(
    tap(() => this.activeSelectedIndex.set(-1))
  ), { initialValue: [] as string[] });

  handleKeydown(event: KeyboardEvent): void {
    const results = this.filteredIngredients();
    if (results.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeSelectedIndex.update(idx => (idx + 1) % results.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeSelectedIndex.update(idx => (idx - 1 + results.length) % results.length);
        break;
      case 'Enter':
        if (this.activeSelectedIndex() >= 0) {
          event.preventDefault();
          this.selectIngredient(results[this.activeSelectedIndex()], event);
        }
        break;
      case 'Escape':
        this.closeAllDropdowns();
        break;
      case 'Tab':
        if (this.activeSelectedIndex() >= 0) {
          this.selectIngredient(results[this.activeSelectedIndex()], event);
        }
        break;
    }
  }

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
    this.activeSelectedIndex.set(-1);
  }
  
  protected onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^0-9]/g, '');
    
    if (input.value !== sanitized) {
      input.value = sanitized;
      this.ingredientForm.controls.amount.setValue(sanitized);
    }
  }

  protected onNameInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(/[^a-zA-ZäöüÄÖÜß\s-]/g, '');
    
    if (input.value !== sanitized) {
      input.value = sanitized;
      this.ingredientForm.controls.name.setValue(sanitized);
    }
  }
  
  protected hasError(controlName: 'name' | 'amount'): boolean {
    const control = this.ingredientForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  private sanitizeInput(val: string): string {
    return val.replace(/<[^>]*>?/gm, '').trim();
  }

  addIngredient(): void {
    if (this.ingredientForm.valid) {
      const raw = this.ingredientForm.getRawValue();
      const newIngredient: Ingredient = { 
        id: crypto.randomUUID(), 
        name: this.sanitizeInput(raw.name),
        amount: Number(raw.amount),
        unit: raw.unit, 
        is_extra: false 
      };

      this.generatorService.ingredients.update(current => [newIngredient, ...current]);
      this.ingredientForm.reset({ name: '', amount: '100', unit: 'gram' });
      this.ingredientForm.markAsUntouched();
    } else {
      this.ingredientForm.markAllAsTouched();
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