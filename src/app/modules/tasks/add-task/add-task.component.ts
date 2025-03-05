import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatOption, MatSelect, MatSelectTrigger} from '@angular/material/select';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FirebaseService} from '../../../core/services/firebase.service';
import {Contact} from '../../../core/models/contacts';
import {NgStyle} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {FirstLetterPipe} from "../../../shared/utils/first-letter.pipe";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-add-task',
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatError,
        MatSelect,
        MatOption,
        MatDatepickerToggle,
        MatDatepicker,
        MatDatepickerInput,
        MatNativeDateModule,
        MatInputModule,
        MatButton,
        MatIcon,
        MatSelectTrigger,
        NgStyle,
        MatTooltip,
        MatButtonToggleGroup,
        MatButtonToggle,
        FirstLetterPipe
    ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent implements OnInit {
  destroyRef: DestroyRef    = inject(DestroyRef);
  private fb: FormBuilder   = inject(FormBuilder);
  assignableUser: Contact[] = [];
  assignedUser: Contact[]   = []
  addTaskForm: FormGroup;

  constructor(private fireBase: FirebaseService,) {
    this.addTaskForm = this.fb.group({
      title:       ['', Validators.required],
      due_date:    ['', Validators.required],
      category:    ['', Validators.required],
      description: '',
      assigned_to: '',
      priority:    ''
    });
  }

  ngOnInit() {
    this.getContacts();
    this.patchStandardValues();
  }

  patchStandardValues() {
    this.addTaskForm.controls['priority'].patchValue('medium');
    this.addTaskForm.controls['category'].patchValue('technicalTask');
    this.addTaskForm.controls['due_date'].patchValue(new Date());
  }


  getContacts() {
    this.fireBase.getContacts().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.getAssignableUser(data);
        this.getAssignedUser();
      },
      error: error => {
        console.log(error);
      }
    })
  }

  getAssignedUser() {
    this.addTaskForm.get('assigned_to')?.valueChanges.subscribe((assignedValue) => {
      this.assignedUser = assignedValue.map((id: string)  => {
        return this.assignableUser.find(user => user.id === id);
      })
    });
  }

  getAssignableUser(users: any) {
    this.assignableUser = Object.values(users).map((user: any) => ({
      id:        user.id,
      firstname: user.firstname,
      lastname:  user.lastname,
      color:     user.color,
      phone:     user.phone,
      email:     user.email,
    }));
  }

  removeUserFromAssignedList(id: string) {
    this.addTaskForm.get('assigned_to')?.setValue(
      this.addTaskForm.get('assigned_to')?.value.filter((userId: string) => userId !== id)
    );
  }

  onSubmit() {
    if (this.addTaskForm.valid) {
      console.log('Formular abgeschickt:', this.addTaskForm.value);
    } else {
      console.log('Formular ungültig');
    }
  }
}
