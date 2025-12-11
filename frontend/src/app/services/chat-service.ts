import { Injectable } from '@angular/core';
import { Client, Message, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient!: Client;
  private userId!: number;

  private messageSubject = new Subject<any>();
  public message$ = this.messageSubject.asObservable();

  private messagesSubscription?: StompSubscription;

  constructor() {}

  // ---------------------------------------------------------------------
  // CONNECT
  // ---------------------------------------------------------------------
  connect(userId: number, token: string | null) {
    this.userId = userId;

    this.stompClient = new Client({
      webSocketFactory: () =>
        new SockJS(`http://localhost:8080/ws?token=${encodeURIComponent(token || '')}`),

      connectHeaders: {
        Authorization: token ? `Bearer ${token}` : ''
      },

      debug: (str) => console.log("STOMP DEBUG:", str),

      // SockJS does not support heartbeats well — disable:
      heartbeatIncoming: 0,
      heartbeatOutgoing: 0,

      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      console.log("STOMP Connected");

      // Clean old subscription (if reconnect happened)
      if (this.messagesSubscription) {
        this.messagesSubscription.unsubscribe();
      }

      // Must subscribe AFTER connection
      this.messagesSubscription = this.stompClient.subscribe(
        "/user/queue/messages",
        (message: Message) => this.onMessageReceived(message)
      );

      console.log("Subscribed to /user/queue/messages");
    };

    this.stompClient.onStompError = (frame) => {
      console.error("STOMP Error:", frame.headers['message']);
      console.error("Details:", frame.body);
    };

    this.stompClient.onWebSocketClose = () => {
      console.warn("WebSocket connection closed");
    };

    this.stompClient.activate();
  }

  // ---------------------------------------------------------------------
  // MESSAGE RECEIVED
  // ---------------------------------------------------------------------
  private onMessageReceived(message: Message) {
    try {
      const body = JSON.parse(message.body);
      console.log("Received message:", body);
      this.messageSubject.next(body);
    } catch (e) {
      console.error("Invalid JSON message:", message.body);
    }
  }

  // ---------------------------------------------------------------------
  // SEND MESSAGE
  // ---------------------------------------------------------------------
  sendMessage(recipientId: number, content: string) {
    if (!this.stompClient || !this.stompClient.connected) {
      console.error("Cannot send message — WebSocket not connected");
      return;
    }

    const chatMessage = {
      senderId: this.userId,
      recipientId,
      content,
      timestamp: new Date().toISOString()
    };

    this.stompClient.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(chatMessage)
    });

    console.log("Message published:", chatMessage);
  }

  // ---------------------------------------------------------------------
  // DISCONNECT
  // ---------------------------------------------------------------------
  disconnect() {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }
}
