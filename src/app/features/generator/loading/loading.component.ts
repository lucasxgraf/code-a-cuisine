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

  /** Tracks if a local validation or timeout error has occurred. */
  protected readonly showLocalError = signal<boolean>(false);

  /** 
   * Computed signal that prioritizes backend errors over local timeout/validation errors. 
   * @returns An object containing error UI data or null.
   */
  protected readonly activeError = computed(() => {
    const backendMsg = this.generatorService.errorMessage();
    if (backendMsg) return { title: 'Wait a second...', message: backendMsg };
    return this.showLocalError() ? this.getLocalErrorInfo() : null;
  });

  constructor() {
    this.initNavigationWatcher();
    this.validateIngredientAvailability();
    this.startSafetyTimeout();
  }

  /** Resets the generator state and navigates back to the preferences screen. */
  handleErrorClose(): void {
    this.generatorService.reset();
    this.router.navigate(['/generate-preferences']);
  }

  /** Sets up an effect to navigate to the results page once recipe IDs are available. */
  private initNavigationWatcher(): void {
    effect(() => {
      if (this.generatorService.resultIds().length > 0) {
        this.router.navigate(['/generate-result']);
      }
    });
  }

  /** Checks if the user has provided enough ingredients to proceed. */
  private validateIngredientAvailability(): void {
    if (this.generatorService.ingredients().length < 1) {
      this.showLocalError.set(true);
    }
  }

  /** Starts a 60-second timer to trigger a local error if no response is received. */
  private startSafetyTimeout(): void {
    setTimeout(() => {
      const noResponse = this.generatorService.resultIds().length === 0;
      if (noResponse && !this.activeError()) {
        this.showLocalError.set(true);
      }
    }, 60000);
  }

  /** Provides the standard error message for local failures. */
  private getLocalErrorInfo() {
    return { 
      title: 'Ups! Something is missing...', 
      message: 'The generation took too long or your ingredients are insufficient. Please try again.' 
    };
  }
}