import {Component, inject} from '@angular/core';
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
  fb: FormBuilder       = inject(FormBuilder);
  router: Router        = inject(Router);
  loginSuccess: boolean = false;
  loginFailed: boolean  = false;
  hidePassword: boolean = true;
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
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (data)           => {
          this.loginSucceeded();
          this.userService.setActiveUserEmail(data.user.email);
      },
      error: (err) => this.loginFailed = true,
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
