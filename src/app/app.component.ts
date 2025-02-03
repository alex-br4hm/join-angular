import {Component, effect, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'join-angular';

  darkMode = signal(false);

 applyDarkMode() {
   document.body.classList.add('dark-mode');
 }

 applyLightMode() {
   document.body.classList.remove('dark-mode');
 }
}
