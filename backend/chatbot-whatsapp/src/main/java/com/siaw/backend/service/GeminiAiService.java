package com.siaw.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.siaw.backend.dto.ChatMessageResponse;
import com.siaw.backend.entity.KnowledgeItem;
import com.siaw.backend.repository.KnowledgeItemRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@Slf4j
public class GeminiAiService {

    private final KnowledgeItemRepository knowledgeItemRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String model;

    private static final List<String> TRANSBORDO_KEYWORDS = List.of(
            "atendente", "humano", "pessoa", "cancelar", "cancelamento",
            "falar com pessoa", "atendimento humano", "gerente", "reclamação",
            "reclamar", "procon", "operador", "humana"
    );

    public GeminiAiService(KnowledgeItemRepository knowledgeItemRepository) {
        this.knowledgeItemRepository = knowledgeItemRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public ChatMessageResponse processUserMessage(String userMessage) {
        String lower = userMessage.toLowerCase().trim();

        // 1. Transbordo Rule: Detect human assistance intent
        boolean needsTransbordo = TRANSBORDO_KEYWORDS.stream().anyMatch(lower::contains);
        if (needsTransbordo) {
            return ChatMessageResponse.builder()
                    .response("Compreendo perfeitamente a sua necessidade. Estou transferindo o seu atendimento para a nossa equipe de recepção e consultores humanos agora mesmo! Por favor, aguarde alguns instantes que você já será atendido(a).")
                    .isTransbordo(true)
                    .matchedKb(null)
                    .build();
        }

        // 2. Fetch active Knowledge Base items for RAG
        List<KnowledgeItem> activeKnowledge = knowledgeItemRepository.findByActiveTrue();

        // 3. If Gemini API Key is provided, call Google Gemini via REST API
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                String aiResponse = callGeminiWithRag(userMessage, activeKnowledge);
                if (aiResponse != null && !aiResponse.isBlank()) {
                    return ChatMessageResponse.builder()
                            .response(aiResponse)
                            .isTransbordo(false)
                            .matchedKb("Google Gemini 1.5 Flash (RAG)")
                            .build();
                }
            } catch (Exception e) {
                log.warn("Gemini API call failed, falling back to local RAG engine: {}", e.getMessage());
            }
        }

        // 4. Intelligent Local RAG Fallback
        return localRagFallback(userMessage, activeKnowledge);
    }

    private String callGeminiWithRag(String userMessage, List<KnowledgeItem> knowledgeItems) throws Exception {
        StringBuilder context = new StringBuilder();
        for (KnowledgeItem item : knowledgeItems) {
            context.append("--- ").append(item.getTitle()).append(" (Categoria: ").append(item.getCategory()).append(") ---\n")
                    .append(item.getContent()).append("\n\n");
        }

        String prompt = String.format("""
                Você é a assistente virtual inteligente da Academia FitLife Pro no WhatsApp.
                Responda de forma amigável, clara, concisa e profissional em português (pt-BR).
                Use APENAS as informações oficiais da Base de Conhecimento abaixo para responder.
                Se a dúvida não constar na base, informe educadamente que você é um assistente virtual e que o cliente pode digitar 'falar com atendente' a qualquer momento.

                BASE DE CONHECIMENTO OFICIAL:
                %s

                PERGUNTA DO CLIENTE:
                %s
                """, context, userMessage);

        String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", model, apiKey);

        Map<String, Object> contentPart = Map.of("text", prompt);
        Map<String, Object> contents = Map.of("parts", List.of(contentPart));
        Map<String, Object> requestBody = Map.of("contents", List.of(contents));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    return parts.get(0).path("text").asText();
                }
            }
        }
        return null;
    }

    private ChatMessageResponse localRagFallback(String userMessage, List<KnowledgeItem> knowledgeItems) {
        String lower = userMessage.toLowerCase().trim();

        KnowledgeItem bestMatch = null;
        int highestScore = 0;

        for (KnowledgeItem item : knowledgeItems) {
            int score = 0;
            String titleLower = item.getTitle().toLowerCase();
            String contentLower = item.getContent().toLowerCase();

            if (lower.contains("plano") || lower.contains("preço") || lower.contains("valor") || lower.contains("mensalidade") || lower.contains("black") || lower.contains("smart")) {
                if (titleLower.contains("plano") || item.getCategory().equalsIgnoreCase("Planos")) score += 10;
            }
            if (lower.contains("horário") || lower.contains("hora") || lower.contains("funciona") || lower.contains("abre") || lower.contains("fecha") || lower.contains("domingo") || lower.contains("sábado")) {
                if (titleLower.contains("horário") || item.getCategory().equalsIgnoreCase("Horários")) score += 10;
            }
            if (lower.contains("onde") || lower.contains("endereço") || lower.contains("local") || lower.contains("estacionamento") || lower.contains("metrô") || lower.contains("fica")) {
                if (titleLower.contains("localização") || titleLower.contains("endereço") || contentLower.contains("paulista")) score += 10;
            }
            if (lower.contains("aula") || lower.contains("experimental") || lower.contains("matrícula") || lower.contains("avaliação") || lower.contains("spinning") || lower.contains("treinar")) {
                if (titleLower.contains("experimental") || titleLower.contains("matrícula")) score += 10;
            }
            if (lower.contains("trancar") || lower.contains("trancamento")) {
                if (titleLower.contains("cancelamento") || titleLower.contains("política")) score += 10;
            }

            if (score > highestScore) {
                highestScore = score;
                bestMatch = item;
            }
        }

        if (bestMatch != null && highestScore > 0) {
            String reply = String.format("Com base em nossas informações oficiais sobre \"%s\":\n\n%s\n\nPosso te ajudar com mais alguma informação sobre a FitLife Pro?",
                    bestMatch.getTitle(), bestMatch.getContent());
            return ChatMessageResponse.builder()
                    .response(reply)
                    .isTransbordo(false)
                    .matchedKb(bestMatch.getTitle())
                    .build();
        }

        // Standard Greeting
        if (lower.matches(".*\\b(oi|olá|ola|bom dia|boa tarde|boa noite|opa|e aí)\\b.*")) {
            return ChatMessageResponse.builder()
                    .response("Olá! Sou a assistente inteligente da Academia FitLife Pro via WhatsApp 🏋️‍♂️.\n\nComo posso te ajudar hoje? Você pode me perguntar sobre:\n1. Planos e valores de mensalidade\n2. Horário de funcionamento\n3. Localização e estacionamento\n4. Agendar aula experimental gratuita\n\nSe preferir falar com a nossa equipe humana, basta digitar \"falar com atendente\".")
                    .isTransbordo(false)
                    .matchedKb(null)
                    .build();
        }

        // Generic friendly reply
        return ChatMessageResponse.builder()
                .response("Obrigado pela sua mensagem! Para essa dúvida específica ou para um atendimento personalizado, você pode digitar \"falar com atendente\" ou me perguntar sobre nossos planos, horários de funcionamento e agendamento de aula experimental gratuita!")
                .isTransbordo(false)
                .matchedKb(null)
                .build();
    }
}
