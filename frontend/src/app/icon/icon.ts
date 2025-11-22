import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.html',
  styleUrl: './icon.css'
})
export class Icon {
  @Input() name: string = '';
  @Input() active: boolean = false;
  
  getIconLabel(): string {
    const iconLabels: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'building': 'My Startups',
      'upload': 'Upload Idea',
      'bell': 'Connection Requests',
      'messages': 'Messages',
      'profile': 'Profile',
      'logout': 'Logout',
      'browse': 'Browse Startups',
      'saved': 'Saved Startups',
      'requests': 'Connection Requests'
    };
    
    return iconLabels[this.name] || 'Icon';
  }
}
