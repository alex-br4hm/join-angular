import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit, Signal, signal} from '@angular/core';
import {FirebaseService} from '../../core/services/firebase.service';
import { Task } from '../../core/models/tasks';
import {MatIcon} from '@angular/material/icon';
import {Router, RouterLink} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {UserService} from '../../core/services/user.service';
import {Contact} from '../../core/models/contacts';
import {AuthService} from '../../core/services/auth.service';

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
  destroyRef: DestroyRef = inject(DestroyRef);
  router: Router         = inject(Router);
  todoCount: number      = 0;
  doneCount: number      = 0;
  awaitCount: number     = 0;
  progressCount: number  = 0;
  urgentCount: number    = 0;
  tasksCount: number     = 0;
  isLoading: boolean     = true;
  welcomeMessage: string = '';
  nextDeadline: string   = '';
  taskList!: Task[];

  constructor(private firebase: FirebaseService,
              protected userService: UserService) {
  }

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this.firebase.getTasks().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: data => {
        this.taskList = data;
        this.countValues();
        this.setWelcomeMessage();
        this.setUpcomingDeadline();
      },
      error: error => {
        console.log(error);
      }
    })
  }

  /**
   * Counts the number of tasks in different states and categories
   * to display correct data in summary overview.
   */
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

  /**
   * Sets the correct welcome message based on the current time of day.
   */
  setWelcomeMessage() {
    const hour: number = new Date().getHours();

    switch (true) {
      case (hour >= 5 && hour < 12):
        this.welcomeMessage = 'Good morning';
        break;
      case (hour >= 12 && hour < 17):
        this.welcomeMessage = 'Good afternoon';
        break;
      default:
        this.welcomeMessage = 'Good evening';
    }
  }

  /**
   * Sets the next deadline based on the earliest due date in the task list.
   */
  setUpcomingDeadline() {
    const taskListValues: Task[]    = Object.values(this.taskList);
    const lowestTimestamp: number   = Math.min(...taskListValues.map(task => task.due_date_unix));

    const date        = new Date(lowestTimestamp * 1000);
    this.nextDeadline = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
