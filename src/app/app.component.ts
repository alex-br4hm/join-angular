import {Component, effect, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatButton} from '@angular/material/button';
import {FirebaseService} from './core/services/firebase.service';
import {ref} from '@angular/fire/storage';
import {objectVal, onValue} from '@angular/fire/database';
import {Observable} from 'rxjs';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButton, AngularFirestoreModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'join-angular';

  constructor(private db: FirebaseService) {}

 applyDarkMode() {
   document.body.classList.add('dark-mode');
 }

 applyLightMode() {
   document.body.classList.remove('dark-mode');
 }

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
