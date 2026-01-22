import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User, AuthResponse } from '../models/user.model';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private readonly STORAGE_KEY_USERS = 'mock_users';
  private readonly STORAGE_KEY_TASKS = 'mock_tasks';
  private readonly STORAGE_KEY_NEXT_USER_ID = 'mock_next_user_id';
  private readonly STORAGE_KEY_NEXT_TASK_ID = 'mock_next_task_id';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Initialize users if not exists
    if (!localStorage.getItem(this.STORAGE_KEY_USERS)) {
      const defaultUsers: User[] = [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        },
        {
          id: 2,
          name: 'Test User',
          email: 'user@example.com',
          role: 'user'
        }
      ];
      localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(defaultUsers));
      localStorage.setItem(this.STORAGE_KEY_NEXT_USER_ID, '3');
    }

    // Initialize tasks if not exists
    if (!localStorage.getItem(this.STORAGE_KEY_TASKS)) {
      const defaultTasks: Task[] = [
        {
          id: 1,
          title: 'Welcome Task',
          description: 'This is your first task. You can edit or delete it!',
          status: 'pending',
          priority: 'medium',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          user_id: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Complete Project Setup',
          description: 'Set up the development environment and install dependencies',
          status: 'in_progress',
          priority: 'high',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          user_id: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Review Documentation',
          description: 'Read through the project documentation and understand the requirements',
          status: 'completed',
          priority: 'low',
          due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          user_id: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      localStorage.setItem(this.STORAGE_KEY_TASKS, JSON.stringify(defaultTasks));
      localStorage.setItem(this.STORAGE_KEY_NEXT_TASK_ID, '4');
    }
  }

  // User management
  getUsers(): User[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    const usersJson = localStorage.getItem(this.STORAGE_KEY_USERS);
    return usersJson ? JSON.parse(usersJson) : [];
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.email === email) || null;
  }

  createUser(name: string, email: string, role: 'admin' | 'user' = 'user'): User {
    const users = this.getUsers();
    const nextId = parseInt(localStorage.getItem(this.STORAGE_KEY_NEXT_USER_ID) || '1');
    const newUser: User = {
      id: nextId,
      name,
      email,
      role
    };
    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));
    localStorage.setItem(this.STORAGE_KEY_NEXT_USER_ID, (nextId + 1).toString());
    return newUser;
  }

  // Task management
  getTasks(userId?: number): Task[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    const tasksJson = localStorage.getItem(this.STORAGE_KEY_TASKS);
    const tasks: Task[] = tasksJson ? JSON.parse(tasksJson) : [];
    if (userId) {
      return tasks.filter(t => t.user_id === userId);
    }
    return tasks;
  }

  getTaskById(id: number): Task | null {
    const tasks = this.getTasks();
    return tasks.find(t => t.id === id) || null;
  }

  createTask(task: Task, userId: number): Task {
    const tasks = this.getTasks();
    const nextId = parseInt(localStorage.getItem(this.STORAGE_KEY_NEXT_TASK_ID) || '1');
    const newTask: Task = {
      ...task,
      id: nextId,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    tasks.push(newTask);
    localStorage.setItem(this.STORAGE_KEY_TASKS, JSON.stringify(tasks));
    localStorage.setItem(this.STORAGE_KEY_NEXT_TASK_ID, (nextId + 1).toString());
    return newTask;
  }

  updateTask(id: number, taskData: Partial<Task>): Task | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    tasks[index] = {
      ...tasks[index],
      ...taskData,
      id,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEY_TASKS, JSON.stringify(tasks));
    return tasks[index];
  }

  deleteTask(id: number): boolean {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    tasks.splice(index, 1);
    localStorage.setItem(this.STORAGE_KEY_TASKS, JSON.stringify(tasks));
    return true;
  }

  getTasksByStatus(status: string, userId?: number): Task[] {
    const tasks = this.getTasks(userId);
    return tasks.filter(t => t.status === status);
  }

  getStatistics(userId?: number): any {
    const tasks = this.getTasks(userId);
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      high_priority: tasks.filter(t => t.priority === 'high').length,
      medium_priority: tasks.filter(t => t.priority === 'medium').length,
      low_priority: tasks.filter(t => t.priority === 'low').length
    };
  }
}
