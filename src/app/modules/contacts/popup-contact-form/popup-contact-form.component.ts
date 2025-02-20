import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {Contact} from '../../../core/models/contacts';
import {NgStyle} from '@angular/common';
import {FirebaseService} from '../../../core/services/firebase.service';
import {FirstLetterPipe} from '../../../shared/utils/first-letter.pipe';

@Component({
  selector: 'app-popup-contact-form',
  imports: [
    MatIcon,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    MatButton,
    MatError,
    NgStyle,
    FirstLetterPipe
  ],
  templateUrl: './popup-contact-form.component.html',
  styleUrl: './popup-contact-form.component.scss'
})
export class PopupContactFormComponent implements OnInit, AfterViewInit{
  @Output() popUp = new EventEmitter<boolean>();
  @Input() type!: string;
  @Input() selectedContact?: Contact;
  @ViewChild('successBtn', { static: false }) successBtn!: ElementRef<HTMLButtonElement>;
  selectedContactChanged: boolean = false;
  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private firebase: FirebaseService) {
    this.contactForm = this.fb.group({
      id:        '',
      firstname: ['', Validators.required],
      lastname:  ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      color:     '',
      phone:     ['', Validators.pattern("[0-9 ]{6,15}")],
    });

  }

  ngOnInit() {
    if(this.type === "Edit") {
      this.patchValues();
      this.contactForm.valueChanges.subscribe({
        next: data => {
          this.selectedContactChanged = !this.deepCompare(data, this.selectedContact);
        }
      })
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.successBtn) {
        this.successBtn.nativeElement.focus();
      }
    }, 500);
  }

  patchValues() {
    if (!this.selectedContact) return;

    this.contactForm.patchValue({
      id:        this.selectedContact.id,
      firstname: this.selectedContact.firstname,
      lastname:  this.selectedContact.lastname,
      email:     this.selectedContact.email,
      color:     this.selectedContact.color,
      phone:     this.selectedContact?.phone,
    })
  }

  addContact() {
    if (this.contactForm.valid) {
      this.firebase.addContact(this.contactForm.value);
      this.clearForm();
      this.closePopUp();
    }
  }

  get email() {
    return this.contactForm.get('email');
  }

  editContact() {
    if (this.contactForm.valid && this.selectedContactChanged) {
      this.firebase.editContact(this.contactForm.value);
      this.closePopUp();
    }
  }

  deleteContact(): void {
    if (window.confirm("Möchtest du den Kontakt wirklich löschen?") && this.selectedContact) {
      this.firebase.deleteContact(this.selectedContact.id);
      this.closePopUp();
    }
  }

  clearForm() {
    console.log('cleared!')
    this.contactForm.reset();
  }

  closePopUp() {
    this.popUp.emit(false);
  }

  /**
   * Maybe later in a service? Maybe pipe?
   * A pipe to compare two objects deeply, nice
   * lets think about it.
   * */
  deepCompare(obj1: any, obj2: any): boolean {
    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();

    if (keys1.length !== keys2.length) return false;

    return keys1.every(key => obj1[key] === obj2[key]);
  }

}

