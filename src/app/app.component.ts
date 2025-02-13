import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {SideNavComponent} from './core/components/side-nav/side-nav.component';
import {HeaderComponent} from './core/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AngularFirestoreModule, SideNavComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent{
  title = 'join-angular';
}
