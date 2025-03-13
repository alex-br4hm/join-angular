import {AfterViewInit, Component, effect, inject, OnInit} from '@angular/core';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {ActiveRouteService} from '../../services/active-route.service';
import {NgClass} from '@angular/common';
import {filter} from 'rxjs';

export interface NavLink {
  name: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-side-nav',
  imports: [
    RouterLink,
    NgClass
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent implements OnInit{
  router: Router = inject(Router);
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

  constructor(private activeRouteService: ActiveRouteService) {
    effect(() => {
      this.currentRoute = this.activeRouteService.currentRoute();
      console.log(this.currentRoute);
    });
  }

  ngOnInit() {
    if (!this.currentRoute) {
      this.currentRoute = this.router.url;
    }

    console.log(this.currentRoute);
  }
}
