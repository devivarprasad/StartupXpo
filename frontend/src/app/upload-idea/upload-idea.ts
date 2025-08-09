import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-upload-idea',
  imports: [CommonModule],
  templateUrl: './upload-idea.html',
  styleUrl: './upload-idea.css'
})
export class UploadIdea {
  @Input() activeTab: string = '';
  // Additional properties and methods can be added here as needed
}
