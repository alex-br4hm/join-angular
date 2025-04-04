import {Component, inject, Input, OnInit} from '@angular/core';
import { Task } from '../../../core/models/tasks';
import {TaskDataService} from '../../../core/services/task-data.service';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';

@Component({
  selector: 'app-edit-task',
  imports: [
    ReactiveFormsModule,
    MatError,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix
  ],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss'
})
export class EditTaskComponent implements OnInit{
  @Input() task!: Task;

  fb: FormBuilder = inject(FormBuilder);

  editTaskForm!: FormGroup;
  today: Date = new Date();

  constructor (private taskDataService: TaskDataService) {
  }

  ngOnInit() {
    console.log(this.task);
    this.editTaskForm = this.fb.group({
      title:    [this.task.title, Validators.required],
      due_date: ['12-10-2025', Validators.required],
    })
  }
}
