import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Task } from '../../../core/models/tasks';
import {MatIcon} from '@angular/material/icon';
import {PrioIconPipe} from '../../../shared/utils/prio-icon.pipe';
import {FirstLetterPipe} from '../../../shared/utils/first-letter.pipe';
import {NgStyle} from '@angular/common';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton} from '@angular/material/button';
import {MatSuffix} from '@angular/material/form-field';
import {TaskDataService} from '../../../core/services/task-data.service';
import {AddTaskComponent} from '../../tasks/add-task/add-task.component';
import {UnixToDatePipe} from '../../../shared/utils/unix-to-date.pipe';

@Component({
  selector: 'app-task-detail-view',
  imports: [
    MatIcon,
    PrioIconPipe,
    FirstLetterPipe,
    NgStyle,
    MatCheckbox,
    MatButton,
    MatSuffix,
    AddTaskComponent,
    UnixToDatePipe
  ],
  templateUrl: './task-detail-view.component.html',
  styleUrl: './task-detail-view.component.scss'
})
export class TaskDetailViewComponent {
  task!: Task;
  editTask: boolean = false;

  constructor(
    public taskDataService: TaskDataService,
    public dialogRef: MatDialogRef<TaskDetailViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task) {

    this.task = data;
  }

  closeDetailView() {
    this.dialogRef.close(true);
  }

  deleteTask(taskID: string) {
    this.taskDataService.deleteTask(taskID);
    this.closeDetailView();
  }

  openEditTask() {
    this.editTask = true;
  }

  checkSubtask(i: number) {
    if (!this.task.subtasks) return;
    this.task.subtasks[i].isDone = !this.task.subtasks[i].isDone;
    this.taskDataService.patchTask(this.task);
  }
}
