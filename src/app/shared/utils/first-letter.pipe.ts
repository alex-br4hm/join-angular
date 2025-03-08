import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstLetter'
})
export class FirstLetterPipe implements PipeTransform {

  transform(name: string): string {

    return name.toUpperCase().charAt(0);
  }

}
