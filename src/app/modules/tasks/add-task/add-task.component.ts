import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatOption, MatSelect, MatSelectTrigger} from '@angular/material/select';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE, MatNativeDateModule} from '@angular/material/core';
import {MatButton} from '@angular/material/button';
import {FirebaseService} from '../../../core/services/firebase.service';
import {Contact} from '../../../core/models/contacts';
import {NgStyle} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {FirstLetterPipe} from "../../../shared/utils/first-letter.pipe";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import 'moment/locale/de';
import {DateFormatterService} from '../../../core/services/date-formatter.service';
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
    MatButton,
    MatSelectTrigger,
    NgStyle,
    MatTooltip,
    MatButtonToggleGroup,
    MatButtonToggle,
    FirstLetterPipe,
    MatIcon
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    provideMomentDateAdapter(),
  ],
})
export class AddTaskComponent implements OnInit {
  destroyRef: DestroyRef    = inject(DestroyRef);
  private fb: FormBuilder   = inject(FormBuilder);
  assignableUser: Contact[] = [];
  assignedUser: Contact[]   = []
  addTaskForm: FormGroup;
  subtaskInput: string      = '';

  constructor(private fireBase: FirebaseService, private dateFormatter: DateFormatterService) {
    this.addTaskForm = this.fb.group({
      title:       ['', Validators.required],
      due_date:    ['', [Validators.required],],
      category:    ['', Validators.required],
      description: '',
      assigned_to: '',
      priority:    ['', Validators.required],
      subtasks:    this.fb.array([]),
    });
  }

  ngOnInit() {
    this.getContacts();
    this.patchStandardValues();
  }

  clearForm() {
    this.addTaskForm.reset();
  }

  patchStandardValues() {
    this.addTaskForm.controls['priority'].patchValue('medium');
    this.addTaskForm.controls['category'].patchValue('technicalTask');
    this.addTaskForm.controls['due_date'].patchValue(new Date());
  }

  addSubtask() {
    const subtasks = this.addTaskForm.get('subtasks') as FormArray;
    subtasks.push(this.fb.group({
      name: this.subtaskInput,
      done: false
    }));

    this.subtaskInput = '';
  }

  get subtasks(): FormArray {
    return this.addTaskForm.get('subtasks') as FormArray;
  }

  deleteSubtask(index: number) {
    this.subtasks.removeAt(index);
  }

  onSubtaskInput(event: Event) {
    this.subtaskInput = (event.target as HTMLInputElement).value;
    console.log(this.subtaskInput);
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
      this.formatDate();
      console.log('Formular abgeschickt:', this.addTaskForm.value);
    } else {
      console.log('Formular ungültig');
    }
  }

  formatDate() {
    const formattedDueDate = this.dateFormatter.formatDate(this.addTaskForm.get('due_date')?.value);
    this.addTaskForm.controls['due_date'].patchValue(formattedDueDate);
  }
}
