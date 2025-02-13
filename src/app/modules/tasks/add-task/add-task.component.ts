import {Component, OnInit} from '@angular/core';
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
    MatButtonToggle
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent implements OnInit {
  addTaskForm: FormGroup;
  assignableUser: Contact[] = [];
  assignedUser: Contact[] = []

  constructor(
    private fb: FormBuilder,
    private fireBase: FirebaseService,) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      due_date: ['', Validators.required],
      category: ['', Validators.required],
      description: '',
      assigned_to: '',
      priority: 'medium'
    });
  }

  ngOnInit() {
    this.fireBase.getUsers().pipe(
    ).subscribe({
      next: data => {
        this.getAssignableUser(data);
      },
      error: error => {
        console.log(error);
      }
    })

    this.addTaskForm.get('assigned_to')?.valueChanges.subscribe((assignedValue) => {
      this.assignedUser = assignedValue.map((id: number)  => {
        return this.assignableUser.find(user => user.id === id);
      })
    });
  }

  getAssignableUser(users: any) {
    this.assignableUser = Object.values(users).map((user: any) => ({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      color: user.color,
      phone: user.phone,
      email: user.email,
    }));
  }


  removeUserFromAssignedList(id: number) {
    this.addTaskForm.get('assigned_to')?.setValue(
      this.addTaskForm.get('assigned_to')?.value.filter((userId: number) => userId !== id)
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
