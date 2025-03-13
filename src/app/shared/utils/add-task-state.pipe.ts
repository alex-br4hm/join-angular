import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addTaskState'
})
export class AddTaskStatePipe implements PipeTransform {

  transform(state: string): string {
    switch (state) {
      case 'todo':          return 'To do'
      case 'inprogress':    return 'In progress'
      case 'awaitfeedback': return 'Await feedback'
      default:              return ''
    }
  }

}
