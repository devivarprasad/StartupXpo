import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { SignupLogin } from './signup-login/signup-login';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { 
    path: 'signup-login', 
    component: SignupLogin,
    canActivate: [guestGuard] // Redirect to dashboard if already logged in
  },
  { 
    path: 'dashboard', 
    component: Dashboard,
    canActivate: [authGuard] // Redirect to login if not authenticated
  },
];
