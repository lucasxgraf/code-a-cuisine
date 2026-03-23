import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { RecipeGeneratorService } from '../../../core/services/recipe-generator.service';
import { ErrorModalComponent } from '../../../shared/ui/error-modal/error-modal.component';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [NgOptimizedImage, ErrorModalComponent],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent implements OnInit {
  private router = inject(Router);
  private generatorService = inject(RecipeGeneratorService);

  showError = signal(false);

  constructor() {
    effect(() => {
      const ids = this.generatorService.resultIds();
      if (ids.length > 0) {
        this.router.navigate(['/recipe-results']);
      }
    });
  }

  ngOnInit() {
    const hasEnoughIngredients = this.generatorService.ingredients().length >= 3;

    if (!hasEnoughIngredients) {
      setTimeout(() => this.showError.set(true), 2500);
    } else {
      setTimeout(() => this.router.navigate(['/generate-result']), 5000);
    }
  }

  handleErrorClose() {
    this.showError.set(false);
    this.router.navigate(['/generate-input-user']);
  }
}
