import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  @Input() activeTab: string = '';

  isEditing: boolean = false;
  profile = {
    name: 'John Founder',
    email: 'john@startup.com',
    role: 'Founder',
    profilePicUrl: ''
  };
  newProfilePic: string = '';

  editProfile() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  saveProfile() {
    if (this.newProfilePic) {
      this.profile.profilePicUrl = this.newProfilePic;
    }
    this.isEditing = false;
  }

  onProfilePicChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newProfilePic = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
