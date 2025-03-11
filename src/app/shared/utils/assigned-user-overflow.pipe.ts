import { Pipe, PipeTransform } from '@angular/core';
import {Contact} from '../../core/models/contacts';

@Pipe({
  name: 'assignedUserOverflow'
})
export class AssignedUserOverflowPipe implements PipeTransform {

  transform(users: Contact[]): string {
    return users.slice(5)
      .map(user => `${user.firstname} ${user.lastname}`)
      .join(' • ');
  }

}
