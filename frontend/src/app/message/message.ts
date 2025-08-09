import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
}

interface MessageItem {
  from: string;
  text: string;
  time: string;
}

@Component({
  selector: 'app-message',
  imports: [CommonModule, FormsModule],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class Message {
  @Input() activeTab: string = '';

  users: User[] = [
    { id: 1, name: 'Jane Investor' },
    { id: 2, name: 'John Angel' },
    { id: 3, name: 'Alice VC' }
  ];

  selectedUser: User | null = null;
  chatMessages: { [userId: number]: MessageItem[] } = {
    1: [
      { from: 'Jane Investor', text: 'Hi, I am interested in your idea!', time: '10:00 AM' },
      { from: 'You', text: 'Thank you! Happy to connect.', time: '10:01 AM' }
    ],
    2: [
      { from: 'John Angel', text: 'Can you share more details?', time: '09:30 AM' }
    ],
    3: [
      { from: 'Alice VC', text: 'Let’s schedule a call.', time: 'Yesterday' }
    ]
  };
  newMessage: string = '';

  selectUser(user: User) {
    this.selectedUser = user;
    if (!this.chatMessages[user.id]) {
      this.chatMessages[user.id] = [];
    }
  }

  sendMessage() {
    if (this.selectedUser && this.newMessage.trim()) {
      this.chatMessages[this.selectedUser.id].push({
        from: 'You',
        text: this.newMessage,
        time: new Date().toLocaleTimeString()
      });
      this.newMessage = '';
    }
  }
}
