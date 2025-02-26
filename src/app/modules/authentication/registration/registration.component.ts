import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule, ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {Router, RouterLink} from '@angular/router';
import {MatCheckbox} from '@angular/material/checkbox';
import {AuthService} from '../../../core/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTooltip} from '@angular/material/tooltip';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password      = control.get('password')?.value;
    const passwordCheck = control.get('passwordCheck')?.value;

    return password && passwordCheck && password !== passwordCheck
      ? { passwordMismatch: true }
      : null;
  };
}

@Component({
  selector: 'app-registration',
  imports: [
    FormsModule,
    MatButton,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    MatCheckbox,
    RouterLink,
    MatError,
    MatTooltip
  ],
  templateUrl: './registration.component.html',
  styleUrls: [
    './registration.component.scss',
    '../../../../styles/auth-form.scss'
  ]
})
export class RegistrationComponent {
  fb: FormBuilder        = inject(FormBuilder);
  router: Router         = inject(Router);
  _snackBar: MatSnackBar = inject(MatSnackBar);

  registrationForm: FormGroup;
  errorMessage?: string;

  constructor(private authService: AuthService) {
    this.registrationForm = this.fb.group({
      email:          ['', [Validators.required, Validators.email]],
      firstname:      ['', Validators.required],
      lastname:       ['', Validators.required],
      password:       ['', [Validators.required, Validators.minLength(6)]],
      passwordCheck:  ['', [Validators.required, this.validateSamePassword]],
      policyAccepted: [false, Validators.requiredTrue]
    });
  }

  submitRegistration() {
    if (this.registrationForm.valid) {
      this.register();
    }
  }

  register() {
    this.authService.register(this.registrationForm.value['email'], this.registrationForm.value['password']).subscribe({
      next: ()            => console.log('Registrierung erfolgreich'),
      error: (err: Error) => {
        this.errorMessage = this.getErrorMessage(err.message);
        if (this.errorMessage) {
          this.openSnackBar(this.errorMessage);
        }

      }
    });
  }

  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
    const password      = control.parent?.get('password');
    const passwordCheck = control.parent?.get('passwordCheck');
    return password?.value == passwordCheck?.value ? null : { 'notSame': true };
  }

  testPatch() {
    this.registrationForm.patchValue({
      email:          'test@test.de',
      firstname:      'test12345',
      lastname:       'test12345',
      password:       'test12345',
      passwordCheck:  'test12345',
    })
  }

  getErrorMessage(errorMessage: string): string {
    const match: RegExpMatchArray | null = errorMessage.match(/\(auth\/([^)]+)\)/);
    const errorCode: string              = match ? `auth/${match[1]}` : '';

    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already in use. Please log in or use another email.';
      case 'auth/invalid-email':
        return 'The email address is invalid. Please check for typos.';
      case 'auth/weak-password':
        return 'Your password is too weak. Please use at least 6 characters.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, '✖', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}
