import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { getAllRoles, getRoleDisplayName } from '../../../shared/extensions/app.extensions';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  showPassword = false;
  allRoles     = getAllRoles();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/),
        ],
      ],
      phone: ['', [Validators.pattern(/^\d{10}$/)]],
      role:  ['Nurse', Validators.required],
    });
  }

  get nameCtrl()     { return this.registerForm.get('name')!; }
  get emailCtrl()    { return this.registerForm.get('email')!; }
  get passwordCtrl() { return this.registerForm.get('password')!; }
  get phoneCtrl()    { return this.registerForm.get('phone')!; }

  get nameError(): string {
    if (this.nameCtrl.touched && this.nameCtrl.hasError('required'))
      return 'Full name is required.';
    if (this.nameCtrl.touched && this.nameCtrl.hasError('maxlength'))
      return 'Name must not exceed 100 characters.';
    return '';
  }

  get emailError(): string {
    if (this.emailCtrl.touched && this.emailCtrl.hasError('required'))
      return 'Email is required.';
    if (this.emailCtrl.touched && this.emailCtrl.hasError('email'))
      return 'Enter a valid email address.';
    return '';
  }

  get passwordError(): string {
    if (this.passwordCtrl.touched && this.passwordCtrl.hasError('required'))
      return 'Password is required.';
    if (this.passwordCtrl.touched && this.passwordCtrl.hasError('pattern'))
      return 'Min 8 chars: uppercase, lowercase, digit and special character (e.g. @#$!).';
    return '';
  }

  get phoneError(): string {
    if (this.phoneCtrl.touched && this.phoneCtrl.hasError('pattern'))
      return 'Phone must be exactly 10 digits.';
    return '';
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  getRoleDisplayName(role: string): string {
    return getRoleDisplayName(role);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';

    const val = this.registerForm.value;
    this.authService.register({
      name:     val.name,
      email:    val.email,
      password: val.password,
      phone:    val.phone || undefined,
      role:     val.role,
    }).subscribe({
      next: () => {
        this.router.navigate(['/login'], { queryParams: { registered: '1' } });
      },
      error: (err: HttpErrorResponse | TimeoutError | unknown) => {
        if (err instanceof TimeoutError) {
          this.errorMessage = 'The server did not respond in time. Make sure the backend is running.';
          return;
        }
        const e = err as HttpErrorResponse;
        if (e.status === 0) {
          this.errorMessage = 'Cannot connect to the server. Make sure the backend is running.';
        } else if (e.status === 409) {
          this.errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (e.status === 400) {
          const errs = e.error?.errors;
          this.errorMessage = errs
            ? Object.values(errs).flat().join(' ')
            : (e.error?.message ?? 'Validation failed.');
        } else {
          this.errorMessage = e.error?.message ?? `Unexpected error (${e.status}).`;
        }
      },
    });
  }
}
