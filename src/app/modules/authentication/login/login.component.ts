import {Component, DestroyRef, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {Router, RouterLink} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {AuthService} from '../../../core/services/auth.service';
import {UserService} from '../../../core/services/user.service';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Contact} from '../../../core/models/contacts';

@Component({
  selector: 'app-login',
  imports: [
    MatButton,
    ReactiveFormsModule,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatSuffix,
    RouterLink,
    MatProgressSpinner
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../../styles/auth-form.scss']
})
export class LoginComponent {
  fb: FormBuilder        = inject(FormBuilder);
  router: Router         = inject(Router);
  destroyRef: DestroyRef = inject(DestroyRef);
  loginSuccess: boolean  = false;
  loginFailed: boolean   = false;
  hidePassword: boolean  = true;
  contactList: Contact[] = [];
  activeUser?: Contact;
  loginForm: FormGroup;

  constructor(private authService: AuthService,
              private userService: UserService,) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    })
  }

  submitLogin() {
    if (this.loginForm.valid) {
      this.login();
    }
  }

  login() {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (data) => {
          this.loginSucceeded();
          this.setActiveUser(data.user.email);
      },
      error: (err) => this.loginFailed = true,
    });
  }

  setActiveUser(email: string) {
    this.userService.setActiveUserEmail(email);
    this.userService.contacts$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(contacts => {
        this.contactList = contacts;
        console.log(contacts);
        this.userService.getActiveUser(contacts);
      });
  }

  loginSucceeded() {
    this.loginSuccess = true;
    setTimeout(() => {
      this.router.navigate(['/summary']);
    }, 1000)
  }

  guestLogin() {
    this.loginForm.patchValue({
      email: 'guest@guest.de',
      password: '($JPV&E!J>6j5T:j'
    })

    this.login();
  }
}
