import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent implements OnInit {
  private router = inject(Router);

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate(['/generate-result']);
    }, 5000);
  }
}
