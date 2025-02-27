import {Component, DestroyRef, inject, OnInit, Output} from '@angular/core';
import {FirebaseService} from '../../core/services/firebase.service';
import {Contact} from '../../core/models/contacts';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgIf, NgStyle} from '@angular/common';
import {PhoneNumberPipe} from '../../shared/utils/phone-number.pipe';
import {EmailPipe} from '../../shared/utils/email.pipe';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {PopupContactFormComponent} from './popup-contact-form/popup-contact-form.component';
import {FirstLetterPipe} from '../../shared/utils/first-letter.pipe';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-contacts',
  imports: [
    MatButton,
    MatIcon,
    MatProgressSpinner,
    NgStyle,
    PhoneNumberPipe,
    EmailPipe,
    NgIf,
    PopupContactFormComponent,
    FirstLetterPipe
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  animations: [
    trigger('slideIn', [
      state('*', style({ transform: 'translateX(0)', opacity: 1 })),

      // reacts if the contact.id changed
      transition('* <=> *', [
        style({ transform: 'translateX(150%)', opacity: 0 }),
        animate('225ms ease', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class ContactsComponent implements OnInit {
  @Output() popUpType!: string;
  @Output() selectedContact?: Contact;

  destroyRef: DestroyRef = inject(DestroyRef);

  contactList: Contact[]   = [];
  sortedList!: Contact[];
  availableLetters!: string[];
  isLoading: boolean = true;
  popUp: boolean     = false;

  groupedContacts: { [letter: string]: Contact[] } = {};

  constructor(private firebase: FirebaseService) {}

  ngOnInit() {
    this.getContacts();
  }

  getContacts() {
    this.firebase.getContacts().pipe(
      takeUntilDestroyed(this.destroyRef)
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
    this.groupedContacts = {};

    this.sortedList.forEach(contact => {
      const letter = contact.firstname.charAt(0).toUpperCase();

      if (!this.groupedContacts[letter]) {
          this.groupedContacts[letter] = [];
      }

      this.groupedContacts[letter].push(contact);
      this.isLoading = false;
    });
  }

  selectContact(id: string) {
    this.selectedContact = <Contact>this.sortedList.find(contact => contact.id === id);
  }

  openPopUp(type: string) {
    this.popUpType = type;
    this.popUp = true;
  }

  closePopUp() {
    this.popUp = false;
  }
}
