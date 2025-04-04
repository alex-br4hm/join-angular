import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterEvent, RouterOutlet} from '@angular/router';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {SideNavComponent} from './core/components/side-nav/side-nav.component';
import {HeaderComponent} from './core/components/header/header.component';
import {filter} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AngularFirestoreModule,
    SideNavComponent,
    HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title       = 'Join';
  activeRoute = '/';

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: RouterEvent) => {
        this.activeRoute = event.url;
      });
  }
}
