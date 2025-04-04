import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Database, objectVal, push, ref, remove, set, update} from '@angular/fire/database';
import {Contact} from '../models/contacts';
import { Task } from '../models/tasks';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db = inject(Database);

  getTasks():Observable<Task[]> {
    const tasksRef = ref(this.db, 'tasks');
    return objectVal(tasksRef);
  }

  getContacts():Observable<Contact[]> {
    const contactsRef = ref(this.db, 'contacts');
    return objectVal(contactsRef);
  }

  addContact(contact: Contact): void {
    const contactsRef    = ref(this.db, 'contacts');
    const newContactRef  = push(contactsRef);

    if (newContactRef.key != null) {
      contact.id = newContactRef.key;
    }

    set(newContactRef, contact)
      .then(() => {
        console.log('Contact added successfully');
      })
      .catch((error) => {
        console.error('Error adding contact: ', error);
      });
  }

  editContact(contact: Contact): void {
    const contactRef = ref(this.db, `contacts/${contact.id}`);

    update(contactRef, contact)
      .then(() => {
        console.log('Contact updated successfully');
      })
      .catch((error) => {
        console.error('Error updating contact: ', error);
      });
  }

  deleteContact(contactID: string): void {
    const contactRef = ref(this.db, `contacts/${contactID}`);

    remove(contactRef)
      .then(() => {
        console.log('Contact deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting contact: ', error);
      });
  }

}
