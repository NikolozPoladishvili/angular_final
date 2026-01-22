import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to TaskMaster</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              [class.error]="submitted && f['email'].errors"
              placeholder="Enter your email"
            />
            <div *ngIf="submitted && f['email'].errors" class="error-message">
              <span *ngIf="f['email'].errors['required']">Email is required</span>
              <span *ngIf="f['email'].errors['email']">Invalid email format</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              [class.error]="submitted && f['password'].errors"
              placeholder="Enter your password"
            />
            <div *ngIf="submitted && f['password'].errors" class="error-message">
              <span *ngIf="f['password'].errors['required']">Password is required</span>
            </div>
          </div>

          <div *ngIf="error" class="alert alert-danger">
            {{ error }}
          </div>

          <button type="submit" class="btn-primary" [disabled]="loading">
            <span *ngIf="!loading">Sign In</span>
            <span *ngIf="loading">Signing in...</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .auth-card {
      background: white;
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 450px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .auth-header h1 {
      font-size: 32px;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 8px;
    }

    .auth-header p {
      color: #718096;
      font-size: 16px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 8px;
      font-size: 14px;
    }

    .form-group input {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 10px;
      font-size: 16px;
      transition: all 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-group input.error {
      border-color: #f56565;
    }

    .error-message {
      color: #f56565;
      font-size: 13px;
      margin-top: 6px;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .alert-danger {
      background: #fed7d7;
      color: #c53030;
      border: 1px solid #fc8181;
    }

    .btn-primary {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .auth-footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .auth-footer p {
      color: #718096;
      font-size: 14px;
    }

    .auth-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  returnUrl: string = '/dashboard';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: () => {
          this.router.navigate([this.returnUrl]);
        },
        error: (error) => {
          this.error = error.error?.message || 'Login failed. Please try again.';
          this.loading = false;
        }
      });
  }
}
