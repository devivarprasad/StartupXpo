import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface RequestItem {
  id: number;
  name: string;
  status: 'Pending' | 'Accepted' | 'Declined';
}

@Component({
  selector: 'app-request',
  imports: [CommonModule],
  templateUrl: './request.html',
  styleUrl: './request.css'
})
export class Request {
  @Input() activeTab: string = '';

  // Sent requests (investor/founder)
  sentRequests: RequestItem[] = [
    { id: 1, name: 'Jane Investor', status: 'Pending' },
    { id: 2, name: 'John Angel', status: 'Accepted' },
    { id: 3, name: 'Alice VC', status: 'Declined' }
  ];

  // Received requests
  receivedRequests: RequestItem[] = [
    { id: 1, name: 'EcoTech', status: 'Pending' },
    { id: 2, name: 'GreenSpark', status: 'Accepted' },
    { id: 3, name: 'BlueWave', status: 'Declined' }
  ];

  cancelRequest(id: number) {
    this.sentRequests = this.sentRequests.filter(r => r.id !== id);
  }

  acceptRequest(id: number) {
    const req = this.receivedRequests.find(r => r.id === id);
    if (req) req.status = 'Accepted';
  }

  rejectRequest(id: number) {
    const req = this.receivedRequests.find(r => r.id === id);
    if (req) req.status = 'Declined';
  }
}
