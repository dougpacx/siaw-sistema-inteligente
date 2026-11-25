package com.siaw.backend.entity;

public enum ConversationStatus {
    AI_ACTIVE("Com a IA"),
    WAITING_HUMAN("Aguardando Humano"),
    HUMAN_ACTIVE("Em Atendimento"),
    FINISHED("Finalizado");

    private final String description;

    ConversationStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public static ConversationStatus fromString(String value) {
        if (value == null) return AI_ACTIVE;
        String v = value.trim().toUpperCase();
        for (ConversationStatus status : values()) {
            if (status.name().equalsIgnoreCase(v) || status.description.equalsIgnoreCase(value.trim())) {
                return status;
            }
        }
        if (v.contains("AGUARDANDO") || v.contains("WAITING")) return WAITING_HUMAN;
        if (v.contains("ATENDIMENTO") || v.contains("HUMAN")) return HUMAN_ACTIVE;
        if (v.contains("FINALIZADO") || v.contains("FINISHED")) return FINISHED;
        return AI_ACTIVE;
    }
}
