package com.siaw.backend.dto;

import com.siaw.backend.entity.Conversation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    private String id;
    private String customerName;
    private String phone;
    private String customerPhone;
    private String status;
    private String statusCode;
    private String assignedTo;
    private String avatar;
    private int unreadCount;
    private String lastActivity;
    private String createdAt;
    private String updatedAt;

    @Builder.Default
    private List<MessageDTO> messages = new ArrayList<>();

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter FULL_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public static ConversationDTO fromEntity(Conversation conv) {
        if (conv == null) return null;

        List<MessageDTO> msgs = new ArrayList<>();
        if (conv.getMessages() != null) {
            msgs = conv.getMessages().stream()
                    .map(MessageDTO::fromEntity)
                    .toList();
        }

        String lastAct = conv.getUpdatedAt() != null ? conv.getUpdatedAt().format(TIME_FORMATTER) : "Agora";

        return ConversationDTO.builder()
                .id(String.valueOf(conv.getId()))
                .customerName(conv.getCustomerName())
                .phone(conv.getCustomerPhone())
                .customerPhone(conv.getCustomerPhone())
                .status(conv.getStatus().getDescription())
                .statusCode(conv.getStatus().name())
                .assignedTo(conv.getAssignedTo())
                .avatar(conv.getAvatar() != null ? conv.getAvatar() : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces")
                .unreadCount(conv.getUnreadCount())
                .lastActivity(lastAct)
                .createdAt(conv.getCreatedAt() != null ? conv.getCreatedAt().format(FULL_FORMATTER) : "")
                .updatedAt(conv.getUpdatedAt() != null ? conv.getUpdatedAt().format(FULL_FORMATTER) : "")
                .messages(msgs)
                .build();
    }
}
