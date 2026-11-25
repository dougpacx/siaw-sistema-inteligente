package com.siaw.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponse {
    private String response;
    private boolean isTransbordo;
    private String matchedKb;
    private ConversationDTO conversation;
}
