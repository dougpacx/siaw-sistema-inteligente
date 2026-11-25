package com.siaw.backend.service;

import com.siaw.backend.dto.ConversationDTO;
import com.siaw.backend.dto.MessageDTO;
import com.siaw.backend.dto.SendMessageRequest;
import com.siaw.backend.entity.Conversation;
import com.siaw.backend.entity.ConversationStatus;
import com.siaw.backend.entity.Message;
import com.siaw.backend.entity.SenderType;
import com.siaw.backend.repository.ConversationRepository;
import com.siaw.backend.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;

    public List<ConversationDTO> getAll(String status) {
        List<Conversation> list;
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("Todas")) {
            ConversationStatus convStatus = ConversationStatus.fromString(status);
            list = conversationRepository.findByStatusOrderByUpdatedAtDesc(convStatus);
        } else {
            list = conversationRepository.findAllByOrderByUpdatedAtDesc();
        }
        return list.stream()
                .map(ConversationDTO::fromEntity)
                .toList();
    }

    public ConversationDTO getById(Long id) {
        Conversation conv = conversationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversa não encontrada: " + id));
        return ConversationDTO.fromEntity(conv);
    }

    public List<MessageDTO> getMessages(Long conversationId) {
        if (!conversationRepository.existsById(conversationId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversa não encontrada: " + conversationId);
        }
        List<Message> messages = messageRepository.findByConversationIdOrderByTimestampAsc(conversationId);
        return messages.stream()
                .map(MessageDTO::fromEntity)
                .toList();
    }

    @Transactional
    public MessageDTO sendOperatorMessage(Long conversationId, SendMessageRequest request) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversa não encontrada: " + conversationId));

        String text = request.getResolvedText();
        if (text.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O conteúdo da mensagem não pode ser vazio.");
        }

        String operator = request.getOperatorName() != null && !request.getOperatorName().isBlank()
                ? request.getOperatorName().trim() : "Operador SIAW";

        Message message = Message.builder()
                .conversation(conv)
                .senderType(SenderType.OPERATOR)
                .operatorName(operator)
                .content(text)
                .timestamp(LocalDateTime.now())
                .build();

        conv.addMessage(message);
        conv.setStatus(ConversationStatus.HUMAN_ACTIVE);
        conv.setAssignedTo(operator);
        conv.setUnreadCount(0);

        conversationRepository.save(conv);
        Message saved = messageRepository.save(message);

        return MessageDTO.fromEntity(saved);
    }

    @Transactional
    public ConversationDTO updateStatus(Long conversationId, String statusStr, String operatorName) {
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversa não encontrada: " + conversationId));

        ConversationStatus newStatus = ConversationStatus.fromString(statusStr);
        conv.setStatus(newStatus);

        if (newStatus == ConversationStatus.HUMAN_ACTIVE) {
            String op = operatorName != null && !operatorName.isBlank() ? operatorName.trim() : "Administrador SIAW";
            conv.setAssignedTo(op);
            conv.setUnreadCount(0);
        } else if (newStatus == ConversationStatus.AI_ACTIVE) {
            conv.setAssignedTo(null);
            // Add system note
            Message sysMsg = Message.builder()
                    .conversation(conv)
                    .senderType(SenderType.AI)
                    .content("Atendimento retornado para a assistente virtual inteligente.")
                    .timestamp(LocalDateTime.now())
                    .build();
            conv.addMessage(sysMsg);
        } else if (newStatus == ConversationStatus.FINISHED) {
            conv.setUnreadCount(0);
            Message finishMsg = Message.builder()
                    .conversation(conv)
                    .senderType(SenderType.AI)
                    .content("Atendimento finalizado. Obrigado por entrar em contato com a FitLife Pro! Tenha um ótimo treino! 🏋️‍♂️")
                    .timestamp(LocalDateTime.now())
                    .build();
            conv.addMessage(finishMsg);
        }

        Conversation saved = conversationRepository.save(conv);
        return ConversationDTO.fromEntity(saved);
    }
}
