import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  protected navData = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) route = route.firstChild;
        return route?.snapshot.data;
      })
    )
  );

  protected footerClasses = computed(() => {
    const theme = this.navData()?.['headerTheme'] || 'green-logo';
    return `footer footer--${theme}`;
  });
}