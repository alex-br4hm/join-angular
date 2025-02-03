import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Database, objectVal, ref} from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private db: Database) {}

  getUsers():Observable<any> {
    console.log('DB Instance:', this.db);
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
