import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'email'
})
export class EmailPipe implements PipeTransform {

  transform(email: string): string {
    if (!email) return 'add a email address';

    return email;
  }
}
