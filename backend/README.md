# SIAW – Sistema Inteligente de Atendimento via WhatsApp (Backend)

Backend completo desenvolvido em **Java 21**, **Spring Boot 3.3.5**, **Spring Data JPA**, **PostgreSQL** (+ **H2** fallback em memória) e integração com **Google Gemini (RAG)**.

---

## 🏗️ Arquitetura do Projeto

O código está estruturado no pacote principal `com.siaw.backend`:

- `com.siaw.backend.config`:
  - `CorsConfig`: Liberação global de CORS para `http://localhost:5173` e origens locais (todos os métodos HTTP: `GET, POST, PUT, PATCH, DELETE, OPTIONS`).
  - `DataInitializer`: Executado automaticamente na inicialização via `CommandLineRunner` para popular o banco de dados caso esteja vazio (2 usuários, 5 itens de conhecimento e 4 conversas realistas).
- `com.siaw.backend.entity`:
  - `User`: Administradores e Operadores (`ADMIN`, `OPERATOR`).
  - `KnowledgeItem`: Base de conhecimento oficial da academia FitLife Pro para o RAG.
  - `Conversation`: Sessões de atendimento (`AI_ACTIVE`, `WAITING_HUMAN`, `HUMAN_ACTIVE`, `FINISHED`).
  - `Message`: Mensagens trocadas entre Cliente, IA e Operador.
- `com.siaw.backend.dto`: Contratos JSON padronizados com o frontend React.
- `com.siaw.backend.repository`: Interfaces Spring Data JPA para persistência.
- `com.siaw.backend.service`:
  - `AuthService`: Autenticação e validação de operadores e administradores.
  - `KnowledgeService`: CRUD e busca da base de conhecimento.
  - `ConversationService`: Gestão das filas de transbordo e mensagens de operadores.
  - `DashboardService`: Cálculo em tempo real dos KPIs e volume de atendimento.
  - `GeminiAiService`: Detecção de intenção de transbordo e motor RAG com Google Gemini (com fallback inteligente se a API key não for informada).
  - `ChatService`: Orquestrador de mensagens recebidas via WhatsApp.
- `com.siaw.backend.controller`:
  - `AuthController`: `/api/auth/login`
  - `DashboardController`: `/api/dashboard` e `/api/dashboard/metrics`
  - `KnowledgeController`: `/api/knowledge` e `/api/knowledge-base`
  - `ConversationController`: `/api/conversations` e `/api/transbordo/conversas`
  - `ChatController`: `/api/chat`

---

## 🚀 Como Executar o Backend

### 1. Execução Rápida para Desenvolvimento (H2 em memória, sem necessidade de banco externo)

O projeto já vem pré-configurado com fallback automático para banco de dados **H2 em modo de compatibilidade PostgreSQL**. Basta executar:

```bash
cd backend/chatbot-whatsapp
./mvnw spring-boot:run
```
*(No Windows PowerShell, use `.\mvnw spring-boot:run`)*

O servidor iniciará em **`http://localhost:8080`**.
O console H2 para inspeção visual do banco de dados fica acessível em:
`http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:siawdb`, Usuário: `sa`, Senha: em branco).

---

### 2. Execução com PostgreSQL / Supabase (Produção)

Para conectar ao PostgreSQL (como Supabase ou banco local), defina as variáveis de ambiente antes de subir o projeto:

```bash
# Exemplo no Windows PowerShell:
$env:DB_URL="jdbc:postgresql://db.seu-projeto.supabase.co:5432/postgres"
$env:DB_USER="postgres"
$env:DB_PASS="sua_senha_secreta"
.\mvnw spring-boot:run
```

---

### 3. Configuração do Google Gemini (Opcional)

Por padrão, o backend possui um motor **RAG inteligente local** que responde perguntas de academia mesmo sem internet/chave externa.
Se você desejar utilizar a IA Generativa real do Google Gemini 1.5 Flash:

```bash
# Windows PowerShell:
$env:GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
.\mvnw spring-boot:run
```

---

## 🔐 Credenciais de Acesso Pré-Cadastradas

| Perfil | E-mail | Senha |
|---|---|---|
| **Administrador** | `admin@siaw.com` | `123456` |
| **Operador** | `operador@siaw.com` | `123456` |

---

## 📋 Endpoints da API REST (`/api`)

### Autenticação
- `POST /api/auth/login`: Realiza login e retorna dados do usuário autenticado.

### Dashboard
- `GET /api/dashboard`: Retorna KPIs (total hoje/mês, taxa de automação da IA, tempo médio de resposta, transbordo), série de volume dos últimos 7 dias e lista dos últimos atendimentos.

### Base de Conhecimento (RAG)
- `GET /api/knowledge`: Lista todos os artigos cadastrados (suporta `?query=` e `?category=`).
- `GET /api/knowledge/{id}`: Detalhes de um artigo.
- `POST /api/knowledge`: Cadastra novo conhecimento para a IA.
- `PUT /api/knowledge/{id}`: Atualiza conhecimento existente.
- `DELETE /api/knowledge/{id}`: Remove artigo da base.
- `PATCH /api/knowledge/{id}/status`: Alterna entre Ativo / Inativo.

### Painel de Transbordo & Conversas
- `GET /api/conversations`: Lista todas as conversas (suporta filtro `?status=Aguardando Humano`, etc.).
- `GET /api/conversations/{id}/messages`: Histórico completo da conversa.
- `POST /api/conversations/{id}/messages`: Envia resposta do operador humano (altera status para `Em Atendimento`).
- `PATCH /api/conversations/{id}/status`: Altera status da conversa (**Assumir Conversa**, **Devolver para a IA**, **Finalizar Atendimento**).

### Simulador WhatsApp (Chat & RAG)
- `POST /api/chat`: Recebe mensagem do cliente (`message` ou `text`, `customerPhone`, `customerName`).
  - Se contiver termos como *"atendente"*, *"humano"*, *"cancelar"*, aciona a **Regra de Transbordo** e coloca a conversa como `Aguardando Humano`.
  - Se for dúvida comum, consulta a base de conhecimento via RAG e retorna resposta formulada.
