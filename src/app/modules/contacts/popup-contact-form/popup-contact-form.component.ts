import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter, inject,
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
import {RandomColorService} from '../../../core/services/random-color.service';
import {DeleteDialogComponent} from '../delete-dialog/delete-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {CompareObjectsService} from '../../../core/services/compare-objects.service';

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

  dialog: MatDialog       = inject(MatDialog);
  private fb: FormBuilder = inject(FormBuilder);

  selectedContactChanged= false;
  contactForm: FormGroup;

  constructor(private firebase: FirebaseService,
              private colorService: RandomColorService,
              private compareObjectsService: CompareObjectsService) {
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
          this.selectedContactChanged = !this.compareObjectsService.compare(data, this.selectedContact);
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
    const contact: Contact = this.contactForm.value;
    contact.color = this.colorService.getColor();

    if (this.contactForm.valid) {
      this.firebase.addContact(contact);
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
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '25vw',
      minWidth: '400px'
    });

    if (this.selectedContact) {
      dialogRef.afterClosed().subscribe((result) => {
        if (result && this.selectedContact) {
          this.firebase.deleteContact(this.selectedContact.id);
          this.selectedContact = undefined;
          this.closePopUp();
        }
      });
    }
  }

  clearForm() {
    this.contactForm.reset();
  }

  closePopUp() {
    this.popUp.emit(false);
  }
}

