import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  template: `
    <div class="tasks-page">
      <div class="page-header">
        <h1>My Tasks</h1>
        <button class="btn-primary" (click)="showModal = true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Task
        </button>
      </div>

      <div class="filters">
        <button [class.active]="filterStatus === 'all'" (click)="filterTasks('all')">All</button>
        <button [class.active]="filterStatus === 'pending'" (click)="filterTasks('pending')">Pending</button>
        <button [class.active]="filterStatus === 'in_progress'" (click)="filterTasks('in_progress')">In Progress</button>
        <button [class.active]="filterStatus === 'completed'" (click)="filterTasks('completed')">Completed</button>
      </div>

      <div class="tasks-grid">
        <div *ngFor="let task of filteredTasks" class="task-item">
          <div class="task-header">
            <div class="task-title-section">
              <h3>{{ task.title }}</h3>
              <span class="priority-badge" [class]="task.priority">{{ task.priority }}</span>
            </div>
            <div class="task-actions">
              <button class="btn-edit" (click)="editTask(task)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="btn-delete" (click)="deleteTask(task.id!)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
          <p class="task-description">{{ task.description }}</p>
          <div class="task-footer">
            <span class="status-badge" [class]="task.status">{{ task.status | uppercase }}</span>
            <span class="due-date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {{ task.due_date | date }}
            </span>
          </div>
        </div>

        <div *ngIf="filteredTasks.length === 0" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
          </svg>
          <h3>No tasks found</h3>
          <p>{{ filterStatus === 'all' ? 'Create your first task to get started' : 'No tasks in this category' }}</p>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal" *ngIf="showModal" (click)="closeModal($event)">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editMode ? 'Edit Task' : 'Create New Task' }}</h2>
            <button class="close-btn" (click)="showModal = false">×</button>
          </div>

          <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="title">Task Title *</label>
              <input
                id="title"
                type="text"
                formControlName="title"
                [class.error]="submitted && f['title'].errors"
                placeholder="Enter task title"
              />
              <div *ngIf="submitted && f['title'].errors" class="error-message">
                <span *ngIf="f['title'].errors['required']">Title is required</span>
              </div>
            </div>

            <div class="form-group">
              <label for="description">Description *</label>
              <textarea
                id="description"
                formControlName="description"
                [class.error]="submitted && f['description'].errors"
                placeholder="Enter task description"
                rows="4"
              ></textarea>
              <div *ngIf="submitted && f['description'].errors" class="error-message">
                <span *ngIf="f['description'].errors['required']">Description is required</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="status">Status *</label>
                <select id="status" formControlName="status">
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div class="form-group">
                <label for="priority">Priority *</label>
                <select id="priority" formControlName="priority">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="due_date">Due Date *</label>
              <input
                id="due_date"
                type="date"
                formControlName="due_date"
                [class.error]="submitted && f['due_date'].errors"
              />
              <div *ngIf="submitted && f['due_date'].errors" class="error-message">
                <span *ngIf="f['due_date'].errors['required']">Due date is required</span>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" (click)="showModal = false">Cancel</button>
              <button type="submit" class="btn-submit" [disabled]="loading">
                {{ loading ? 'Saving...' : (editMode ? 'Update Task' : 'Create Task') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tasks-page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 30px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .page-header h1 {
      font-size: 36px;
      font-weight: 700;
      color: #2d3748;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
    }

    .filters {
      display: flex;
      gap: 12px;
      margin-bottom: 30px;
    }

    .filters button {
      padding: 10px 20px;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      color: #4a5568;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s;
    }

    .filters button:hover {
      border-color: #667eea;
      color: #667eea;
    }

    .filters button.active {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: transparent;
      color: white;
    }

    .tasks-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .task-item {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .task-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .task-title-section {
      flex: 1;
    }

    .task-title-section h3 {
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 8px 0;
    }

    .priority-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .priority-badge.high {
      background: #fed7d7;
      color: #c53030;
    }

    .priority-badge.medium {
      background: #feebc8;
      color: #c05621;
    }

    .priority-badge.low {
      background: #c6f6d5;
      color: #276749;
    }

    .task-actions {
      display: flex;
      gap: 8px;
    }

    .btn-edit,
    .btn-delete {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-edit {
      background: #ebf8ff;
      color: #3182ce;
    }

    .btn-edit:hover {
      background: #3182ce;
      color: white;
    }

    .btn-delete {
      background: #fed7d7;
      color: #c53030;
    }

    .btn-delete:hover {
      background: #c53030;
      color: white;
    }

    .task-description {
      color: #718096;
      margin-bottom: 16px;
      line-height: 1.6;
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
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
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #718096;
    }

    .empty-state {
      grid-column: 1 / -1;
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
    }

    /* Modal Styles */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      padding: 20px;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 24px;
      color: #2d3748;
    }

    .close-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: #f7fafc;
      border-radius: 8px;
      font-size: 24px;
      color: #718096;
      cursor: pointer;
      transition: all 0.3s;
    }

    .close-btn:hover {
      background: #e2e8f0;
      color: #2d3748;
    }

    form {
      padding: 24px;
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

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 15px;
      transition: all 0.3s;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
      border-color: #f56565;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .error-message {
      color: #f56565;
      font-size: 13px;
      margin-top: 6px;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .btn-cancel {
      padding: 10px 24px;
      background: #f7fafc;
      color: #4a5568;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-cancel:hover {
      background: #e2e8f0;
    }

    .btn-submit {
      padding: 10px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  filterStatus: string = 'all';
  showModal = false;
  editMode = false;
  taskForm!: FormGroup;
  submitted = false;
  loading = false;
  currentTaskId?: number;

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTasks();
  }

  initForm(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['pending', Validators.required],
      priority: ['medium', Validators.required],
      due_date: ['', Validators.required]
    });
  }

  get f() {
    return this.taskForm.controls;
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applyFilter();
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  filterTasks(status: string): void {
    this.filterStatus = status;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.filterStatus === 'all') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(task => task.status === this.filterStatus);
    }
  }

  editTask(task: Task): void {
    this.editMode = true;
    this.currentTaskId = task.id;
    this.taskForm.patchValue(task);
    this.showModal = true;
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.taskForm.invalid) {
      return;
    }

    this.loading = true;

    if (this.editMode && this.currentTaskId) {
      this.taskService.updateTask(this.currentTaskId, this.taskForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.showModal = false;
          this.resetForm();
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this.loading = false;
        }
      });
    } else {
      this.taskService.createTask(this.taskForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.showModal = false;
          this.resetForm();
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.taskForm.reset({
      status: 'pending',
      priority: 'medium'
    });
    this.submitted = false;
    this.editMode = false;
    this.currentTaskId = undefined;
  }

  closeModal(event: MouseEvent): void {
    this.showModal = false;
    this.resetForm();
  }
}