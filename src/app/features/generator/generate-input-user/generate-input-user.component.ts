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

  /** Form group for adding new ingredients with strict validation and XSS protection patterns. */
  readonly ingredientForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZäöüÄÖÜß\s-]+$/)] }),
    amount: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(5), Validators.minLength(1), Validators.pattern(/^[0-9]+$/)] }),
    unit: new FormControl('gram', { nonNullable: true }),
  });

  /** Reference to the global ingredients signal. */
  readonly ingredients = this.generatorService.ingredients;
  /** UI state for dropdown visibility. */
  readonly isUnitDropdownOpen = signal(false);
  readonly isIngredientDropdownOpen = signal(false);
  /** Available measurement units. */
  readonly units: string[] = ['piece', 'ml', 'gram'];
  /** Tracks the currently highlighted index in the autocomplete dropdown. */
  protected readonly activeSelectedIndex = signal<number>(-1);

  /** Observable stream handling debounced autocomplete requests. */
  private readonly autocompleteStream = this.ingredientForm.controls.name.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => term.length < 2 ? of([]) : this.ingredientService.searchIngredients(term)),
    tap(() => this.activeSelectedIndex.set(-1))
  );

  /** Signal containing filtered ingredient suggestions. */
  readonly filteredIngredients = toSignal(this.autocompleteStream, { initialValue: [] as string[] });

  /**
   * Orchestrates keyboard navigation within the autocomplete dropdown.
   * @param event The native keyboard event.
   */
  handleKeydown(event: KeyboardEvent): void {
    const results = this.filteredIngredients();
    if (results.length === 0) return;

    const actions: Record<string, () => void> = {
      'ArrowDown': () => this.moveSelection(1, results.length),
      'ArrowUp': () => this.moveSelection(-1, results.length),
      'Enter': () => this.activeSelectedIndex() >= 0 && this.selectIngredient(results[this.activeSelectedIndex()], event),
      'Escape': () => this.closeAllDropdowns(),
      'Tab': () => this.activeSelectedIndex() >= 0 && this.selectIngredient(results[this.activeSelectedIndex()], event)
    };

    if (actions[event.key]) {
      if (['ArrowDown', 'ArrowUp'].includes(event.key)) event.preventDefault();
      actions[event.key]();
    }
  }

  /** Toggles the visibility of the unit selection dropdown. */
  toggleUnitDropdown(event: Event): void {
    event.stopPropagation();
    this.isIngredientDropdownOpen.set(false);
    this.isUnitDropdownOpen.update(v => !v);
  }

  /** Toggles the visibility of the ingredient autocomplete dropdown. */
  toggleIngredientDropdown(event: Event): void {
    event.stopPropagation();
    this.isUnitDropdownOpen.set(false);
    this.isIngredientDropdownOpen.set(true);
  }

  /** Closes all active dropdown menus. */
  closeAllDropdowns(): void {
    this.isUnitDropdownOpen.set(false);
    this.isIngredientDropdownOpen.set(false);
  }

  /** Selects an ingredient from the suggestions and updates the form. */
  selectIngredient(name: string, event: Event): void {
    event.stopPropagation();
    this.ingredientForm.patchValue({ name });
    this.closeAllDropdowns();
    this.activeSelectedIndex.set(-1);
  }

  /** Updates the selected unit and resets state. */
  selectUnit(unit: string, event: Event): void {
    event.stopPropagation();
    this.ingredientForm.patchValue({ unit });
    this.closeAllDropdowns();
    this.activeSelectedIndex.set(-1);
  }
  
  /** Sanitizes the amount input to ensure only numeric characters are entered. */
  protected onAmountInput(event: Event): void {
    this.filterInput(event, /[^0-9]/g, 'amount');
  }

  /** Sanitizes the name input to ensure only valid alphabetical characters are entered. */
  protected onNameInput(event: Event): void {
    this.filterInput(event, /[^a-zA-ZäöüÄÖÜß\s-]/g, 'name');
  }
  
  /** Validates if a form control has errors and was touched by the user. */
  protected hasError(controlName: 'name' | 'amount'): boolean {
    const control = this.ingredientForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }

  /** Validates the form and adds the sanitized ingredient to the list. */
  addIngredient(): void {
    if (this.ingredientForm.valid) {
      const raw = this.ingredientForm.getRawValue();
      const newItem: Ingredient = this.createIngredientObject(raw);
      this.ingredients.update(current => [newItem, ...current]);
      this.ingredientForm.reset({ name: '', amount: '100', unit: 'gram' });
      this.ingredientForm.markAsUntouched();
    } else {
      this.ingredientForm.markAllAsTouched();
    }
  }

  /** Removes an ingredient from the list by ID. */
  removeIngredient(id: string): void {
    this.ingredients.update(current => current.filter(ing => ing.id !== id));
  }

  /** Updates an existing ingredient's data. */
  updateIngredient(id: string, newData: { amount: number | string, unit: string }): void {
    this.ingredients.update(current =>
      current.map(ing => ing.id === id ? { ...ing, ...newData } : ing)
    );
  }

  /** Navigates to the next step if ingredients are present. */
  nextStep(): void {
    if (this.ingredients().length > 0) {
      this.router.navigate(['/generate-preferences']);
    }
  }

  private moveSelection(step: number, length: number): void {
    this.activeSelectedIndex.update(idx => (idx + step + length) % length);
  }

  private filterInput(event: Event, regex: RegExp, control: 'name' | 'amount'): void {
    const input = event.target as HTMLInputElement;
    const sanitized = input.value.replace(regex, '');
    if (input.value !== sanitized) {
      input.value = sanitized;
      this.ingredientForm.get(control)?.setValue(sanitized);
    }
  }

  private createIngredientObject(raw: { name: string, amount: string, unit: string }): Ingredient {
    return {
      id: crypto.randomUUID(),
      name: raw.name.replace(/<[^>]*>?/gm, '').trim(),
      amount: Number(raw.amount),
      unit: raw.unit,
      is_extra: false
    };
  }
}