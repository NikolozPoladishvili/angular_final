import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { MockDataService } from './mock-data.service';
import { AuthService } from './auth.service';

export type { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(
    private mockData: MockDataService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getCurrentUserId(): number | null {
    const user = this.authService.currentUserValue;
    return user?.id || null;
  }

  getAllTasks(): Observable<Task[]> {
    const userId = this.getCurrentUserId();
    return of(this.mockData.getTasks(userId || undefined)).pipe(
      delay(300),
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }

  getTask(id: number): Observable<Task> {
    const task = this.mockData.getTaskById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return of(task).pipe(delay(200));
  }

  createTask(task: Task): Observable<Task> {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return of(this.mockData.createTask(task, userId)).pipe(
      delay(300),
      tap(() => this.getAllTasks().subscribe())
    );
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    const updatedTask = this.mockData.updateTask(id, task);
    if (!updatedTask) {
      throw new Error('Task not found');
    }
    return of(updatedTask).pipe(
      delay(300),
      tap(() => this.getAllTasks().subscribe())
    );
  }

  deleteTask(id: number): Observable<void> {
    const success = this.mockData.deleteTask(id);
    if (!success) {
      throw new Error('Task not found');
    }
    return of(undefined).pipe(
      delay(300),
      tap(() => this.getAllTasks().subscribe())
    );
  }

  getTasksByStatus(status: string): Observable<Task[]> {
    const userId = this.getCurrentUserId();
    return of(this.mockData.getTasksByStatus(status, userId || undefined)).pipe(delay(200));
  }

  getStatistics(): Observable<any> {
    const userId = this.getCurrentUserId();
    return of(this.mockData.getStatistics(userId || undefined)).pipe(delay(200));
  }
}
