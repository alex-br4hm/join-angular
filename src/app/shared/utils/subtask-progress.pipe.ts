import { Pipe, PipeTransform } from '@angular/core';
import {Subtask} from '../../core/models/tasks';

@Pipe({
  name: 'subtaskProgress'
})
export class SubtaskProgressPipe implements PipeTransform {

  transform(subtasks: Subtask[]): number {
    let counter = 0;
    subtasks.forEach(task => {
      if (task.isDone) {
        counter++;
      }
    })

    return counter;
  }
}
