# Laravel API Backend

This is the Laravel API backend for the TaskMaster application.

## Setup Instructions

1. Install Composer dependencies:
```bash
composer install
```

2. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. Generate application key:
```bash
php artisan key:generate
```

4. Configure database in `.env` file

5. Run migrations:
```bash
php artisan migrate
```

6. Install Laravel Sanctum for API authentication:
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

7. Start the server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- POST `/api/register` - Register a new user
- POST `/api/login` - Login user
- POST `/api/logout` - Logout user

### Tasks
- GET `/api/tasks` - Get all tasks for authenticated user
- GET `/api/tasks/{id}` - Get a specific task
- POST `/api/tasks` - Create a new task
- PUT `/api/tasks/{id}` - Update a task
- DELETE `/api/tasks/{id}` - Delete a task

## CORS Configuration

Make sure to configure CORS in `config/cors.php` to allow requests from `http://localhost:4200` (Angular dev server).
