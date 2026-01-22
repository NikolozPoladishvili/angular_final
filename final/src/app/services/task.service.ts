import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Task } from '../models/task.model';

export { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8000/api/tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(tasks => this.tasksSubject.next(tasks))
    );
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task).pipe(
      tap(() => this.getAllTasks().subscribe())
    );
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task).pipe(
      tap(() => this.getAllTasks().subscribe())
    );
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.getAllTasks().subscribe())
    );
  }

  getTasksByStatus(status: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}?status=${status}`);
  }

  getStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`);
  }
}
