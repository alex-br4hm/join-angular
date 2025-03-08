import { Pipe, PipeTransform } from '@angular/core';
import {Contact} from '../../core/models/contacts';

@Pipe({
  name: 'sliceAssignedUser'
})
export class SliceAssignedUserPipe implements PipeTransform {

  transform(users: Contact[]): Contact[] {
    return users.slice(0, 5);
  }
}
