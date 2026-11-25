package com.siaw.backend.repository;

import com.siaw.backend.entity.KnowledgeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KnowledgeItemRepository extends JpaRepository<KnowledgeItem, Long> {
    
    List<KnowledgeItem> findByActiveTrue();

    List<KnowledgeItem> findByCategory(String category);

    @Query("SELECT k FROM KnowledgeItem k WHERE " +
           "(:category IS NULL OR :category = 'Todas' OR LOWER(k.category) = LOWER(:category)) AND " +
           "(:query IS NULL OR :query = '' OR LOWER(k.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(k.content) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<KnowledgeItem> search(@Param("query") String query, @Param("category") String category);
}
