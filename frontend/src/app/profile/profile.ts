import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface ProfileData {
  id: number;
  username: string;
  email: string | null;
  location: string | null;
  bio: string | null;
  role: string | null;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Profile implements OnInit {

  profile: ProfileData = {
    id: 0,
    username: '',
    email: '',
    location: '',
    bio: '',
    role: ''
  };

  // Backup copy to restore on Cancel
  originalProfile: ProfileData | null = null;

  loading = true;
  isEditing = false;
  saveError = '';

  constructor(private api: ApiService, private cdr: ChangeDetectorRef) {
    console.log('Profile component constructor called');
  }

  ngOnInit() {
    console.log('Profile component ngOnInit called');
    this.loadProfile();
  }

  loadProfile() {
    console.log('Profile component loadProfile called');
    this.api.get('users/me').subscribe({
      next: (res: ProfileData) => {
        this.profile = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.saveError = 'Failed to load profile.';
        this.cdr.markForCheck();
      }
    });
  }

  toggleEdit() {
    if (!this.isEditing) {
      // Entering edit mode → clone profile to backup
      this.originalProfile = JSON.parse(JSON.stringify(this.profile));
    } else {
      // Cancel pressed → restore original profile
      if (this.originalProfile) {
        this.profile = JSON.parse(JSON.stringify(this.originalProfile));
      }
    }

    this.isEditing = !this.isEditing;
    this.cdr.markForCheck();
  }

  saveProfile() {
    this.api.put('users/me', this.profile).subscribe({
      next: () => {
        this.isEditing = false;
        this.originalProfile = null; // Remove backup after successful save
        this.cdr.markForCheck();
      },
      error: () => {
        this.saveError = 'Failed to save profile.';
        this.cdr.markForCheck();
      }
    });
  }
}
