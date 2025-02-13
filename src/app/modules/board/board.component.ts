import {Component, OnInit} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatFormField} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
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
    CdkDrag
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit {
  taskList: Task[]          = [];
  todoList: Task[]          = [];
  inProgressList: Task[]    = [];
  awaitFeedbackList: Task[] = [];
  doneList: Task[]          = [];

  taskCategories: {name: string; list: Task[]}[] = []

  constructor(private firebase: FirebaseService) {}

  ngOnInit() {
    this.firebase.getTasks().pipe(
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
    console.log(this.todoList);
    this.inProgressList    = Object.values(this.taskList).filter(task => task.state === 'inprogress');
    this.awaitFeedbackList = Object.values(this.taskList).filter(task => task.state === 'awaitfeedback');
    this.doneList          = Object.values(this.taskList).filter(task => task.state === 'done');

    this.taskCategories    =   [
      { name: 'To do', list: this.todoList },
      { name: 'In Progress', list: this.inProgressList },
      { name: 'Await Feedback', list: this.awaitFeedbackList },
      { name: 'Done', list: this.doneList }
    ]
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
