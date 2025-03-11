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
}
