# SIAW – Sistema Inteligente de Atendimento via WhatsApp (Frontend)

Frontend moderno, responsivo e padronizado em **1280x720** (ideal para capturas de tela e documentação ABNT) desenvolvido para o Projeto Integrador.

---

## 🛠️ Tecnologias Utilizadas

- **React 18** + **Vite 6**
- **Tailwind CSS 3** (Paleta oficial: `slate-50`, `slate-200`, `slate-900`, `emerald-600` e cores do WhatsApp)
- **Lucide React** (Ícones modernos e consistentes)
- **React Router DOM v6** (Rotas protegidas e navegação SPA)
- **Recharts** (Gráficos analíticos de atendimento)
- **Context API** (`AuthContext` e `ChatContext` compartilhados com persistência em `localStorage`)

---

## 🚀 Como Executar o Projeto

1. Acesse o diretório do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências (já instaladas):
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse no navegador:
   `http://localhost:5173`

---

## 🔐 Credenciais de Demonstração

Para facilitar apresentações e testes rápidos:

- **Administrador:**
  - **E-mail:** `admin@siaw.com`
  - **Senha:** `123456`
  - **Perfil:** Administrador
- **Operador de Atendimento:**
  - **E-mail:** `operador@siaw.com`
  - **Senha:** `123456`
  - **Perfil:** Operador

*(Há botões de preenchimento rápido na própria tela de Login)*

---

## 📱 Estrutura das 5 Telas Implementadas

1. **Tela 1 – Login e Autenticação (`/login`)**
   - Autenticação com e-mail corporativo e senha com alternância de visibilidade.
   - Seleção de perfil (Administrador / Operador).
   - Validações, mensagens de erro e salvamento de sessão no `localStorage`.

2. **Tela 2 – Dashboard Administrativo (`/dashboard`)**
   - 4 Cards de KPIs: Total de Atendimentos (hoje/mês), Taxa de Automação da IA (78.4%), Tempo Médio de Resposta (12s) e Conversas em Transbordo Humano.
   - Gráfico de barras com Recharts: Volume de mensagens dos últimos 7 dias (IA vs. Humano).
   - Tabela de "Últimos Atendimentos" com status, última atividade e atalho direto para o chat.

3. **Tela 3 – Painel de Transbordo – Chat em Tempo Real (`/transbordo`)**
   - Layout em 2 colunas estilo WhatsApp Web / Zendesk.
   - Coluna da esquerda com busca e filtros rápidos: *Todas*, *Aguardando Humano*, *Em Atendimento*, *Com a IA*, *Finalizado*.
   - Coluna da direita com histórico completo e etiquetas visuais para Cliente, IA e Operador.
   - Ações em tempo real: **Assumir Conversa**, **Devolver para a IA** e **Finalizar Atendimento**.
   - Envio de mensagens pelo operador para o cliente.

4. **Tela 4 – Gestão da Base de Conhecimento / RAG (`/base-conhecimento`)**
   - Gerenciamento dos artigos e regras de negócio da academia (Planos, Horários, Políticas, FAQ).
   - Modal para cadastrar e editar perguntas e conteúdos detalhados que alimentam o prompt da IA.
   - Ativação/Desativação de itens em tempo real e confirmação antes de excluir.
   - Inicializada com 5 itens realistas sobre a academia FitLife Pro.

5. **Tela 5 – Simulador WhatsApp Web (`/simulador`)**
   - Interface idêntica ao WhatsApp (cabeçalho `#075E54`, fundo característico, balões verdes e brancos, double check azul).
   - Interação em tempo real como cliente final.
   - IA Generativa responde em ~1 segundo consultando a Base de Conhecimento (RAG).
   - Detecta intenção de transbordo (palavras como *"atendente"*, *"humano"*, *"cancelar"* ou botão rápido) e transfere automaticamente para a fila do Painel de Transbordo (Tela 3) de forma sincronizada!

---

## 🌐 Conexão com Backend & Fallback Automático

O arquivo [src/services/api.js](file:///C:/Users/Douglas/Desktop/projeto-pi/frontend/src/services/api.js) está pré-configurado para consumir a API REST em `http://localhost:8080/api`. Caso o backend Spring Boot esteja offline, a aplicação ativa **automaticamente o fallback mockado realista**, garantindo que 100% das telas e fluxos continuem funcionando perfeitamente sem erros.
