import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  lastMessage?: string;
  unreadCount?: number;
  status?: string;
}

interface MessageItem {
  from: string;
  text: string;
  time: string;
}

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class Message {
  @Input() activeTab: string = '';

  users: User[] = [
    { 
      id: 1, 
      name: 'Jane Investor', 
      lastMessage: 'Hi, I am interested in your idea!',
      unreadCount: 2,
      status: 'Online'
    },
    { 
      id: 2, 
      name: 'John Angel', 
      lastMessage: 'Can you share more details?',
      unreadCount: 0,
      status: 'Online'
    },
    { 
      id: 3, 
      name: 'Alice VC', 
      lastMessage: 'Let\'s schedule a call.',
      unreadCount: 1,
      status: 'Away'
    }
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
      { from: 'Alice VC', text: 'Let\'s schedule a call.', time: 'Yesterday' }
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

  startVideoCall() {
    if (this.selectedUser) {
      console.log('Starting video call with:', this.selectedUser.name);
    }
  }

  startVoiceCall() {
    if (this.selectedUser) {
      console.log('Starting voice call with:', this.selectedUser.name);
    }
  }

  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  trackByMessageId(index: number, message: MessageItem): string {
    return message.text + message.time;
  }
}
