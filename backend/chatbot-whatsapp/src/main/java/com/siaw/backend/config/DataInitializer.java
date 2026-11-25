package com.siaw.backend.config;

import com.siaw.backend.entity.*;
import com.siaw.backend.repository.ConversationRepository;
import com.siaw.backend.repository.KnowledgeItemRepository;
import com.siaw.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final KnowledgeItemRepository knowledgeItemRepository;
    private final ConversationRepository conversationRepository;

    @Override
    public void run(String... args) {
        seedUsers();
        seedKnowledgeItems();
        seedConversations();
        log.info("SIAW Backend database seeding verified successfully.");
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .name("Administrador SIAW")
                    .email("admin@siaw.com")
                    .password("123456")
                    .role(UserRole.ADMIN)
                    .createdAt(LocalDateTime.now())
                    .build();

            User operator = User.builder()
                    .name("Operador de Atendimento")
                    .email("operador@siaw.com")
                    .password("123456")
                    .role(UserRole.OPERATOR)
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.saveAll(List.of(admin, operator));
            log.info("Seeded 2 initial users (admin@siaw.com, operador@siaw.com)");
        }
    }

    private void seedKnowledgeItems() {
        if (knowledgeItemRepository.count() == 0) {
            List<KnowledgeItem> items = List.of(
                    KnowledgeItem.builder()
                            .title("Planos e Valores")
                            .category("Planos")
                            .content("""
                                    Temos 3 opções de planos principais na Academia FitLife Pro:
                                    1. Plano Smart (R$ 99,90/mês): Acesso ilimitado à musculação e ergometria no horário das 10h às 16h.
                                    2. Plano Black (R$ 139,90/mês): Acesso livre em qualquer horário, todas as aulas coletivas (spinning, yoga, muay thai), direito a levar 1 amigo 4x no mês e acesso a qualquer unidade da rede.
                                    3. Plano VIP Personal (R$ 259,90/mês): Todos os benefícios do Plano Black + 2 sessões semanais com personal trainer e acompanhamento com nutricionista.
                                    Nenhum dos planos possui taxa de matrícula ou taxa de adesão neste mês promocional!""")
                            .active(true)
                            .updatedAt(LocalDateTime.now().minusDays(1))
                            .build(),

                    KnowledgeItem.builder()
                            .title("Horário de Funcionamento")
                            .category("Horários")
                            .content("""
                                    Nosso horário de funcionamento é amplo para atender toda a sua rotina:
                                    • Segunda a Sexta-feira: 06:00 às 23:00
                                    • Sábados: 08:00 às 18:00
                                    • Domingos e Feriados: 09:00 às 14:00
                                    Aulas coletivas ocorrem das 07:00 às 11:00 e das 17:30 às 21:30. A grade completa atualizada está disponível no aplicativo do aluno.""")
                            .active(true)
                            .updatedAt(LocalDateTime.now().minusDays(2))
                            .build(),

                    KnowledgeItem.builder()
                            .title("Endereço e Estacionamento")
                            .category("FAQ Geral")
                            .content("""
                                    Estamos localizados na Av. Paulista, 1000 - Bela Vista, São Paulo - SP (a apenas 150 metros da estação de metrô Trianon-Masp).
                                    Dispomos de estacionamento próprio conveniado gratuito por até 2 horas para alunos durante o período do treino com validação na recepção central.""")
                            .active(true)
                            .updatedAt(LocalDateTime.now().minusDays(3))
                            .build(),

                    KnowledgeItem.builder()
                            .title("Matrícula e Avaliação Física")
                            .category("Políticas")
                            .content("""
                                    A aula experimental e a avaliação física inicial são 100% gratuitas! Você pode conhecer nossa estrutura, fazer uma sessão de musculação ou participar de uma aula coletiva de spinning ou funcional.
                                    Para agendar, basta comparecer com documento com foto e roupa esportiva ou solicitar o agendamento por este canal informando seu nome completo e dia desejado. A matrícula pode ser feita online via cartão de crédito ou PIX, ou presencialmente.""")
                            .active(true)
                            .updatedAt(LocalDateTime.now().minusDays(4))
                            .build(),

                    KnowledgeItem.builder()
                            .title("Política de Cancelamento")
                            .category("Políticas")
                            .content("""
                                    Prezamos pela transparência total com nossos alunos:
                                    • Cancelamento: O plano mensal sem fidelidade pode ser cancelado a qualquer momento com aviso prévio de 30 dias, sem cobrança de multas contratuais.
                                    • Trancamento: Em caso de viagem, férias ou recomendação médica, você pode trancar seu plano por até 60 dias por ano sem custo adicional. Para iniciar o procedimento com um de nossos consultores humanos, digite "falar com atendente".""")
                            .active(true)
                            .updatedAt(LocalDateTime.now().minusDays(5))
                            .build()
            );

            knowledgeItemRepository.saveAll(items);
            log.info("Seeded 5 initial knowledge base items for RAG");
        }
    }

    private void seedConversations() {
        if (conversationRepository.count() == 0) {
            LocalDateTime now = LocalDateTime.now();

            // 1. Mariana Silveira (WAITING_HUMAN - Aguardando Humano)
            Conversation conv1 = Conversation.builder()
                    .customerName("Mariana Silveira")
                    .customerPhone("+55 11 99812-3456")
                    .status(ConversationStatus.WAITING_HUMAN)
                    .assignedTo(null)
                    .avatar("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces")
                    .unreadCount(2)
                    .createdAt(now.minusHours(1))
                    .updatedAt(now.minusMinutes(8))
                    .build();

            conv1.addMessage(Message.builder()
                    .senderType(SenderType.CUSTOMER)
                    .content("Boa tarde, gostaria de saber como funciona o cancelamento do meu plano Black.")
                    .timestamp(now.minusMinutes(12))
                    .build());
            conv1.addMessage(Message.builder()
                    .senderType(SenderType.AI)
                    .content("Olá Mariana! Nosso plano pode ser cancelado com aviso prévio de 30 dias sem multa contratual.")
                    .timestamp(now.minusMinutes(11))
                    .build());
            conv1.addMessage(Message.builder()
                    .senderType(SenderType.CUSTOMER)
                    .content("Entendi, mas tive um imprevisto financeiro urgente e preciso falar com um atendente humano para ver uma exceção por favor.")
                    .timestamp(now.minusMinutes(9))
                    .build());
            conv1.addMessage(Message.builder()
                    .senderType(SenderType.AI)
                    .content("Compreendo perfeitamente, Mariana. Estou transferindo seu atendimento para nossa equipe da recepção agora mesmo. Um momento, por favor!")
                    .timestamp(now.minusMinutes(8))
                    .build());

            // 2. Carlos Eduardo Mendes (HUMAN_ACTIVE - Em Atendimento)
            Conversation conv2 = Conversation.builder()
                    .customerName("Carlos Eduardo Mendes")
                    .customerPhone("+55 11 97234-8901")
                    .status(ConversationStatus.HUMAN_ACTIVE)
                    .assignedTo("Admin (Você)")
                    .avatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces")
                    .unreadCount(0)
                    .createdAt(now.minusHours(2))
                    .updatedAt(now.minusMinutes(15))
                    .build();

            conv2.addMessage(Message.builder()
                    .senderType(SenderType.CUSTOMER)
                    .content("Olá! Quero matricular eu e minha esposa no plano Black. Tem algum desconto especial para casal?")
                    .timestamp(now.minusMinutes(25))
                    .build());
            conv2.addMessage(Message.builder()
                    .senderType(SenderType.AI)
                    .content("Olá Carlos! O Plano Black custa R$ 139,90/mês individualmente com acesso total. Para planos em grupo/família, vou te conectar a um consultor.")
                    .timestamp(now.minusMinutes(24))
                    .build());
            conv2.addMessage(Message.builder()
                    .senderType(SenderType.OPERATOR)
                    .operatorName("Admin (Você)")
                    .content("Olá Carlos, sou o consultor de vendas. Temos uma condição especial com 15% de desconto na segunda matrícula este mês! Gostaria que eu preparasse sua proposta?")
                    .timestamp(now.minusMinutes(20))
                    .build());
            conv2.addMessage(Message.builder()
                    .senderType(SenderType.CUSTOMER)
                    .content("Excelente! Pode preparar sim, como envio os documentos?")
                    .timestamp(now.minusMinutes(15))
                    .build());

            // 3. Beatriz Vasconcelos (AI_ACTIVE - Resolvido pela IA)
            Conversation conv3 = Conversation.builder()
                    .customerName("Beatriz Vasconcelos")
                    .customerPhone("+55 11 98345-6789")
                    .status(ConversationStatus.AI_ACTIVE)
                    .assignedTo(null)
                    .avatar("https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces")
                    .unreadCount(0)
                    .createdAt(now.minusHours(3))
                    .updatedAt(now.minusMinutes(30))
                    .build();

            conv3.addMessage(Message.builder()
                    .senderType(SenderType.CUSTOMER)
                    .content("Qual o horário do spinning no sábado?")
                    .timestamp(now.minusMinutes(31))
                    .build());
            conv3.addMessage(Message.builder()
                    .senderType(SenderType.AI)
                    .content("Olá Beatriz! Aos sábados temos aulas de spinning às 09:30 e às 11:00 com o professor Rodrigo. A inscrição pode ser feita pelo aplicativo do aluno!")
                    .timestamp(now.minusMinutes(30))
                    .build());
            conv3.addMessage(Message.builder()
                    .senderType(SenderType.CUSTOMER)
                    .content("Maravilha, muito obrigada!")
                    .timestamp(now.minusMinutes(30))
                    .build());

            // 4. Rodrigo Albuquerque (FINISHED - Finalizado)
            Conversation conv4 = Conversation.builder()
                    .customerName("Rodrigo Albuquerque")
                    .customerPhone("+55 11 96452-1122")
                    .status(ConversationStatus.FINISHED)
                    .assignedTo("Operador Lucas")
                    .avatar("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces")
                    .unreadCount(0)
                    .createdAt(now.minusHours(5))
                    .updatedAt(now.minusHours(1))
                    .build();

            conv4.addMessage(Message.builder()
                    .senderType(SenderType.CUSTOMER)
                    .content("Esqueci minha garrafinha térmica no armário 42 ontem à noite.")
                    .timestamp(now.minusHours(2).minusMinutes(5))
                    .build());
            conv4.addMessage(Message.builder()
                    .senderType(SenderType.AI)
                    .content("Vou conectar você à recepção para verificar nosso setor de achados e perdidos.")
                    .timestamp(now.minusHours(2).minusMinutes(4))
                    .build());
            conv4.addMessage(Message.builder()
                    .senderType(SenderType.OPERATOR)
                    .operatorName("Operador Lucas")
                    .content("Olá Rodrigo, encontramos sua garrafa verde metálica! Ela está guardada na recepção central, pode retirar até as 23h.")
                    .timestamp(now.minusHours(1).minusMinutes(10))
                    .build());
            conv4.addMessage(Message.builder()
                    .senderType(SenderType.CUSTOMER)
                    .content("Perfeito, passo aí no fim da tarde. Obrigado!")
                    .timestamp(now.minusHours(1))
                    .build());

            conversationRepository.saveAll(List.of(conv1, conv2, conv3, conv4));
            log.info("Seeded 4 initial realistic conversations with message history");
        }
    }
}
