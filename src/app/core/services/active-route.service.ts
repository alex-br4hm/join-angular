import {Injectable, signal} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveRouteService {
  currentRoute = signal<string>('');

  constructor(private router: Router) {
    this.currentRoute.set(this.router.url.replace(/^\/+/, ''));

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const cleanedRoute: string = event.urlAfterRedirects.replace(/^\/+/, '');
        this.currentRoute.set(cleanedRoute);
      });
  }
}
