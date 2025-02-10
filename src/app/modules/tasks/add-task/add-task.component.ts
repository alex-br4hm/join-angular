import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

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
    MatRadioGroup,
    MatRadioButton,
    MatButton,
    MatIcon
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})
export class AddTaskComponent {
  addTaskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      due_date: ['', Validators.required],
      category: ['', Validators.required],
      description: '',
      assigned_to: '',
      priority: ''
    });
  }

  onSubmit() {
    if (this.addTaskForm.valid) {
      console.log('Formular abgeschickt:', this.addTaskForm.value);
    } else {
      console.log('Formular ungültig');
    }
  }
}
