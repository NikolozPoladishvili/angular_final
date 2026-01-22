import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { NavbarComponent } from './components/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="app-container">
      <app-navbar *ngIf="authService.isAuthenticated()"></app-navbar>
      <div class="main-content" [class.full-width]="!authService.isAuthenticated()">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f5f7fa;
    }

    .main-content {
      padding-top: 70px;
      min-height: calc(100vh - 70px);
    }

    .main-content.full-width {
      padding-top: 0;
    }
  `]
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}
}