package com.startupxpo.backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {

    private String senderId;
    private String recipientId;
    private String content;
    private Instant timestamp;

}
