import {Component, effect} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ActiveRouteService} from '../../services/active-route.service';
import {NgClass} from '@angular/common';

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
export class SideNavComponent {
  currentRoute!: string;

  navLinks: NavLink[] = [
    {
      name: 'Summary',
      link: 'summary',
      icon: '/icons/summary.svg',
    },
    {
      name: 'Add Task',
      link: 'addtask',
      icon: '/icons/addtask.svg',
    },
    {
      name: 'Board',
      link: 'board',
      icon: '/icons/board.svg',
    },
    {
      name: 'Contacts',
      link: 'contacts',
      icon: '/icons/contacts.svg',
    },
  ]

  constructor(private activeRouteService: ActiveRouteService) {
    effect(() => {
      this.currentRoute = this.activeRouteService.currentRoute();
    });
  }

}
