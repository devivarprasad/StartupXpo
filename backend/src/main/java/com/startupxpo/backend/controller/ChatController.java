package com.startupxpo.backend.controller;

import com.startupxpo.backend.DTO.ChatMessage;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.Instant;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;


    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void processMessage(ChatMessage chatMessage) {

        chatMessage.setTimestamp(Instant.now());
        String recipientDestination = "/queue/messages";
        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(),
                recipientDestination,
                chatMessage
        );
        messagingTemplate.convertAndSendToUser(
                chatMessage.getSenderId(),
                recipientDestination,
                chatMessage
        );
    }
}
