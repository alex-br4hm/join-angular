import { Pipe, PipeTransform } from '@angular/core';
import {Contact} from '../../core/models/contacts';
import {AssignedUser} from '../../core/models/tasks';

@Pipe({
  name: 'assignedUserOverflow'
})
export class AssignedUserOverflowPipe implements PipeTransform {

  transform(users: Contact[] | AssignedUser[]): string {
    return users.slice(5)
      .map(user => `${user.firstname} ${user.lastname}`)
      .join(' • ');
  }
}
