import { Pipe, PipeTransform } from '@angular/core';
import {Contact} from '../../core/models/contacts';
import {AssignedUser} from '../../core/models/tasks';


@Pipe({
  name: 'sliceAssignedUser'
})
export class SliceAssignedUserPipe implements PipeTransform {

  transform(users: Contact[] | AssignedUser[]): Contact[] | AssignedUser[] {
    return users.slice(0, 5);
  }
}
