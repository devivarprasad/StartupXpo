package com.startupxpo.backend.controller;

import com.startupxpo.backend.DTO.ChatMessage;
import com.startupxpo.backend.model.User;
import com.startupxpo.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.Instant;
import java.util.Optional;

@Controller
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    @Autowired
    private UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;


    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.sendMessage")
    public void processMessage(ChatMessage chatMessage , Principal principal) {

        chatMessage.setTimestamp(Instant.now());
        logger.info("WS PRINCIPAL = " + principal.getName());
        String recipientDestination = "/queue/messages";
        Optional<User> user = userRepository.findById(Long.valueOf(chatMessage.getRecipientId()));
        String userName = user.get().getUsername();
        messagingTemplate.convertAndSendToUser(
                userName,
                recipientDestination,
                chatMessage
        );
    }
}
