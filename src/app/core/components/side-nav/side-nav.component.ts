import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';

export interface NavLink {
  name: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-side-nav',
  imports: [
    RouterLink,
    MatIcon
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.scss'
})
export class SideNavComponent {
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

}
