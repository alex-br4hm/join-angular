import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatterService {

  constructor() { }

  formatDate(date: Date) {
    const formatter = new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    return formatter.format(date).replaceAll('.', '/');
  }

  formatToDate(date: string | undefined): Date {
    let dateParts: string[] | number[] | undefined = date?.split('/');
    dateParts = dateParts?.map((part) => Number(part));

    if (dateParts) {
      return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    }

    return new Date();
  }

  unixToDate(unix: number | undefined): Date {
    if (!unix) return new Date();
    return new Date(unix * 1000);
  }
}
