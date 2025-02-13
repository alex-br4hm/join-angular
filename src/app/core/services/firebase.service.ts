import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Database, objectVal, ref} from '@angular/fire/database';
import {Contact} from '../models/contacts';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private db: Database) {}

  getUsers():Observable<Contact> {
    const usersRef = ref(this.db, 'users');
    return objectVal(usersRef);
  }

  getTasks():Observable<any> {
    const tasksRef = ref(this.db, 'tasks');
    return objectVal(tasksRef);
  }

  getContacts():Observable<any> {
    const contactsRef = ref(this.db, 'contacts');
    return objectVal(contactsRef);
  }
}
