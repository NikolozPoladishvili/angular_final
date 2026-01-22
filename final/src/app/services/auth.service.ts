import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap, map, catchError } from 'rxjs/operators';
import { User, AuthResponse } from '../models/user.model';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private router: Router,
    private mockData: MockDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const storedUser = isPlatformBrowser(this.platformId) 
      ? localStorage.getItem('currentUser') 
      : null;
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    // Simulate API delay
    return of(null).pipe(
      delay(500),
      map(() => {
        const user = this.mockData.getUserByEmail(email);
        
        // For demo purposes, accept any password
        if (!user) {
          throw new Error('Invalid credentials');
        }

        // Generate a mock token
        const token = `mock_token_${user.id}_${Date.now()}`;
        const response: AuthResponse = {
          access_token: token,
          token_type: 'Bearer',
          expires_in: 60 * 24 * 7, // 7 days
          user: user
        };

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
        this.currentUserSubject.next(response.user);
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  register(name: string, email: string, password: string, password_confirmation: string): Observable<AuthResponse> {
    // Simulate API delay
    return of(null).pipe(
      delay(500),
      map(() => {
        // Check if user already exists
        if (this.mockData.getUserByEmail(email)) {
          throw new Error('Email already registered');
        }

        // Validate password confirmation
        if (password !== password_confirmation) {
          throw new Error('Passwords do not match');
        }

        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }

        // Create new user
        const user = this.mockData.createUser(name, email, 'user');
        const token = `mock_token_${user.id}_${Date.now()}`;
        const response: AuthResponse = {
          access_token: token,
          token_type: 'Bearer',
          expires_in: 60 * 24 * 7,
          user: user
        };

        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }
        this.currentUserSubject.next(response.user);
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearAuthData();
  }

  private clearAuthData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false; // On server, always return false to allow SSR to work
    }
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.role === 'admin';
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem('access_token');
  }
}
