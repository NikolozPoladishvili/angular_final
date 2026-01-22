import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-page">
      <div class="profile-header">
        <div class="avatar">
          <span>{{ getInitials() }}</span>
        </div>
        <div class="user-info">
          <h1>{{ currentUser?.name }}</h1>
          <p>{{ currentUser?.email }}</p>
          <span class="role-badge">{{ currentUser?.role }}</span>
        </div>
      </div>

      <div class="profile-content">
        <div class="stats-section">
          <h2>Your Statistics</h2>
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-icon total">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </div>
              <div class="stat-info">
                <h3>{{ userStats.total }}</h3>
                <p>Total Tasks</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon completed">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div class="stat-info">
                <h3>{{ userStats.completed }}</h3>
                <p>Completed</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon pending">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div class="stat-info">
                <h3>{{ userStats.pending }}</h3>
                <p>Pending</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon progress">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="2" x2="12" y2="6"></line>
                  <line x1="12" y1="18" x2="12" y2="22"></line>
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                  <line x1="2" y1="12" x2="6" y2="12"></line>
                  <line x1="18" y1="12" x2="22" y2="12"></line>
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                </svg>
              </div>
              <div class="stat-info">
                <h3>{{ userStats.inProgress }}</h3>
                <p>In Progress</p>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-form-section">
          <h2>Update Profile</h2>
          <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input
                id="name"
                type="text"
                formControlName="name"
                [class.error]="submitted && f['name'].errors"
              />
              <div *ngIf="submitted && f['name'].errors" class="error-message">
                <span *ngIf="f['name'].errors['required']">Name is required</span>
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                [class.error]="submitted && f['email'].errors"
              />
              <div *ngIf="submitted && f['email'].errors" class="error-message">
                <span *ngIf="f['email'].errors['required']">Email is required</span>
                <span *ngIf="f['email'].errors['email']">Invalid email format</span>
              </div>
            </div>

            <div *ngIf="successMessage" class="alert alert-success">
              {{ successMessage }}
            </div>

            <button type="submit" class="btn-primary" [disabled]="loading">
              <span *ngIf="!loading">Update Profile</span>
              <span *ngIf="loading">Updating...</span>
            </button>
          </form>
        </div>

        <div class="password-section">
          <h2>Change Password</h2>
          <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
            <div class="form-group">
              <label for="current_password">Current Password</label>
              <input
                id="current_password"
                type="password"
                formControlName="current_password"
                [class.error]="passwordSubmitted && pf['current_password'].errors"
              />
            </div>

            <div class="form-group">
              <label for="new_password">New Password</label>
              <input
                id="new_password"
                type="password"
                formControlName="new_password"
                [class.error]="passwordSubmitted && pf['new_password'].errors"
              />
              <div *ngIf="passwordSubmitted && pf['new_password'].errors" class="error-message">
                <span *ngIf="pf['new_password'].errors['minlength']">Password must be at least 8 characters</span>
              </div>
            </div>

            <div class="form-group">
              <label for="new_password_confirmation">Confirm New Password</label>
              <input
                id="new_password_confirmation"
                type="password"
                formControlName="new_password_confirmation"
                [class.error]="passwordSubmitted && passwordForm.errors?.['passwordMismatch']"
              />
              <div *ngIf="passwordSubmitted && passwordForm.errors?.['passwordMismatch']" class="error-message">
                <span>Passwords do not match</span>
              </div>
            </div>

            <div *ngIf="passwordSuccess" class="alert alert-success">
              {{ passwordSuccess }}
            </div>

            <button type="submit" class="btn-secondary" [disabled]="passwordLoading">
              <span *ngIf="!passwordLoading">Change Password</span>
              <span *ngIf="passwordLoading">Changing...</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 30px;
    }

    .profile-header {
      background: white;
      border-radius: 16px;
      padding: 40px;
      display: flex;
      align-items: center;
      gap: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      margin-bottom: 30px;
    }

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 700;
      color: white;
    }

    .user-info h1 {
      font-size: 32px;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 8px 0;
    }

    .user-info p {
      color: #718096;
      margin: 0 0 12px 0;
      font-size: 16px;
    }

    .role-badge {
      display: inline-block;
      padding: 6px 16px;
      background: #ebf8ff;
      color: #3182ce;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      text-transform: capitalize;
    }

    .profile-content {
      display: grid;
      gap: 30px;
    }

    .stats-section,
    .profile-form-section,
    .password-section {
      background: white;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    }

    .stats-section h2,
    .profile-form-section h2,
    .password-section h2 {
      font-size: 24px;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 24px 0;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: #f7fafc;
      border-radius: 12px;
      transition: transform 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.total {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .stat-icon.completed {
      background: #f0fff4;
      color: #38a169;
    }

    .stat-icon.pending {
      background: #fef5e7;
      color: #f39c12;
    }

    .stat-icon.progress {
      background: #ebf8ff;
      color: #3182ce;
    }

    .stat-info h3 {
      font-size: 28px;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 4px 0;
    }

    .stat-info p {
      color: #718096;
      font-size: 14px;
      margin: 0;
    }

    .form-group {
      margin-bottom: 20px;
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
      border-radius: 8px;
      font-size: 15px;
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

    .alert-success {
      background: #c6f6d5;
      color: #276749;
      border: 1px solid #9ae6b4;
    }

    .btn-primary,
    .btn-secondary {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: #48bb78;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(72, 187, 120, 0.3);
    }

    .btn-primary:disabled,
    .btn-secondary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class ProfileComponent implements OnInit {
  get currentUser() {
    return this.authService.currentUserValue;
  }
  
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  submitted = false;
  passwordSubmitted = false;
  loading = false;
  passwordLoading = false;
  successMessage = '';
  passwordSuccess = '';
  userStats = {
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0
  };

  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadUserStats();
  }

  initForms(): void {
    this.profileForm = this.formBuilder.group({
      name: [this.currentUser?.name || '', Validators.required],
      email: [this.currentUser?.email || '', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.formBuilder.group({
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      new_password_confirmation: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('new_password');
    const confirmPassword = form.get('new_password_confirmation');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  get f() {
    return this.profileForm.controls;
  }

  get pf() {
    return this.passwordForm.controls;
  }

  getInitials(): string {
    const name = this.currentUser?.name || '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  loadUserStats(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.userStats.total = tasks.length;
        this.userStats.completed = tasks.filter(t => t.status === 'completed').length;
        this.userStats.pending = tasks.filter(t => t.status === 'pending').length;
        this.userStats.inProgress = tasks.filter(t => t.status === 'in_progress').length;
      },
      error: (error) => {
        console.error('Error loading user stats:', error);
      }
    });
  }

  updateProfile(): void {
    this.submitted = true;
    this.successMessage = '';

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulated update - in real app, this would call the API
    setTimeout(() => {
      this.successMessage = 'Profile updated successfully!';
      this.loading = false;
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }, 1000);
  }

  changePassword(): void {
    this.passwordSubmitted = true;
    this.passwordSuccess = '';

    if (this.passwordForm.invalid) {
      return;
    }

    this.passwordLoading = true;

    // Simulated password change - in real app, this would call the API
    setTimeout(() => {
      this.passwordSuccess = 'Password changed successfully!';
      this.passwordLoading = false;
      this.passwordForm.reset();
      this.passwordSubmitted = false;
      setTimeout(() => {
        this.passwordSuccess = '';
      }, 3000);
    }, 1000);
  }
}