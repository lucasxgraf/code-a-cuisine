import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeGeneratorService } from '../../../core/services/recipe-generator.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { CounterComponent } from '../../../shared/ui/counter/counter.component';
import { SelectionGroupComponent } from '../../../shared/ui/selection-group/selection-group.component';
import { RecipePreferences } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [ButtonComponent, CounterComponent, SelectionGroupComponent],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreferencesComponent {
  protected service = inject(RecipeGeneratorService);
  private router = inject(Router);

  /** Visibility state of local error indicators. */
  readonly showError = signal(false);

  /** Available cooking time categories. */
  readonly times = [
    { label: 'Quick', sub: 'up to 20min' },
    { label: 'Medium', sub: '25-40min' },
    { label: 'Complex', sub: 'over 45min' }
  ];

  /** Available culinary styles. */
  readonly cuisines = [
    { label: 'German' }, { label: 'Italian' }, { label: 'Indian' },
    { label: 'Japanese' }, { label: 'Gourmet' }, { label: 'Fusion' }
  ];

  /** Supported dietary restriction options. */
  readonly diets = [
    { label: 'Vegetarian' }, { label: 'Vegan' },
    { label: 'Keto' }, { label: 'No preferences' }
  ];

  /**
   * Updates a specific preference field in the generator service.
   * @param key The preference key to update.
   * @param value The new value for the field.
   */
  updatePref<K extends keyof RecipePreferences>(key: K, value: RecipePreferences[K]): void {
    this.service.preferences.update(p => ({ ...p, [key]: value }));
  }

  /**
   * Calculates the delta and updates the count for people or portions.
   * @param key The numeric preference key.
   * @param newValue The absolute new value from the counter.
   */
  updateCount(key: 'portions' | 'people', newValue: number): void {
    const delta = newValue - this.service.preferences()[key];
    this.service.changeCount(key, delta);
  }

  /**
   * Orchestrates the recipe generation process by triggering the service
   */
  generateRecipe(): void {
    this.service.errorMessage.set(null);
    this.router.navigate(['/generate-loading']);

    this.service.generateRecipes().subscribe({
      next: (res) => this.handleSuccess(res?.recipeIds),
      error: (err) => this.handleError(err)
    });
  }

  /** Handles a successful response from the recipe generation API. */
  private handleSuccess(ids?: string[]): void {
    if (ids) {
      this.service.resultIds.set(ids);
    }
  }

  /** Handles an error response from the recipe generation API. */
  private handleError(err: any): void {
    this.service.isGenerating.set(false);
    const msg = err.error?.message || 'An unexpected error occurred.';
    this.service.errorMessage.set(msg);
  }
}