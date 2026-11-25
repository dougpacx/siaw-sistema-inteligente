package com.siaw.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageRequest {
    private String message;
    private String text;
    private String customerName;
    private String customerPhone;
    private String phone;

    public String getResolvedText() {
        if (message != null && !message.isBlank()) return message.trim();
        if (text != null && !text.isBlank()) return text.trim();
        return "";
    }

    public String getResolvedPhone() {
        if (customerPhone != null && !customerPhone.isBlank()) return customerPhone.trim();
        if (phone != null && !phone.isBlank()) return phone.trim();
        return "+55 11 98765-4321";
    }

    public String getResolvedName() {
        if (customerName != null && !customerName.isBlank()) return customerName.trim();
        return "Cliente WhatsApp";
    }
}
