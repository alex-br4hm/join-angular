import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {FirebaseService} from '../../core/services/firebase.service';
import {Task, TaskCategories} from '../../core/models/tasks';
import {TaskCardComponent} from './task-card/task-card.component';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import {NgClass} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AddTaskComponent} from '../tasks/add-task/add-task.component';
import {MatDialog} from '@angular/material/dialog';
import {AddTaskDialogComponent} from './add-task-dialog/add-task-dialog.component';
import {TaskDataService} from '../../core/services/task-data.service';
import {TaskDetailViewComponent} from './task-detail-view/task-detail-view.component';
import {Contact} from '../../core/models/contacts';

@Component({
  selector: 'app-board',
  imports: [
    MatButton,
    MatIcon,
    MatFormField,
    FormsModule,
    MatInput,
    MatIconButton,
    TaskCardComponent,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    ReactiveFormsModule,
    NgClass,
    MatTooltip,
    AddTaskComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {
  dialog: MatDialog         = inject(MatDialog);
  destroyRef: DestroyRef    = inject(DestroyRef);
  taskList: Task[]          = [];
  todoList: Task[]          = [];
  inProgressList: Task[]    = [];
  awaitFeedbackList: Task[] = [];
  doneList: Task[]          = [];

  taskCategories: TaskCategories[] = []

  searchFormControl: FormControl<string> = new FormControl();
  searchInput: string                    = "";

  originalTodoList: Task[]           = [];
  originalInProgressList: Task[]     = [];
  originalAwaitFeedbackList: Task[]  = [];
  originalDoneList: Task[]           = [];

  addTaskPopUp: boolean = false;

  tasksCount: number = 0;

  contactList: Contact[]  = [];

  constructor(private firebase: FirebaseService,
              private taskData: TaskDataService,) {}

  ngOnInit() {
    this.getTasks();
    this.getContacts();
    this.getSearchInput();
  }

  getTasks() {
    this.firebase.getTasks().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        if (data) {
          this.taskList   = Object.values(data);
          this.tasksCount = Object.values(this.taskList).length;
          this.sortTasks();
        }
      },
      error: error => {
        console.log(error);
      }
    })
  }

  /**
   * need contacts to check if assigned user in tasks is contact
   * if not => the contact will be deleted as assigned user
   * */
  getContacts() {
    this.firebase.getContacts().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        if (data) {
          this.contactList = Object.values(data);
          this.compareContactsWithAssignedUser();
        }
      },
      error: error => {
        console.log(error);
      }
    })
  }

  compareContactsWithAssignedUser() {
    this.taskList.forEach(task => {
      if (Array.isArray(task.assigned_user)) {
        task.assigned_user = task.assigned_user.filter(user =>
          this.contactList.some(contact => contact.id === user.id)
        );
      }

      this.taskData.patchTask(task);
    });

    this.sortTasks();
  }

  sortTasks() {
    this.todoList          = this.taskList.filter(task => task.state === 'todo');
    this.inProgressList    = this.taskList.filter(task => task.state === 'inprogress');
    this.awaitFeedbackList = this.taskList.filter(task => task.state === 'awaitfeedback');
    this.doneList          = this.taskList.filter(task => task.state === 'done');

    this.originalTodoList          = this.todoList;
    this.originalInProgressList    = this.inProgressList;
    this.originalAwaitFeedbackList = this.awaitFeedbackList;
    this.originalDoneList          = this.doneList;

    this.taskCategories    = [
      { name: 'To do',
        state: 'todo',
        list: this.todoList },
      { name: 'In Progress',
        state: 'inprogress',
        list: this.inProgressList },
      { name: 'Await Feedback',
        state: 'awaitfeedback',
        list: this.awaitFeedbackList },
      { name: 'Done',
        state: 'done',
        list: this.doneList }
    ];
  }

  getSearchInput() {
    this.searchFormControl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.searchInput = value.toLowerCase();
      this.searchTask();
    });
  }

  searchTask() {
    this.todoList          = this.originalTodoList.filter(task => task.title.toLowerCase().includes(this.searchInput));
    this.inProgressList    = this.originalInProgressList.filter(task => task.title.toLowerCase().includes(this.searchInput));
    this.awaitFeedbackList = this.originalAwaitFeedbackList.filter(task => task.title.toLowerCase().includes(this.searchInput));
    this.doneList          = this.originalDoneList.filter(task => task.title.toLowerCase().includes(this.searchInput));

    this.taskCategories    = [
      { name: 'To do',
        state: 'todo',
        list: this.todoList },
      { name: 'In Progress',
        state: 'inprogress',
        list: this.inProgressList },
      { name: 'Await Feedback',
        state: 'awaitfeedback',
        list: this.awaitFeedbackList },
      { name: 'Done',
        state: 'done',
        list: this.doneList }
    ];
  }

  clearInput() {
    this.searchFormControl.setValue('');
  }

  drop(event: CdkDragDrop<Task[]>, state: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      this.moveItemInDB(task, state);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  moveItemInDB(task: Task, state: string) {
    task.state = state;
    this.taskData.patchTask(task);
  }

  openAddTask(state: string) {
    this.taskData.taskState = state;

    this.dialog.open(AddTaskDialogComponent, {
      panelClass: 'full-screen-dialog',
      data: state
    });
  }

  openDetailView(task: Task) {
    this.dialog.open(TaskDetailViewComponent, {
      panelClass: 'full-screen-dialog',
      data: task
    });
  }
}
