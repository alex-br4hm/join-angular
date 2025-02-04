import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FirebaseService} from './core/services/firebase.service';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {SideNavComponent} from './core/components/side-nav/side-nav.component';
import {HeaderComponent} from './core/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AngularFirestoreModule, SideNavComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'join-angular';

  constructor(private db: FirebaseService) {}



   ngOnInit() {
     this.db.getUsers().pipe(
     ).subscribe({
       next: data => {
         console.log(data);
       },
       error: error => {
         console.log(error);
       }
     })

     this.db.getTasks().pipe(
     ).subscribe({
       next: data => {
         console.log(data);
       },
       error: error => {
         console.log(error);
       }
     })

     this.db.getContacts().pipe(
     ).subscribe({
       next: data => {
         console.log(data);
       },
       error: error => {
         console.log(error);
       }
     })
   }


}
