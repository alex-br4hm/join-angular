import {Component, Input, OnInit} from '@angular/core';
import { Task } from '../../../core/models/tasks';
import {SubtaskProgressPipe} from '../../../shared/utils/subtask-progress.pipe';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {PrioIconPipe} from '../../../shared/utils/prio-icon.pipe';
import {FirstLetterPipe} from '../../../shared/utils/first-letter.pipe';
import {SliceAssignedUserPipe} from '../../../shared/utils/slice-assigned-user.pipe';
import {AssignedUserOverflowPipe} from '../../../shared/utils/assigned-user-overflow.pipe';


@Component({
  selector: 'app-task-card',
  imports: [
    SubtaskProgressPipe,
    MatTooltip,
    MatIcon,
    PrioIconPipe,
    FirstLetterPipe,
    SliceAssignedUserPipe,
    AssignedUserOverflowPipe
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;

  ngOnInit() {

  }

}
