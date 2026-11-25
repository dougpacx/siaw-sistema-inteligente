package com.siaw.backend.service;

import com.siaw.backend.dto.KnowledgeItemDTO;
import com.siaw.backend.entity.KnowledgeItem;
import com.siaw.backend.repository.KnowledgeItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KnowledgeService {

    private final KnowledgeItemRepository knowledgeItemRepository;

    public List<KnowledgeItemDTO> getAll(String query, String category) {
        List<KnowledgeItem> items;
        if ((query != null && !query.isBlank()) || (category != null && !category.isBlank() && !category.equalsIgnoreCase("Todas"))) {
            items = knowledgeItemRepository.search(query, category);
        } else {
            items = knowledgeItemRepository.findAll();
        }
        return items.stream()
                .map(KnowledgeItemDTO::fromEntity)
                .toList();
    }

    public KnowledgeItemDTO getById(Long id) {
        KnowledgeItem item = knowledgeItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado: " + id));
        return KnowledgeItemDTO.fromEntity(item);
    }

    @Transactional
    public KnowledgeItemDTO create(KnowledgeItemDTO dto) {
        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Título é obrigatório.");
        }
        if (dto.getContent() == null || dto.getContent().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Conteúdo é obrigatório.");
        }

        boolean active = dto.getStatus() == null || dto.getStatus().equalsIgnoreCase("Ativo") || dto.isActive();
        String category = dto.getCategory() != null && !dto.getCategory().isBlank() ? dto.getCategory() : "FAQ Geral";

        KnowledgeItem item = KnowledgeItem.builder()
                .title(dto.getTitle().trim())
                .category(category.trim())
                .content(dto.getContent().trim())
                .active(active)
                .build();

        KnowledgeItem saved = knowledgeItemRepository.save(item);
        return KnowledgeItemDTO.fromEntity(saved);
    }

    @Transactional
    public KnowledgeItemDTO update(Long id, KnowledgeItemDTO dto) {
        KnowledgeItem item = knowledgeItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado: " + id));

        if (dto.getTitle() != null && !dto.getTitle().isBlank()) {
            item.setTitle(dto.getTitle().trim());
        }
        if (dto.getCategory() != null && !dto.getCategory().isBlank()) {
            item.setCategory(dto.getCategory().trim());
        }
        if (dto.getContent() != null && !dto.getContent().isBlank()) {
            item.setContent(dto.getContent().trim());
        }
        if (dto.getStatus() != null) {
            item.setActive(dto.getStatus().equalsIgnoreCase("Ativo"));
        } else if (dto.isActive() != item.isActive()) {
            item.setActive(dto.isActive());
        }

        KnowledgeItem updated = knowledgeItemRepository.save(item);
        return KnowledgeItemDTO.fromEntity(updated);
    }

    @Transactional
    public void delete(Long id) {
        if (!knowledgeItemRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado: " + id);
        }
        knowledgeItemRepository.deleteById(id);
    }

    @Transactional
    public KnowledgeItemDTO toggleStatus(Long id) {
        KnowledgeItem item = knowledgeItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado: " + id));
        item.setActive(!item.isActive());
        KnowledgeItem updated = knowledgeItemRepository.save(item);
        return KnowledgeItemDTO.fromEntity(updated);
    }
}
