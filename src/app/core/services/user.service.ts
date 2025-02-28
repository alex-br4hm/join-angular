import {DestroyRef, inject, Injectable} from '@angular/core';
import {FirebaseService} from './firebase.service';
import {Contact} from '../models/contacts';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  destroyRef: DestroyRef = inject(DestroyRef);
  contactList: Contact[] = [];
  activeUserEmail?: string;
  activeUser$?: Contact;

  constructor(private firebaseService: FirebaseService) { }

  setActiveUserEmail(email: string) {
    this.activeUserEmail = email;
    this.getContacts();
  }

  getContacts() {
    this.firebaseService.getContacts().pipe(
      takeUntilDestroyed(this.destroyRef)
    )
      .subscribe({
        next: (data) => {
          this.contactList = Object.values(data);
          this.setActiveUser();
        },
        error: (error) => {
          console.log(error)}
      })
  }

  setActiveUser() {
    this.activeUser$ = this.contactList.find(contact => contact.email == this.activeUserEmail);
    console.log(this.activeUser$);
  }
}
