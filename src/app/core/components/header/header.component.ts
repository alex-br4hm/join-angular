import {Component, inject, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatIcon} from '@angular/material/icon';
import {NgClass} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import {filter} from 'rxjs';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    MatIcon,
    NgClass,
    MatTooltip,
    RouterLink,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  private router: Router = inject(Router);
  mode: string           = 'light';
  route: string          = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.route = event.urlAfterRedirects;
      });
    this.switchMode();
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
    this.router.navigate(['/login']).then(() => {
      this.authService.logout().subscribe({
        error: (error: Error) => console.log(error),
      });
    });
  }
}
