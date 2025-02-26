import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLinkActive, RouterOutlet} from '@angular/router';
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
  title: string       = 'Join';
  activeRoute: string = '/';

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.activeRoute = event.url;
        console.log(this.activeRoute);
      });
  }
}
