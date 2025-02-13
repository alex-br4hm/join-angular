import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prioIcon'
})
export class PrioIconPipe implements PipeTransform {

  transform(prio: string): string {
    if (prio === 'high') {
      return 'keyboard_double_arrow_right';
    } else if (prio === 'medium') {
      return '||';
    } else return 'keyboard_double_arrow_right';
  }
}
