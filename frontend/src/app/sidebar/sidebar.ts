import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icon } from '../icon/icon';

interface TabItem {
  key: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, Icon],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  @Input() tabs: TabItem[] = [];
  @Input() activeTab: string = '';
  @Output() tabSwitched = new EventEmitter<string>();
  
  onTabClick(tabKey: string) {
    this.tabSwitched.emit(tabKey);
  }
  

}
