import {ChangeDetectorRef, Component, DestroyRef, Inject, inject, Input, OnInit} from '@angular/core';
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
    MatIcon,
    SliceAssignedUserPipe,
    AssignedUserOverflowPipe,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    provideMomentDateAdapter(),
  ],
})
export class AddTaskComponent implements OnInit {
  @Input() taskState: string = 'todo';
  @Input() task?: Task;
  dialog: MatDialog          = inject(MatDialog);
  destroyRef: DestroyRef     = inject(DestroyRef);
  private fb: FormBuilder    = inject(FormBuilder);
  assignableUser: Contact[]  = [];
  assignedUser: AssignedUser[] = []
  subtaskInput: FormControl  = new FormControl('');
  today: Date                = new Date();
  addTaskForm: FormGroup;
  subtaskList: FormArray;
  assignedUserList: FormArray;

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
    });

    this.subtaskList      = this.addTaskForm.get('subtasks') as FormArray;
    this.assignedUserList = this.addTaskForm.get('assigned_user') as FormArray;
  }

  ngOnInit() {
    this.getContacts();
    console.log(this.task);
    if (this.task) {
      this.patchValues();
      console.log('here?')
    } else {
      this.patchStandardValues();
    }
  }

  patchValues() {
    this.addTaskForm.controls['title'].patchValue(this.task?.title);
    this.addTaskForm.controls['description'].patchValue(this.task?.description);
    this.addTaskForm.controls['category'].patchValue(this.task?.category);
    this.addTaskForm.controls['priority'].patchValue(this.task?.priority);
    if (this.task?.assigned_user) {
      this.task.assigned_user.forEach((assignedUser: AssignedUser) => {
        this.assignedUserList.push(this.fb.group({
          color:     assignedUser.color,
          firstname: assignedUser.firstname,
          lastname:  assignedUser.lastname,
          id:        assignedUser.id,
          email:     assignedUser.email,
          phone:     assignedUser.phone
        }));
      })


      console.log( this.assignedUserList.value);
      console.log(this.addTaskForm.get('assigned_user')?.value)
    }

    if(this.task?.subtasks) {
      this.task.subtasks.forEach(subtask => {
        this.subtaskList.push(this.fb.group({
          title: subtask.title,
          done: subtask.isDone
        }))
      })
    }
  }


  saveEditedTask() {
    this.taskData.patchTask(this.addTaskForm.value);
  }

  cancelEditView() {
    this.dialog.closeAll();
  }

  addAssignedUser(assignedUser: Contact) {
    this.assignedUserList.push(this.fb.group({
      color:     assignedUser.color,
      firstname: assignedUser.firstname,
      lastname:  assignedUser.lastname,
      id:        assignedUser.id,
      email:     assignedUser.email,
      phone:     assignedUser.phone
    }))
  }

  test(user: any) {
    this.assignedUserList.value.forEach((assignedUser: AssignedUser) => {
      console.log(assignedUser);
    })
  }

  testClick(userID: any) {
    console.log(userID);
    this.assignedUserList.setValue(
      this.assignedUserList.value.filter((userId: string) => userId !== userID)
    )
  }

  clearForm() {
    this.addTaskForm.reset();
    this.patchStandardValues();
    this.subtaskList.clear();
    this.assignedUser = [];
    this.assignedUserList.clear();
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
    this.addTaskForm.get('assigned_user')?.valueChanges.subscribe((assignedValue) => {
      console.log(assignedValue);
      if (!assignedValue) return;

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

    console.log('ASSIGNABLE:', this.assignableUser);
  }

  removeUserFromAssignedList(id: string) {
    console.log(id);
    this.addTaskForm.get('assigned_user')?.setValue(
      this.addTaskForm.get('assigned_user')?.value.filter((userId: string) => userId !== id)
    );
  }



  onSubmit() {
    if (this.addTaskForm.valid) {
      this.formatDate();
      this.addTaskForm.get('assigned_user')?.setValue(this.assignedUserList.value);
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
