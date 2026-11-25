package com.siaw.backend.service;

import com.siaw.backend.dto.ChatMessageRequest;
import com.siaw.backend.dto.ChatMessageResponse;
import com.siaw.backend.dto.ConversationDTO;
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

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final GeminiAiService geminiAiService;

    @Transactional
    public ChatMessageResponse processIncomingMessage(ChatMessageRequest request) {
        String text = request.getResolvedText();
        if (text.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O texto da mensagem é obrigatório.");
        }

        String phone = request.getResolvedPhone();
        String name = request.getResolvedName();

        // 1. Find or create conversation by phone
        Conversation conv = conversationRepository.findByCustomerPhone(phone)
                .orElseGet(() -> conversationRepository.save(Conversation.builder()
                        .customerName(name)
                        .customerPhone(phone)
                        .status(ConversationStatus.AI_ACTIVE)
                        .unreadCount(0)
                        .avatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces")
                        .build()));

        // 2. Save incoming Customer message
        Message customerMsg = Message.builder()
                .conversation(conv)
                .senderType(SenderType.CUSTOMER)
                .content(text)
                .timestamp(LocalDateTime.now())
                .build();
        conv.addMessage(customerMsg);

        // 3. If conversation is currently assumed by an operator, do not let AI interrupt
        if (conv.getStatus() == ConversationStatus.HUMAN_ACTIVE) {
            conv.setUnreadCount(conv.getUnreadCount() + 1);
            conversationRepository.save(conv);
            messageRepository.save(customerMsg);

            return ChatMessageResponse.builder()
                    .response("Mensagem recebida pelo operador humano em atendimento.")
                    .isTransbordo(true)
                    .conversation(ConversationDTO.fromEntity(conv))
                    .build();
        }

        // 4. Process AI / RAG / Transbordo response
        ChatMessageResponse aiResult = geminiAiService.processUserMessage(text);

        // 5. Save AI response message
        Message aiMsg = Message.builder()
                .conversation(conv)
                .senderType(SenderType.AI)
                .content(aiResult.getResponse())
                .timestamp(LocalDateTime.now())
                .build();
        conv.addMessage(aiMsg);

        // 6. Handle transbordo transition
        if (aiResult.isTransbordo()) {
            conv.setStatus(ConversationStatus.WAITING_HUMAN);
            conv.setUnreadCount(conv.getUnreadCount() + 1);
        }

        Conversation savedConv = conversationRepository.save(conv);
        messageRepository.save(customerMsg);
        messageRepository.save(aiMsg);

        aiResult.setConversation(ConversationDTO.fromEntity(savedConv));
        return aiResult;
    }
}
