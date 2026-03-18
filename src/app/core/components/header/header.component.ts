import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private navigationService = inject(NavigationService);

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

  protected finalBackTarget = computed(() => {
    const data = this.navData();
    if (!data) 
      return '/home';

    if (data['backTarget'] === 'auto') {
      return this.navigationService.previousUrl();
    }

    return data['backTarget'] || '/home';
  });

  protected headerClasses = computed(() => {
    const theme = this.navData()?.['headerTheme'] || 'green-logo';
    return `header header--${theme}`;
  });
}
