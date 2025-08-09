import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../sidebar/sidebar';
import { Profile } from '../profile/profile';
import { Message } from '../message/message';
import { Request } from '../request/request';
import { Startup } from '../startup/startup';
import { UploadIdea } from '../upload-idea/upload-idea';
import { Home } from '../home/home';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, Sidebar, Profile, Message, Request, Startup, UploadIdea, Home],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashBoard {
  activeTab: string = 'dashboard';
  
  founderTabs = [
    // { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { key: 'myStartups', label: 'My Startups', icon: 'building' },
    { key: 'upload', label: 'Upload Idea', icon: 'upload' },
    { key: 'receivedRequests', label: 'Recieved Requests', icon: 'requests' },
    { key: 'messages', label: 'Messages', icon: 'messages' },
    { key: 'profile', label: 'Profile', icon: 'profile' },
    { key: 'logout', label: 'Logout', icon: 'logout' }
  ];

  investorTabs = [
    // { key: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { key: 'browse', label: 'Browse Startups', icon: 'browse' },
    { key: 'saved', label: 'Saved Startups', icon: 'saved' },
    { key: 'sentRequests', label: 'Sent Requests', icon: 'bell' },
    { key: 'messages', label: 'Messages', icon: 'messages' },
    { key: 'profile', label: 'Profile', icon: 'profile' },
    { key: 'logout', label: 'Logout', icon: 'logout' }
  ];
  
  tabs=this.investorTabs; // Default to investor tabs
  switchTab(tab: string): void {
    if (tab === 'logout') {
      this.logout();
    } else {
      this.activeTab = tab;
    }
  }

  logout() {
    // Replace with your logout logic
    localStorage.removeItem('auth_token');
    alert('Logged out!');
  }
 

}
