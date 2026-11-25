package com.siaw.backend.dto;

import com.siaw.backend.entity.KnowledgeItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KnowledgeItemDTO {
    private String id;
    private String title;
    private String category;
    private String content;
    private String status;
    private boolean active;
    private String updatedAt;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public static KnowledgeItemDTO fromEntity(KnowledgeItem item) {
        if (item == null) return null;
        return KnowledgeItemDTO.builder()
                .id(String.valueOf(item.getId()))
                .title(item.getTitle())
                .category(item.getCategory())
                .content(item.getContent())
                .status(item.isActive() ? "Ativo" : "Inativo")
                .active(item.isActive())
                .updatedAt(item.getUpdatedAt() != null ? item.getUpdatedAt().format(FORMATTER) : "")
                .build();
    }
}
