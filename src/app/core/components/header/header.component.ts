import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from '@angular/material/icon';
import {NgClass} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import {filter} from 'rxjs';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {AuthService} from '../../services/auth.service';
import {UserService} from '../../services/user.service';
import {Contact} from '../../models/contacts';
import {FirstLetterPipe} from '../../../shared/utils/first-letter.pipe';
import {User} from '@angular/fire/auth';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    NgClass,
    MatTooltip,
    RouterLink,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    FirstLetterPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  destroyRef: DestroyRef = inject(DestroyRef);
  router: Router         = inject(Router);
  mode: string           = 'light';
  route: string          = '';

  constructor(private authService: AuthService,
              protected userService: UserService) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.route = event.urlAfterRedirects;
      });
    this.switchMode();
    this.userService.getActiveUser();
  }

  switchMode() {
    this.mode = this.mode === 'light' ? 'dark' : 'light';

    if (this.mode === 'light') {
      document.body.classList.remove('dark-mode');
    }

    if (this.mode === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }

  logout() {
    this.authService.logout().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
        this.router.navigate(['login']);
      },
      error: (error) => {console.log(error)}
    })
  }
}
