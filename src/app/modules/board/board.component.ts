import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField} from '@angular/material/form-field';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {FirebaseService} from '../../core/services/firebase.service';
import { Task } from '../../core/models/tasks';
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
  destroyRef: DestroyRef    = inject(DestroyRef);
  taskList: Task[]          = [];
  todoList: Task[]          = [];
  inProgressList: Task[]    = [];
  awaitFeedbackList: Task[] = [];
  doneList: Task[]          = [];

  taskCategories: {name: string; list: Task[]}[] = []

  searchFormControl: FormControl<string> = new FormControl();
  searchInput: string = "";

  originalTodoList: Task[]           = [];
  originalInProgressList: Task[]     = [];
  originalAwaitFeedbackList: Task[]  = [];
  originalDoneList: Task[]           = [];

  addTaskPopUp: boolean = false;

  constructor(private firebase: FirebaseService) {}

  ngOnInit() {
    this.getTasks();
    this.getSearchInput();
  }

  getTasks() {
    this.firebase.getTasks().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.taskList = data;
        this.sortTasks();
      },
      error: error => {
        console.log(error);
      }
    })
  }

  sortTasks() {
    this.todoList          = Object.values(this.taskList).filter(task => task.state === 'todo');
    this.inProgressList    = Object.values(this.taskList).filter(task => task.state === 'inprogress');
    this.awaitFeedbackList = Object.values(this.taskList).filter(task => task.state === 'awaitfeedback');
    this.doneList          = Object.values(this.taskList).filter(task => task.state === 'done');

    this.originalTodoList = this.todoList;
    this.originalInProgressList = this.inProgressList;
    this.originalAwaitFeedbackList = this.awaitFeedbackList;
    this.originalDoneList = this.doneList;

    this.taskCategories    =   [
      { name: 'To do', list: this.todoList },
      { name: 'In Progress', list: this.inProgressList },
      { name: 'Await Feedback', list: this.awaitFeedbackList },
      { name: 'Done', list: this.doneList }
    ]
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

    this.taskCategories = [
      { name: 'To do', list: this.todoList },
      { name: 'In Progress', list: this.inProgressList },
      { name: 'Await Feedback', list: this.awaitFeedbackList },
      { name: 'Done', list: this.doneList }
    ];
  }

  clearInput() {
    this.searchFormControl.setValue('');
  }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
