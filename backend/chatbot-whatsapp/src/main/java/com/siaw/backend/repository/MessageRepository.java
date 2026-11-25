package com.siaw.backend.repository;

import com.siaw.backend.entity.Message;
import com.siaw.backend.entity.SenderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByConversationIdOrderByTimestampAsc(Long conversationId);

    long countBySenderType(SenderType senderType);
}
