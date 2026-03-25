import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
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

  protected readonly showLocalError = signal(false);

  protected readonly activeError = computed(() => {
    const backendMsg = this.generatorService.errorMessage();
    
    if (backendMsg) {
      return { title: 'Wait a second...', message: backendMsg };
    }

    if (this.showLocalError()) {
      return { 
        title: 'Ups! Something is missing...', 
        message: 'It looks like the generation took too long or your ingredients are insufficient. Please check and try again.' 
      };
    }

    return null;
  });

  constructor() {
    effect(() => {
      if (this.generatorService.resultIds().length > 0) {
        this.router.navigate(['/generate-result']);
      }
    });

    const hasIngredients = this.generatorService.ingredients().length >= 1;
    if (!hasIngredients) {
      this.showLocalError.set(true);
    }

    setTimeout(() => {
      if (this.generatorService.resultIds().length === 0 && !this.activeError()) {
        this.showLocalError.set(true);
      }
    }, 60000);
  }

  handleErrorClose() {
    this.generatorService.reset();
    this.router.navigate(['/generate-input-user']);
  }
}
