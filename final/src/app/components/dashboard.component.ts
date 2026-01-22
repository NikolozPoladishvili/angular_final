import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="dashboard">
      <div class="dashboard-header">
        <h1>Welcome back, {{ currentUser?.name }}! 👋</h1>
        <p>Here's what's happening with your tasks today</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ stats.total }}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div class="stat-card pending">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ stats.pending }}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div class="stat-card in-progress">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ stats.inProgress }}</h3>
            <p>In Progress</p>
          </div>
        </div>

        <div class="stat-card completed">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-content">
            <h3>{{ stats.completed }}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div class="recent-tasks">
        <div class="section-header">
          <h2>Recent Tasks</h2>
          <a routerLink="/tasks" class="view-all">View All →</a>
        </div>

        <div class="tasks-container">
          <div *ngFor="let task of recentTasks" class="task-card">
            <div class="task-priority" [class]="task.priority"></div>
            <div class="task-content">
              <h3>{{ task.title }}</h3>
              <p>{{ task.description }}</p>
              <div class="task-meta">
                <span class="status-badge" [class]="task.status">{{ task.status | uppercase }}</span>
                <span class="due-date">Due: {{ task.due_date | date }}</span>
              </div>
            </div>
          </div>

          <div *ngIf="recentTasks.length === 0" class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
            </svg>
            <h3>No tasks yet</h3>
            <p>Create your first task to get started</p>
            <a routerLink="/tasks" class="btn-primary">Create Task</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
      padding: 30px;
    }

    .dashboard-header {
      margin-bottom: 40px;
    }

    .dashboard-header h1 {
      font-size: 36px;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 8px;
    }

    .dashboard-header p {
      color: #718096;
      font-size: 18px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-card.total .stat-icon {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .stat-card.pending .stat-icon {
      background: #fef5e7;
      color: #f39c12;
    }

    .stat-card.in-progress .stat-icon {
      background: #ebf8ff;
      color: #3182ce;
    }

    .stat-card.completed .stat-icon {
      background: #f0fff4;
      color: #38a169;
    }

    .stat-content h3 {
      font-size: 32px;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 4px 0;
    }

    .stat-content p {
      color: #718096;
      font-size: 14px;
      margin: 0;
    }

    .recent-tasks {
      background: white;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      font-size: 24px;
      font-weight: 700;
      color: #2d3748;
      margin: 0;
    }

    .view-all {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s;
    }

    .view-all:hover {
      color: #764ba2;
    }

    .tasks-container {
      display: grid;
      gap: 16px;
    }

    .task-card {
      display: flex;
      background: #f7fafc;
      border-radius: 12px;
      padding: 20px;
      border-left: 4px solid transparent;
      transition: all 0.3s;
    }

    .task-card:hover {
      background: #edf2f7;
      transform: translateX(4px);
    }

    .task-priority {
      width: 4px;
      margin-right: 16px;
      border-radius: 2px;
    }

    .task-priority.high {
      background: #f56565;
    }

    .task-priority.medium {
      background: #ed8936;
    }

    .task-priority.low {
      background: #48bb78;
    }

    .task-content {
      flex: 1;
    }

    .task-content h3 {
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 8px 0;
    }

    .task-content p {
      color: #718096;
      margin: 0 0 12px 0;
      font-size: 14px;
    }

    .task-meta {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge.pending {
      background: #fef5e7;
      color: #f39c12;
    }

    .status-badge.in_progress {
      background: #ebf8ff;
      color: #3182ce;
    }

    .status-badge.completed {
      background: #f0fff4;
      color: #38a169;
    }

    .due-date {
      font-size: 13px;
      color: #718096;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }

    .empty-state svg {
      color: #cbd5e0;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      font-size: 20px;
      color: #2d3748;
      margin-bottom: 8px;
    }

    .empty-state p {
      color: #718096;
      margin-bottom: 24px;
    }

    .btn-primary {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    }
  `]
})
export class DashboardComponent implements OnInit {
  get currentUser() {
    return this.authService.currentUserValue;
  }
  
  recentTasks: Task[] = [];
  stats = {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  };

  constructor(
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.recentTasks = tasks.slice(0, 5);
        this.calculateStats(tasks);
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  calculateStats(tasks: Task[]): void {
    this.stats.total = tasks.length;
    this.stats.pending = tasks.filter(t => t.status === 'pending').length;
    this.stats.inProgress = tasks.filter(t => t.status === 'in_progress').length;
    this.stats.completed = tasks.filter(t => t.status === 'completed').length;
  }
}