import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-startup',
  imports: [CommonModule],
  templateUrl: './startup.html',
  styleUrl: './startup.css'
})
export class Startup {
 @Input() activeTab: string = '';
}
