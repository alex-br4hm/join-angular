import {Component, DestroyRef, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
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
import {FirebaseService} from '../../../core/services/firebase.service';
import {Contact} from '../../../core/models/contacts';
import {RandomColorService} from '../../../core/services/random-color.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

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
    MatTooltip,
    MatProgressSpinner
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
  destroyRef: DestroyRef = inject(DestroyRef);
  registrationForm: FormGroup;
  errorMessage?: string;
  contact?: Contact;
  registerSuccess: boolean = false;

  constructor(private authService: AuthService,
              private firebase: FirebaseService,
              private colorService: RandomColorService) {
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

  /**
   * Registers the user using the provided email and password.
   * Handles success and error cases.
   */
  register() {
    this.authService.register(this.registrationForm.value['email'], this.registrationForm.value['password'])
      .subscribe({
        next: ()            => this.registerSucceeded(),
        error: (err: Error) => {
          this.errorMessage = this.getErrorMessage(err.message);
          if (this.errorMessage) {
            this.openSnackBar(this.errorMessage);
          }
        }
    });
  }

  /**
   * Called after successful registration.
   * Converts the form data into a contact to push the contact to DB.
   * Triggers login.
   */
  registerSucceeded() {
    this.convertContact();
    this.registerSuccess = true;
    setTimeout(() => {
      this.login();
    }, 1000)
  }

  /**
   * Logs the user in automatically after registration.
   * Navigates to the summary page on success.
   */
  login() {
    this.authService.login(this.registrationForm.value.email, this.registrationForm.value.password).subscribe({
      next: (data) => {
        this.router.navigate(['/summary']);
      },
      error: (err) => console.log(err),
    });
  }

  /**
   * DELETE LATER, JUST FOR TESTING
   * */
  testPatch() {
    this.registrationForm.patchValue({
      email:          'test@test.de',
      firstname:      'test12345',
      lastname:       'test12345',
      password:       'test12345',
      passwordCheck:  'test12345',
    })
  }

  /**
   * Converts the registration form data into a contact object.
   * Stores the contact in the database.
   */
  convertContact() {
    this.contact = {
      color:     this.colorService.getColor(),
      email:     this.registrationForm.value.email,
      firstname: this.capitalize(this.registrationForm.value.firstname),
      lastname:  this.capitalize(this.registrationForm.value.lastname),
      id:        '',
      phone:     ''
    }

    if (this.contact) {
      this.firebase.addContact(this.contact);
    }
  }

  capitalize(name: string): string {
    if (!name) return '';
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  }

  /**
   * Opens a snackbar to show an error message.
   * @param message The message to display.
   *
   * Maybe later in a service?
   */
  openSnackBar(message: string) {
    this._snackBar.open(message, '✖', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Maps Firebase auth error codes to user-friendly messages.
   * @param errorMessage Raw error message from Firebase.
   * @returns User-friendly error message.
   */
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

  /**
   * Validator to check if password and passwordCheck fields match.
   * @param control The form control to validate.
   * @returns Validation error if passwords do not match, otherwise null.
   */
  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
    const password      = control.parent?.get('password');
    const passwordCheck = control.parent?.get('passwordCheck');
    return password?.value == passwordCheck?.value ? null : { 'notSame': true };
  }
}
