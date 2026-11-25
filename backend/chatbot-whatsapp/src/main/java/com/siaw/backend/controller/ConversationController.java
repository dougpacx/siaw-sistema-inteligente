package com.siaw.backend.controller;

import com.siaw.backend.dto.ConversationDTO;
import com.siaw.backend.dto.MessageDTO;
import com.siaw.backend.dto.SendMessageRequest;
import com.siaw.backend.dto.UpdateStatusRequest;
import com.siaw.backend.service.ConversationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/conversations", "/api/transbordo/conversas"})
@RequiredArgsConstructor
public class ConversationController {

    private final ConversationService conversationService;

    @GetMapping
    public ResponseEntity<List<ConversationDTO>> getAll(
            @RequestParam(required = false) String status) {
        List<ConversationDTO> list = conversationService.getAll(status);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConversationDTO> getById(@PathVariable Long id) {
        ConversationDTO conv = conversationService.getById(id);
        return ResponseEntity.ok(conv);
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<MessageDTO>> getMessages(@PathVariable Long id) {
        List<MessageDTO> messages = conversationService.getMessages(id);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<MessageDTO> sendOperatorMessage(
            @PathVariable Long id,
            @RequestBody SendMessageRequest request) {
        MessageDTO message = conversationService.sendOperatorMessage(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ConversationDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {
        ConversationDTO updated = conversationService.updateStatus(id, request.getStatus(), request.getOperatorName());
        return ResponseEntity.ok(updated);
    }
}
