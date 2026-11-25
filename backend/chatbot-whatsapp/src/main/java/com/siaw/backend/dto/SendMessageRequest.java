package com.siaw.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    private String text;
    private String content;
    private String operatorName;

    public String getResolvedText() {
        if (text != null && !text.isBlank()) return text.trim();
        if (content != null && !content.isBlank()) return content.trim();
        return "";
    }
}
