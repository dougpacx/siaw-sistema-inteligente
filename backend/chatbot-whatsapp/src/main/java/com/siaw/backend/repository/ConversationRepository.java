package com.siaw.backend.repository;

import com.siaw.backend.entity.Conversation;
import com.siaw.backend.entity.ConversationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByCustomerPhone(String customerPhone);

    List<Conversation> findAllByOrderByUpdatedAtDesc();

    List<Conversation> findByStatusOrderByUpdatedAtDesc(ConversationStatus status);

    long countByStatus(ConversationStatus status);

    @Query("SELECT COUNT(c) FROM Conversation c WHERE c.status = 'AI_ACTIVE'")
    long countAiHandled();
}
