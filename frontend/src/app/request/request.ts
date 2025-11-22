import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RequestItem {
  id: number;
  name: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  role?: string;
  company?: string;
  location?: string;
  message?: string;
  sentDate: Date;
  respondedDate?: Date;
}

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request.html',
  styleUrl: './request.css'
})
export class Request {
  @Input() activeTab: string = '';

  // Sent requests (investor/founder)
  sentRequests: RequestItem[] = [
    { 
      id: 1, 
      name: 'Jane Investor', 
      status: 'Pending',
      role: 'Angel Investor',
      company: 'Tech Angels',
      location: 'San Francisco, CA',
      message: 'Interested in your startup idea',
      sentDate: new Date('2024-01-15')
    },
    { 
      id: 2, 
      name: 'John Angel', 
      status: 'Accepted',
      role: 'VC Partner',
      company: 'Innovation Capital',
      location: 'New York, NY',
      message: 'Great concept, let\'s discuss further',
      sentDate: new Date('2024-01-10'),
      respondedDate: new Date('2024-01-12')
    },
    { 
      id: 3, 
      name: 'Alice VC', 
      status: 'Declined',
      role: 'Investment Manager',
      company: 'Growth Fund',
      location: 'Boston, MA',
      message: 'Not a good fit for our portfolio',
      sentDate: new Date('2024-01-05'),
      respondedDate: new Date('2024-01-08')
    }
  ];

  // Received requests
  receivedRequests: RequestItem[] = [
    { 
      id: 1, 
      name: 'EcoTech', 
      status: 'Pending',
      role: 'Founder',
      company: 'EcoTech Solutions',
      location: 'Austin, TX',
      message: 'Looking for investment in sustainable technology',
      sentDate: new Date('2024-01-20')
    },
    { 
      id: 2, 
      name: 'GreenSpark', 
      status: 'Accepted',
      role: 'CEO',
      company: 'GreenSpark Energy',
      location: 'Seattle, WA',
      message: 'Renewable energy startup seeking funding',
      sentDate: new Date('2024-01-15'),
      respondedDate: new Date('2024-01-18')
    },
    { 
      id: 3, 
      name: 'BlueWave', 
      status: 'Declined',
      role: 'Founder',
      company: 'BlueWave Tech',
      location: 'Miami, FL',
      message: 'AI-powered ocean monitoring platform',
      sentDate: new Date('2024-01-12'),
      respondedDate: new Date('2024-01-14')
    }
  ];

  cancelRequest(id: number) {
    this.sentRequests = this.sentRequests.filter(r => r.id !== id);
  }

  acceptRequest(id: number) {
    const req = this.receivedRequests.find(r => r.id === id);
    if (req) {
      req.status = 'Accepted';
      req.respondedDate = new Date();
    }
  }

  rejectRequest(id: number) {
    const req = this.receivedRequests.find(r => r.id === id);
    if (req) {
      req.status = 'Declined';
      req.respondedDate = new Date();
    }
  }

  getStatusBadgeClasses(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-blue-100 text-blue-700';
      case 'Accepted':
        return 'bg-green-100 text-green-700';
      case 'Declined':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  trackByRequestId(index: number, request: RequestItem): number {
    return request.id;
  }
}
