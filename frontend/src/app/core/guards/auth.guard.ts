import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

/**
 * Auth Guard - Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  if (token) {
    return true; // User is authenticated
  } else {
    // User is not authenticated, redirect to login
    router.navigate(['/signup-login'], { queryParams: { tab: 'login' } });
    return false;
  }
};

