import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage   = '';
  successMessage = '';
  showPassword   = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['registered'] === '1') {
        this.successMessage = 'Account created successfully! Please sign in.';
      }
    });
  }

  get emailCtrl()    { return this.loginForm.get('email')!; }
  get passwordCtrl() { return this.loginForm.get('password')!; }

  get emailError(): string {
    if (this.emailCtrl.touched && this.emailCtrl.hasError('required')) return 'Email is required.';
    if (this.emailCtrl.touched && this.emailCtrl.hasError('email')) return 'Enter a valid email address.';
    return '';
  }

  get passwordError(): string {
    if (this.passwordCtrl.touched && this.passwordCtrl.hasError('required')) return 'Password is required.';
    return '';
  }

  togglePassword(): void { this.showPassword = !this.showPassword; }

  onSubmit(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }

    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => { this.authService.navigateAfterLogin(response.role); },
      error: (err: HttpErrorResponse | TimeoutError | unknown) => {
        if (err instanceof TimeoutError) {
          this.errorMessage = 'The server did not respond in time. Make sure the backend is running.';
          return;
        }
        const e = err as HttpErrorResponse;
        if (e.status === 0) {
          this.errorMessage = 'Cannot connect to the server. Make sure the backend is running.';
        } else if (e.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (e.status === 400) {
          const errs = e.error?.errors;
          this.errorMessage = errs ? Object.values(errs).flat().join(' ') : (e.error?.message ?? 'Validation failed.');
        } else {
          this.errorMessage = e.error?.message ?? `Unexpected error (${e.status}).`;
        }
      },
    });
  }
}
