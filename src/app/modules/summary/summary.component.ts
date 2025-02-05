import {Component, OnInit} from '@angular/core';
import {FirebaseService} from '../../core/services/firebase.service';
import { Task } from '../../core/models/tasks';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-summary',
  imports: [
    MatIcon,
    RouterLink,
    MatProgressSpinner
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {
  taskList!: Task[];
  todoCount: number     = 0;
  doneCount: number     = 0;
  awaitCount: number    = 0;
  progressCount: number = 0;
  urgentCount: number   = 0;
  tasksCount: number    = 0;
  actualUser: string    = 'Alex Haehnlein';
  isLoading: boolean    = true;

  constructor(private firebase: FirebaseService) {
  }

  ngOnInit() {
    this.firebase.getTasks().pipe(
    ).subscribe({
      next: data => {
        this.taskList = data;
        this.countValues();
      },
      error: error => {
        console.log(error);
      }
    })
  }

  countValues() {
    Object.values(this.taskList).forEach(task => {

      if (task.state === 'todo')          this.todoCount++;
      if (task.state === 'inprogress')    this.progressCount++;
      if (task.state === 'awaitfeedback') this.awaitCount++;
      if (task.state === 'done')          this.doneCount++;
      if (task.state)                     this.tasksCount++;
      if (task.priority === 'high')       this.urgentCount++;

      if (this.tasksCount === Object.values(this.taskList).length) {
        this.isLoading = false;
      }
    });
  }
}
