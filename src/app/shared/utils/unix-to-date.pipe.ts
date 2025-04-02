import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unixToDate'
})
export class UnixToDatePipe implements PipeTransform {

  transform(unix: number): string {
    if (!unix) return '';

    const date = new Date(unix * 1000);
    if (isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

}
