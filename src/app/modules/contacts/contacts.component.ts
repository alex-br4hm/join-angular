import {Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../core/services/firebase.service';
import {Contact} from '../../core/models/contacts';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgStyle} from '@angular/common';
import {PhoneNumberPipe} from '../../shared/utils/phone-number.pipe';
import {EmailPipe} from '../../shared/utils/email.pipe';

@Component({
  selector: 'app-contacts',
  imports: [
    MatButton,
    MatIcon,
    MatProgressSpinner,
    NgStyle,
    PhoneNumberPipe,
    EmailPipe
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  contactList: Contact[] = [];
  sortedList!: Contact[];
  availableLetters!: string[];
  groupedContacts: { [letter: string]: Contact[] } = {};
  selectedContact?: Contact;
  isLoading: boolean = true;

  constructor(private firebase: FirebaseService) {}

  ngOnInit() {
    this.firebase.getContacts().pipe(
    ).subscribe({
      next: data => {
        this.contactList = data;
        this.contactList = Object.values(this.contactList);
        this.sortContacts();
      },
      error: error => {
        console.log(error);
      }
    })
  }

  sortContacts() {
    this.sortedList = this.contactList.sort((a, b) =>
      a.firstname.localeCompare(b.firstname)
    );

    this.extractAvailableLetters()
  }

  extractAvailableLetters(): void {
    const letterSet = new Set(this.sortedList.map(contact =>
      contact.firstname?.charAt(0).toUpperCase())
    );

    this.availableLetters = Array.from(letterSet).sort();
    this.groupContacts();
  }

  groupContacts(): void {
    this.sortedList.forEach(contact => {
      const letter = contact.firstname.charAt(0).toUpperCase();

      if (!this.groupedContacts[letter]) {
          this.groupedContacts[letter] = [];
      }

      this.groupedContacts[letter].push(contact);
      this.isLoading = false;
    });
  }

  selectContact(id: number) {
    this.selectedContact = this.sortedList.find(contact => contact.id === id);
  }
}
