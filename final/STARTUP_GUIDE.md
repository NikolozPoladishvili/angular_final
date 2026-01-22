# 🚀 TaskMaster - Startup Guide

Welcome to TaskMaster! This guide will help you get the application up and running quickly.

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Node.js** (version 20.19.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) - version 10.8.2 or higher
- A modern web browser (Chrome, Firefox, Edge, or Safari)

### Verify Installation

Open your terminal/command prompt and run:

```bash
node --version
npm --version
```

You should see Node.js version 20.19.0 or higher and npm version 10.8.2 or higher.

## 🛠️ Installation Steps

### 1. Navigate to the Project Directory

```bash
cd final
```

### 2. Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install all the Angular dependencies and other required packages. It may take a few minutes.

### 3. Verify Installation

After installation completes, you should see a `node_modules` folder in the `final` directory.

## ▶️ Running the Application

### Start the Development Server

Run the following command:

```bash
npm start
```

Or alternatively:

```bash
npx ng serve
```

The application will start compiling and you'll see output in your terminal. Once ready, you'll see:

```
✔ Browser application bundle generation complete.
Initial chunk files   | Names         |  Raw size
...
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
```

### Access the Application

Open your web browser and navigate to:

**http://localhost:4200**

The application should load automatically. If it doesn't, manually open your browser and go to the URL above.

## 🔐 Default Login Credentials

The application comes with pre-configured test accounts:

### Admin Account
- **Email:** `admin@example.com`
- **Password:** Any password (password validation is disabled in mock mode)

### Regular User Account
- **Email:** `user@example.com`
- **Password:** Any password (password validation is disabled in mock mode)

### Create New Account

You can also register a new account:
1. Click "Sign up" on the login page
2. Fill in your name, email, and password
3. Click "Create Account"
4. You'll be automatically logged in

## ✨ Features Available

Once logged in, you can:

- **Dashboard** - View task statistics and recent tasks
- **Tasks** - Create, edit, delete, and manage your tasks
- **Profile** - View your user profile information
- **Logout** - Sign out of your account

## 📝 Sample Data

The application comes with sample tasks pre-loaded:
- Welcome Task (Pending)
- Complete Project Setup (In Progress)
- Review Documentation (Completed)

You can edit or delete these tasks, or create new ones!

## 🛑 Stopping the Server

To stop the development server:

1. Go to the terminal where the server is running
2. Press `Ctrl + C` (Windows/Linux) or `Cmd + C` (Mac)
3. Confirm if prompted

## 🔧 Troubleshooting

### Port 4200 Already in Use

If you see an error that port 4200 is already in use:

```bash
# Option 1: Stop the other process using port 4200
# Option 2: Use a different port
npx ng serve --port 4201
```

Then access the app at `http://localhost:4201`

### Cache Issues

If you encounter build errors or strange behavior:

1. Stop the server (`Ctrl + C`)
2. Clear the Angular cache:
   ```bash
   # Windows PowerShell
   Remove-Item -Recurse -Force .angular
   
   # Mac/Linux
   rm -rf .angular
   ```
3. Restart the server:
   ```bash
   npm start
   ```

### Module Not Found Errors

If you see "module not found" errors:

1. Delete `node_modules` folder and `package-lock.json`:
   ```bash
   # Windows PowerShell
   Remove-Item -Recurse -Force node_modules, package-lock.json
   
   # Mac/Linux
   rm -rf node_modules package-lock.json
   ```
2. Reinstall dependencies:
   ```bash
   npm install
   ```
3. Restart the server

### Browser Shows Blank Page

1. Open browser developer tools (F12)
2. Check the Console tab for errors
3. Try a hard refresh: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
4. Clear browser cache and try again

## 📦 Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist/final/browser` directory.

## 🧪 Running Tests

To run unit tests:

```bash
npm test
```

## 📚 Additional Resources

- **Angular Documentation:** https://angular.dev
- **Angular CLI Commands:** Run `npx ng help` for a list of available commands

## 💾 Data Persistence

All data (users, tasks) is stored in your browser's **localStorage**. This means:
- ✅ Data persists across page refreshes
- ✅ Data is specific to your browser
- ⚠️ Clearing browser data will delete all tasks and users
- ⚠️ Data is not synced across different browsers or devices

## 🎯 Quick Start Checklist

- [ ] Node.js 20.19.0+ installed
- [ ] Navigated to `final` directory
- [ ] Ran `npm install`
- [ ] Ran `npm start`
- [ ] Opened browser to `http://localhost:4200`
- [ ] Logged in with `user@example.com` (any password)

## 🆘 Need Help?

If you encounter any issues not covered in this guide:

1. Check the browser console for error messages
2. Check the terminal output for build errors
3. Verify all prerequisites are installed correctly
4. Try clearing cache and reinstalling dependencies

---

**Happy Task Managing! 🎉**
