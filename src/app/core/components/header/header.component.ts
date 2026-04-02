import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';


@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private navigationService = inject(NavigationService);

  /** Signal holding the data properties of the deepest active route. */
  protected readonly navData = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.getDeepestRouteData(this.activatedRoute))
    )
  );

  /** Computes the target URL for the back button based on route metadata. */
  protected readonly finalBackTarget = computed(() => {
    return this.resolveBackTarget(this.navData());
  });

  /** Computes the CSS classes for the header theme. */
  protected readonly headerClasses = computed(() => {
    const theme = this.navData()?.['headerTheme'] || 'green-logo';
    return `header header--${theme}`;
  });

  /**
   * Traverses the route tree to extract data from the deepest child route.
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

  /**
   * Determines the final back navigation target.
   * @param data The metadata of the current route.
   * @returns The resolved navigation path string.
   */
  private resolveBackTarget(data: Record<string, any> | undefined): string {
    if (!data) return '/home';
    if (data['backTarget'] === 'auto') return this.navigationService.previousUrl();
    return data['backTarget'] || '/home';
  }
}