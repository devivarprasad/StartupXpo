import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Profile } from '../profile/profile';
import { UploadIdeaComponent } from '../upload-idea/upload-idea';

/**
 * Tab item interface for dashboard navigation
 */
export interface TabItem {
  key: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Profile, UploadIdeaComponent ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  // changeDetection: ChangeDetectionStrategy.OnPush // Removed for simpler change detection
})
export class Dashboard implements OnInit {
  /** Currently active tab key */
  activeTab: string = 'dashboard';
  
  /** User role (founder or investor) */
  userRole: 'founder' | 'investor' = 'founder';

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /** Founder dashboard tabs */
  readonly founderTabs: TabItem[] = [
    { key: 'myStartups', label: 'My Startups', icon: 'building' },
    { key: 'upload', label: 'Upload Idea', icon: 'upload' },
    { key: 'receivedRequests', label: 'Received Requests', icon: 'requests' },
    { key: 'messages', label: 'Messages', icon: 'messages' },
    { key: 'profile', label: 'Profile', icon: 'profile' },
    { key: 'logout', label: 'Logout', icon: 'logout' }
  ];

  /** Investor dashboard tabs */
  readonly investorTabs: TabItem[] = [
    { key: 'browse', label: 'Browse Startups', icon: 'browse' },
    { key: 'saved', label: 'Saved Startups', icon: 'saved' },
    { key: 'sentRequests', label: 'Sent Requests', icon: 'bell' },
    { key: 'messages', label: 'Messages', icon: 'messages' },
    { key: 'profile', label: 'Profile', icon: 'profile' },
    { key: 'logout', label: 'Logout', icon: 'logout' }
  ];

  /** Tabs to display (based on user role) */
  tabs: TabItem[] = this.founderTabs;

  /**
   * Initialize component - determine user role and set appropriate tabs
   */
  ngOnInit(): void {
    // Check if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (!token) {
      // Not authenticated, redirect to login
      this.router.navigate(['/signup-login'], { queryParams: { tab: 'login' } });
      return;
    }

    // Try to get role from query params first
    this.route.queryParams.subscribe(params => {
      if (params['role']) {
        this.setUserRole(params['role']);
      } else {
        // Fallback to localStorage if no query param
        const storedRole = localStorage.getItem('role');
        if (storedRole) {
          this.setUserRole(storedRole);
        } else {
          // Default to founder if no role found
          this.setUserRole('founder');
        }
      }
    });
  }

  /**
   * Sets the user role and updates tabs accordingly
   * @param role User role (founder or investor)
   */
  private setUserRole(role: string): void {
    const normalizedRole = role.toLowerCase().replace(/[\[\]]/g, '');
    
    if (normalizedRole === 'founder' || normalizedRole === 'investor') {
      this.userRole = normalizedRole as 'founder' | 'investor';
      this.tabs = this.userRole === 'founder' ? this.founderTabs : this.investorTabs;
      this.cdr.markForCheck();
    } else {
      // Default to founder if role is invalid
      console.warn(`Invalid role: ${role}. Defaulting to founder.`);
      this.userRole = 'founder';
      this.tabs = this.founderTabs;
      this.cdr.markForCheck();
    }
  }

  /**
   * Switches the active tab or logs out
   * @param tab Tab key
   */
  switchTab(tab: string): void {
    console.log('Switching tab to:', tab);
    if (tab === 'logout') {
      this.logout();
    } else {
      this.activeTab = tab;
      this.cdr.markForCheck(); // Trigger change detection
    }
  }

  /**
   * Logs out the user
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    this.router.navigate(['/']);
  }
}
