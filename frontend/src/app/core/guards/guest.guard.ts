import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

/**
 * Guest Guard - Protects routes that should only be accessible to unauthenticated users
 * Redirects to dashboard if user is already authenticated
 */
export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  if (token) {
    // User is authenticated, redirect to dashboard with role
    const role = localStorage.getItem('role') || 'founder';
    router.navigate(['/dashboard'], { queryParams: { role: role } });
    return false;
  } else {
    return true; // User is not authenticated, allow access
  }
};

