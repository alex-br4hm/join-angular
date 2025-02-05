import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

  transform(phoneNumber: string): string {
    if (!phoneNumber) return 'add a phone number';

    phoneNumber = '+49 ' + phoneNumber.replace(/(.{3})/g, '$1 ');

    return phoneNumber;
  }
}
