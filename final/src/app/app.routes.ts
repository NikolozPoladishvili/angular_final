import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'tasks',
    loadComponent: () => import('./components/tasks.component').then(m => m.TasksComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
