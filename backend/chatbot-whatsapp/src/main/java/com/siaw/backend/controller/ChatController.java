package com.siaw.backend.controller;

import com.siaw.backend.dto.ChatMessageRequest;
import com.siaw.backend.dto.ChatMessageResponse;
import com.siaw.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatMessageResponse> sendMessage(@RequestBody ChatMessageRequest request) {
        ChatMessageResponse response = chatService.processIncomingMessage(request);
        return ResponseEntity.ok(response);
    }
}
