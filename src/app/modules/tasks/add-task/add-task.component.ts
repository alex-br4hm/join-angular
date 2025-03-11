import {Component, DestroyRef, Inject, inject, Input, OnInit} from '@angular/core';
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
import {SliceAssignedUserPipe} from '../../../shared/utils/slice-assigned-user.pipe';
import {AssignedUserOverflowPipe} from '../../../shared/utils/assigned-user-overflow.pipe';
import {MatChip} from '@angular/material/chips';
import {TaskDataService} from '../../../core/services/task-data.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AddTaskDialogComponent} from '../../board/add-task-dialog/add-task-dialog.component';

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
    MatIcon,
    SliceAssignedUserPipe,
    AssignedUserOverflowPipe,
    MatChip,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    provideMomentDateAdapter(),
  ],
})
export class AddTaskComponent implements OnInit {
  dialog: MatDialog          = inject(MatDialog);
  @Input() taskState: string = 'todo';
  destroyRef: DestroyRef     = inject(DestroyRef);
  private fb: FormBuilder    = inject(FormBuilder);
  assignableUser: Contact[]  = [];
  assignedUser: Contact[]    = [];
  subtaskInput: FormControl  = new FormControl('');
  today: Date                = new Date();
  addTaskForm: FormGroup;
  subtaskList: FormArray;


  constructor(private fireBase: FirebaseService,
              private taskData: TaskDataService,
              private dateFormatter: DateFormatterService,) {
    this.addTaskForm = this.fb.group({
      title:       ['', Validators.required],
      due_date:    ['', [Validators.required, this.dateValidator],],
      category:    ['', Validators.required],
      description: '',
      assigned_to: '',
      priority:    ['', Validators.required],
      subtasks:    this.fb.array([]),
    });

    this.subtaskList = this.addTaskForm.get('subtasks') as FormArray;
  }

  ngOnInit() {
    this.getContacts();
    this.patchStandardValues();
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
      name: this.subtaskInput.value,
      done: false
    }));

    this.subtaskInput.patchValue('')
  }

  deleteSubtask(index: number) {
    this.subtaskList.removeAt(index);
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
      if (!assignedValue) return;
      this.assignedUser = assignedValue.map((id: string)  => {
        return this.assignableUser.find(user => user.id === id);
      })
    });
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

  removeUserFromAssignedList(id: string) {
    this.addTaskForm.get('assigned_to')?.setValue(
      this.addTaskForm.get('assigned_to')?.value.filter((userId: string) => userId !== id)
    );
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
