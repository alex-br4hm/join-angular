import {Component, Input, OnInit} from '@angular/core';
import { Task } from '../../../core/models/tasks';
import {SubtaskProgressPipe} from '../../../shared/utils/subtask-progress.pipe';
import {MatTooltip} from '@angular/material/tooltip';
import {MatIcon} from '@angular/material/icon';
import {PrioIconPipe} from '../../../shared/utils/prio-icon.pipe';


@Component({
  selector: 'app-task-card',
  imports: [
    SubtaskProgressPipe,
    MatTooltip,
    MatIcon,
    PrioIconPipe
  ],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss'
})
export class TaskCardComponent implements OnInit {
  @Input() task!: Task;

  ngOnInit() {

  }

}
