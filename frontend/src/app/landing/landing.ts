import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/signup-login'], { queryParams: { tab: 'login' } });
  }

  goToSignup(type?: 'founder' | 'investor') {
    const queryParams: any = { tab: 'signup' };
    if (type) {
      queryParams.type = type;
    }
    this.router.navigate(['/signup-login'], { queryParams });
  }
}
