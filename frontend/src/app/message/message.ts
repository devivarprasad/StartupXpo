import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import SockJS from 'sockjs-client';
import { Client , Message } from '@stomp/stompjs';
import { ProfileService } from '../services/profile';
import { ProfileData } from '../profile/profile';
import { ChatService } from '../services/chat-service';
export interface ChatUser {
  id: number;
  username: string;
  role: string; // URL or initials
  lastMessage: string;
}

export interface ChatMessage {
  senderId: number;
  recipientId: number; 
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message.html',
  styleUrl: './message.css'
})
export class MessageComponent implements OnInit {
  
  searchTerm: string = '';
  selectedUser: ChatUser | null = null;
  apiUrl = environment.apiUrl;
  users : ChatUser[] = [];
  currentConversation: ChatMessage[] = [];
  newMessageText: string = '';
  currentUser: ProfileData | null = null;
  authToken  = localStorage.getItem("auth_token")?localStorage.getItem("auth_token"):"";
  constructor(private http: HttpClient, private profileService: ProfileService,private chatService : ChatService) {}
  ngOnInit() {
    this.profileService.loadProfile().subscribe({
      next: (profile: ProfileData) => {
        this.currentUser = profile;
        this.chatService.connect(this.currentUser!.id,this.authToken);
        this.chatService.message$.subscribe((msg: ChatMessage) => {
          this.handleIncomingMessage(msg);
        });
      }
    });
    this.fetchUsers();
  }
  fetchUsers() {
    this.http.get<ChatUser[]>(`${this.apiUrl}/users/all`)
      .subscribe({
        next: (users: ChatUser[]) => {
          console.log('Users fetched successfully', users);
          this.users = users;
        },
        error: (error: any) => {
          console.error('Error fetching users:', error);
          alert('Could not load users.');
        },
        complete: () => {
          console.log('Users fetched successfully');
        }
      });
  }

  handleIncomingMessage(msg: ChatMessage) {
    // Only show message if user is chatting with recipient
    if (this.selectedUser && Number(msg.senderId) === this.selectedUser.id) {
      this.currentConversation.push(msg);
    }
  
    // Also update "last message" in sidebar
    const user = this.users.find(u => u.id === Number(msg.senderId));
    if (user) {
      user.lastMessage = msg.content;
    }
  }

  // Filter users based on search
  get filteredUsers(): ChatUser[] {
    return this.users.filter(user => 
      user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectUser(user: ChatUser) {
    this.selectedUser = user;
    this.currentConversation = [];
  }

  sendMessage() {
    if (!this.newMessageText.trim()) return;

    // Add message to UI
    this.currentConversation.push({
      senderId: this.currentUser!.id,
      recipientId: this.selectedUser!.id,
      content: this.newMessageText,
      timestamp: new Date()
    });

    // 
    this.chatService.sendMessage(this.selectedUser!.id,this.newMessageText);
    this.newMessageText = '';
  }

  
}