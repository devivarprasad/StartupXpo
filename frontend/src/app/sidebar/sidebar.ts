import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  @Input() tabs: any[] = [];
  @Input() activeTab: string = '';
  @Output() tabSwitched = new EventEmitter<string>();
  onTabClick(tabKey: string) {
    this.tabSwitched.emit(tabKey);
  }
}
