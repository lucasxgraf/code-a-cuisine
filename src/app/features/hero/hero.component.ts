import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgOptimizedImage, ButtonComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  private router = inject(Router);
}
