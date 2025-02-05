import {Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../core/services/firebase.service';
import {Contact} from '../../core/models/contacts';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-contacts',
  imports: [
    MatButton,
    MatIcon
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  contactList!: Contact[];
  sortedList: any[] = [
    {
      surname: "John",
      lastName: "Doe",
    },
    {
      surname: "Henry",
      lastName: "Doe",
    },
    {
      surname: "Alames",
      lastName: "Doe",
    }
  ];

  constructor(private firebase: FirebaseService) {}

  ngOnInit() {
    this.firebase.getContacts().pipe(
    ).subscribe({
      next: data => {
        this.contactList = data;
        console.log(this.contactList);
      },
      error: error => {
        console.log(error);
      }
    })
  }
}
