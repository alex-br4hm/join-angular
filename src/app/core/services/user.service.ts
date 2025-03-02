import {DestroyRef, inject, Injectable, signal} from '@angular/core';
import {FirebaseService} from './firebase.service';
import {Contact} from '../models/contacts';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  destroyRef: DestroyRef = inject(DestroyRef);
  contacts$!: Observable<Contact[]>;
  activeUser$!: Contact | undefined;
  private activeUserEmail = signal<string | undefined>(undefined);

  constructor(private firebaseService: FirebaseService) {
    this.contacts$ = this.firebaseService.getContacts().pipe(
      map(data => Object.values(data) as Contact[]),
      takeUntilDestroyed(this.destroyRef)
    );
  }

  setActiveUserEmail(email: string) {
    this.activeUserEmail.set(email);
  }

  getActiveUser(contacts: Contact[]) {
    const email = this.activeUserEmail();
    this.activeUser$ = contacts.find(contact => contact.email === email);
    console.log(email, this.activeUser$);
  }
}
