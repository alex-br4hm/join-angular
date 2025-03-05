import {DestroyRef, inject, Injectable} from '@angular/core';
import {FirebaseService} from './firebase.service';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';
import {Contact} from '../models/contacts';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {filter, take} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  destroyRef: DestroyRef = inject(DestroyRef);
  router: Router         = inject(Router);
  activeUser!: Contact | undefined;
  activeUserMail!: string;
  contactList?: Contact[];

  constructor(private firebaseService: FirebaseService,
              private authService: AuthService,) {
  }

  getActiveUser(){
    this.authService.getUser().pipe(
      take(1),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (user) => {
        if (user?.email) {
          this.activeUserMail = user.email;
          this.setActiveUserEmail();
        }
      },
      error: (error) => {console.log(error)}
    })
  }

  setActiveUserEmail() {
    if (this.activeUserMail) {
      this.getContactList();
    }
  }

  getContactList() {
    this.firebaseService.getContacts().pipe(
      take(1),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: data => {
        this.contactList = data;
        this.findActiveUser();
      },
      error: error => {
        console.log(error);
      }
    })
  }

  findActiveUser() {
    this.activeUser = Object.values(this.contactList ?? {}).find(contact => contact.email === this.activeUserMail);
  }

}
