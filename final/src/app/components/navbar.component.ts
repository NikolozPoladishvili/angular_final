import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <h2>TaskMaster</h2>
        </div>

        <div class="navbar-menu">
          <a routerLink="/dashboard" routerLinkActive="active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </a>
          <a routerLink="/tasks" routerLinkActive="active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>
            Tasks
          </a>
          <a routerLink="/profile" routerLinkActive="active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Profile
          </a>
        </div>

        <div class="navbar-user">
          <div class="user-info">
            <span class="user-name">{{ currentUser?.name }}</span>
            <span class="user-role">{{ currentUser?.role }}</span>
          </div>
          <button class="logout-btn" (click)="logout()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      height: 70px;
    }

    .navbar-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 30px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-brand h2 {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }

    .navbar-menu {
      display: flex;
      gap: 10px;
    }

    .navbar-menu a {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      color: #4a5568;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      transition: all 0.3s;
    }

    .navbar-menu a:hover {
      background: #f7fafc;
      color: #667eea;
    }

    .navbar-menu a.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .navbar-user {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .user-name {
      font-weight: 600;
      color: #2d3748;
      font-size: 14px;
    }

    .user-role {
      font-size: 12px;
      color: #718096;
      text-transform: capitalize;
    }

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: #f56565;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .logout-btn:hover {
      background: #e53e3e;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(245, 101, 101, 0.3);
    }
  `]
})
export class NavbarComponent {
  get currentUser() {
    return this.authService.currentUserValue;
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
  }
}