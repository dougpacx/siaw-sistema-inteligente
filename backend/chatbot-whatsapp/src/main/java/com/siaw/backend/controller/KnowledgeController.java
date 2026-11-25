package com.siaw.backend.controller;

import com.siaw.backend.dto.KnowledgeItemDTO;
import com.siaw.backend.service.KnowledgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/knowledge", "/api/knowledge-base"})
@RequiredArgsConstructor
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    @GetMapping
    public ResponseEntity<List<KnowledgeItemDTO>> getAll(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category) {
        List<KnowledgeItemDTO> list = knowledgeService.getAll(query, category);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<KnowledgeItemDTO> getById(@PathVariable Long id) {
        KnowledgeItemDTO item = knowledgeService.getById(id);
        return ResponseEntity.ok(item);
    }

    @PostMapping
    public ResponseEntity<KnowledgeItemDTO> create(@RequestBody KnowledgeItemDTO dto) {
        KnowledgeItemDTO created = knowledgeService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<KnowledgeItemDTO> update(@PathVariable Long id, @RequestBody KnowledgeItemDTO dto) {
        KnowledgeItemDTO updated = knowledgeService.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        knowledgeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<KnowledgeItemDTO> toggleStatus(@PathVariable Long id) {
        KnowledgeItemDTO updated = knowledgeService.toggleStatus(id);
        return ResponseEntity.ok(updated);
    }
}
