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

  /** Signal holding the metadata of the deepest active route. */
  protected readonly navData = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getDeepestRouteData(this.activatedRoute))
    )
  );

  /** Computes CSS classes based on the headerTheme property in route data. */
  protected readonly footerClasses = computed(() => {
    const theme = this.navData()?.['headerTheme'] || 'green-logo';
    return `footer footer--${theme}`;
  });

  /**
   * Iterates through the route tree to find the deepest active route snapshot.
   * @param route The starting activated route.
   * @returns The route data object or undefined.
   */
  private getDeepestRouteData(route: ActivatedRoute): Record<string, any> | undefined {
    let active = route;
    while (active.firstChild) {
      active = active.firstChild;
    }
    return active.snapshot.data;
  }
}