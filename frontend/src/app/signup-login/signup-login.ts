import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signup-login.html',
  styleUrl: './signup-login.css'
})
export class SignupLogin {
  activeTab: 'signup' | 'login' = 'signup';
  userType: 'founder' | 'investor' | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.activeTab = params['tab'] === 'login' ? 'login' : 'signup';
      this.userType = params['type'] === 'founder' || params['type'] === 'investor'
        ? params['type']
        : null;
    });
  }

  switchTab(tab: 'signup' | 'login', event: Event) {
    event.preventDefault();
    this.activeTab = tab;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tab, type: this.userType },
      queryParamsHandling: 'merge',
    });
  }
}
