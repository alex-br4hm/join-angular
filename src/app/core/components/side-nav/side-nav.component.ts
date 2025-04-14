import {Component, DestroyRef, effect, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {ActiveRouteService} from '../../services/active-route.service';
import {NgClass} from '@angular/common';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../services/auth.service';
import {MatIcon} from '@angular/material/icon';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

export interface NavLink {
  name: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-side-nav',
  imports: [
    RouterLink,
    NgClass,
    MatIcon
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnInit{
  router: Router         = inject(Router);
  destroyRef: DestroyRef = inject(DestroyRef);

  loggedIn = false;
  currentRoute!: string;

  navLinks: NavLink[] = [
    {
      name: 'Summary',
      link: 'summary',
      icon: '/summary.svg',
    },
    {
      name: 'Add Task',
      link: 'addtask',
      icon: '/addtask.svg',
    },
    {
      name: 'Board',
      link: 'board',
      icon: '/board.svg',
    },
    {
      name: 'Contacts',
      link: 'contacts',
      icon: '/contacts.svg',
    },
  ]

  constructor(private activeRouteService: ActiveRouteService,
              private authService: AuthService) {
    effect(() => {
      this.currentRoute = this.activeRouteService.currentRoute();
    });
  }

  ngOnInit() {
    if (!this.currentRoute) {
      this.currentRoute = this.router.url;
    }

    this.checkIfLoggedIn();
  }

  checkIfLoggedIn() {
    this.authService.getUser().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        if (data) {
          this.loggedIn = true;
        }
      },
    });
  }
}
