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

  showError = signal(false);

  readonly times = [
    { label: 'Quick', sub: 'up to 20min' },
    { label: 'Medium', sub: '25-40min' },
    { label: 'Complex', sub: 'over 45min' }
  ];
  readonly cuisines = [
    { label: 'German' },
    { label: 'Italian' },
    { label: 'Indian' },
    { label: 'Japanese' },
    { label: 'Gourmet' },
    { label: 'Fusion' }
  ];
  readonly diets = [
    { label: 'Vegetarian' },
    { label: 'Vegan' },
    { label: 'Keto' },
    { label: 'No preferences' }
  ];

  updatePref<K extends keyof RecipePreferences>(key: K, value: RecipePreferences[K]): void {
    this.service.preferences.update(p => ({ ...p, [key]: value }));
  }

  updateCount(key: 'portions' | 'people', newValue: number): void {
    const currentValue = this.service.preferences()[key];
    const delta = newValue - currentValue;

    this.service.changeCount(key, delta);
  }

  generateRecipe(): void {
  this.router.navigate(['/generate-loading']);

  this.service.generateRecipes().subscribe({
    next: (response) => {
      if (response?.recipeIds) {
        this.service.resultIds.set(response.recipeIds);
      }
    },
    error: (err) => {
      this.service.isGenerating.set(false);
      const msg = err.error?.message || 'An unexpected error occurred.';
      this.service.errorMessage.set(msg);
    }
    });
  }
}