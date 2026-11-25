package com.siaw.backend.dto;

import com.siaw.backend.entity.Message;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private String id;
    private String sender;
    private String senderType;
    private String operatorName;
    private String text;
    private String content;
    private String time;
    private String timestamp;

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    private static final DateTimeFormatter FULL_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public static MessageDTO fromEntity(Message message) {
        if (message == null) return null;

        String senderStr = switch (message.getSenderType()) {
            case CUSTOMER -> "customer";
            case AI -> "ai";
            case OPERATOR -> "operator";
        };

        String timeStr = message.getTimestamp() != null ? message.getTimestamp().format(TIME_FORMATTER) : "";
        String fullTimeStr = message.getTimestamp() != null ? message.getTimestamp().format(FULL_FORMATTER) : "";

        return MessageDTO.builder()
                .id(String.valueOf(message.getId()))
                .sender(senderStr)
                .senderType(message.getSenderType().name())
                .operatorName(message.getOperatorName())
                .text(message.getContent())
                .content(message.getContent())
                .time(timeStr)
                .timestamp(fullTimeStr)
                .build();
    }
}
