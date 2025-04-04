import {Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
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
import {TaskDataService} from '../../../core/services/task-data.service';
import {MatDialog} from '@angular/material/dialog';
import {AssignedUser, Task} from '../../../core/models/tasks';


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
  @Input() taskState   = 'todo';
  @Input() task?: Task;

  dialog: MatDialog            = inject(MatDialog);
  destroyRef: DestroyRef       = inject(DestroyRef);
  private fb: FormBuilder      = inject(FormBuilder);

  assignableUser: Contact[]    = [];
  assignedUser: AssignedUser[] = []
  subtaskInput: FormControl    = new FormControl('');
  today: Date                  = new Date();
  addTaskForm: FormGroup;
  subtaskList: FormArray;

  constructor(private fireBase: FirebaseService,
              private taskData: TaskDataService,
              private dateFormatter: DateFormatterService,) {
    this.addTaskForm = this.fb.group({
      title:         ['', Validators.required],
      due_date:      ['', [Validators.required, this.dateValidator],],
      due_date_unix: '',
      category:      ['', Validators.required],
      description:   '',
      assigned_user: '',
      priority:      ['', Validators.required],
      subtasks:      this.fb.array([]),
      id:            ''
    });

    this.subtaskList = this.addTaskForm.get('subtasks') as FormArray;
  }

  ngOnInit() {
    this.getContacts();
    if (this.task) {
      this.patchValues();
    } else {
      this.patchStandardValues();
    }
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

  patchValues() {
    this.addTaskForm.controls['title'].patchValue(this.task?.title);
    this.addTaskForm.controls['description'].patchValue(this.task?.description);
    this.addTaskForm.controls['category'].patchValue(this.task?.category);
    this.addTaskForm.controls['priority'].patchValue(this.task?.priority);
    const dueDateAsDate = this.dateFormatter.unixToDate(this.task?.due_date_unix);
    console.log(dueDateAsDate);
    this.addTaskForm.controls['due_date'].patchValue(dueDateAsDate);
    this.addTaskForm.controls['due_date_unix'].patchValue(this.task?.due_date_unix);

    if (this.task?.assigned_user) {
      this.task.assigned_user.forEach((assignedUser: AssignedUser) => {
        this.assignedUser.push({
          color:     assignedUser.color,
          firstname: assignedUser.firstname,
          lastname:  assignedUser.lastname,
          id:        assignedUser.id,
          email:     assignedUser.email,
          phone:     assignedUser.phone
        });
      })

      this.addTaskForm.controls['assigned_user'].patchValue(this.assignedUser);
    }

    if(this.task?.subtasks) {
      this.task.subtasks.forEach(subtask => {
        this.subtaskList.push(this.fb.group({
          title: subtask.title,
          done:  subtask.isDone
        }))
      })
    }
  }

  compareUsers(user1: Contact, user2: Contact): boolean {
    return user1 && user2 ? user1.id === user2.id : user1 === user2;
  }

  saveEditedTask() {
    this.formatDate();
    this.addTaskForm.get('id')?.setValue(this.task?.id);
    this.taskData.patchTask(this.addTaskForm.value);
    this.cancelEditView();
  }

  cancelEditView() {
    this.dialog.closeAll();
  }

  clearForm() {
    this.addTaskForm.reset();
    this.patchStandardValues();
    this.subtaskList.clear();
    this.assignedUser = [];
  }

  patchStandardValues() {
    this.addTaskForm.controls['priority'].patchValue('medium');
    this.addTaskForm.controls['category'].patchValue('technical_task');
    this.addTaskForm.controls['due_date'].patchValue(this.today);
  }

  addSubtask() {
    this.subtaskList.push(this.fb.group({
      title: this.subtaskInput.value,
      done: false
    }));

    this.subtaskInput.patchValue('')
  }

  deleteSubtask(index: number) {
    this.subtaskList.removeAt(index);
  }

  getAssignableUser(users: Contact[]) {
    this.assignableUser = Object.values(users).map((user: Contact) => ({
      id:        user.id,
      firstname: user.firstname,
      lastname:  user.lastname,
      color:     user.color,
      phone:     user.phone,
      email:     user.email,
    }));
  }

  getAssignedUser() {
    this.addTaskForm.get('assigned_user')?.valueChanges.subscribe(value => {
      console.log(value);
      this.assignedUser = value;
    });
  }

  removeUserFromAssignedList(id: string) {
    this.assignedUser = this.assignedUser.filter((user: Contact) => user.id !== id);
    this.addTaskForm.get('assigned_user')?.setValue(this.assignedUser);
  }

  onSubmit() {
    if (this.addTaskForm.valid) {
      this.formatDate();
      this.taskData.addTask(this.addTaskForm.value);
      this.clearForm();
      this.dialog.closeAll();
    } else {
      console.log('Formular ungültig');
    }
  }

  formatDate() {
    const formattedDueDate = this.dateFormatter.formatDate(this.addTaskForm.get('due_date')?.value);
    this.addTaskForm.controls['due_date'].patchValue(formattedDueDate);
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const inputDate = this.addTaskForm.get('due_date')?.value;
      this.today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);

      return inputDate < this.today ? {invalidDate: true} : null;
    }
  }
}
