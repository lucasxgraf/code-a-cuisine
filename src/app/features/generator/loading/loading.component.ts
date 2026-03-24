import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { RecipeGeneratorService } from '../../../core/services/recipe-generator.service';
import { ErrorModalComponent } from '../../../shared/ui/error-modal/error-modal.component';

@Component({
  selector: 'app-loading',
  imports: [NgOptimizedImage, ErrorModalComponent],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  private router = inject(Router);
  private generatorService = inject(RecipeGeneratorService);

  showError = signal(false);

  constructor() {
    effect(() => {
      const ids = this.generatorService.resultIds();
      if (ids.length > 0) {
        this.router.navigate(['/generate-result']);
      }
    });
    const hasIngredients = this.generatorService.ingredients().length >= 3;
    
    if (!hasIngredients) {
      this.showError.set(true);
    }

    setTimeout(() => {
      if (this.generatorService.resultIds().length === 0 && !this.showError()) {
        this.showError.set(true);
      }
    }, 30000); 
  }

  handleErrorClose() {
    this.showError.set(false);
    this.router.navigate(['/generate-preferences']);
  }
}
