import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  imports: [CommonModule],
  templateUrl: './icon.html',
  styleUrl: './icon.css'
})
export class Icon {
  @Input() name: string = '';
  @Input() active: boolean = false;
}
