import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit, Output} from '@angular/core';
import {FirebaseService} from '../../core/services/firebase.service';
import {Contact} from '../../core/models/contacts';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgIf, NgStyle} from '@angular/common';
import {PhoneNumberPipe} from '../../shared/utils/phone-number.pipe';
import {EmailPipe} from '../../shared/utils/email.pipe';
import {PopupContactFormComponent} from './popup-contact-form/popup-contact-form.component';
import {FirstLetterPipe} from '../../shared/utils/first-letter.pipe';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatDialog} from '@angular/material/dialog';
import {DeleteDialogComponent} from './delete-dialog/delete-dialog.component';

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
})
export class ContactsComponent implements OnInit {
  @Output() popUpType!: string;
  @Output() selectedContact?: Contact;

  cdr: ChangeDetectorRef = inject(ChangeDetectorRef)
  dialog: MatDialog      = inject(MatDialog);
  destroyRef: DestroyRef = inject(DestroyRef);
  contactList: Contact[] = [];
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
    this.selectedContact = undefined;
    this.cdr.detectChanges();
    this.selectedContact = <Contact>this.sortedList.find(contact => contact.id === id);
  }

  openPopUp(type: string) {
    this.popUpType = type;
    this.popUp = true;
  }

  closePopUp() {
    this.popUp = false;
  }

  deleteContact(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '25vw',
    });

    if (this.selectedContact) {
      dialogRef.afterClosed().subscribe((result) => {
        if (result && this.selectedContact) {
          this.firebase.deleteContact(this.selectedContact.id);
          this.selectedContact = undefined;
        }
      });
    }
  }
}
