import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      // User is authenticated, redirect to dashboard
      const role = localStorage.getItem('role') || 'founder';
      this.router.navigate(['/dashboard'], { queryParams: { role: role } });
    }
  }

  goToLogin() {
    this.router.navigate(['/signup-login'], { queryParams: { tab: 'login' } });
  }

  goToSignup(type: 'founder' | 'investor') {
    const queryParams: any = { tab: 'signup' };
    if (type) {
      queryParams.type = type;
    }
    this.router.navigate(['/signup-login'], { queryParams });
  }
}
