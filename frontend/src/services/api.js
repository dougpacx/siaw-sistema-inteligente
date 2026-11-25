// API Service layer with automatic REST backend connection and realistic mock fallback
// Backend expected URL: http://localhost:8080/api

const API_BASE_URL = 'http://localhost:8080/api';

// Initial realistic knowledge base items (Theme: Academia FitLife Pro)
export const INITIAL_KNOWLEDGE_BASE = [
  {
    id: 'kb-1',
    title: 'Planos e Mensalidades',
    category: 'Planos',
    content: 'Temos 3 opções de planos:\n1. Plano Smart (R$ 99,90/mês): Acesso ilimitado à musculação e ergometria no horário das 10h às 16h.\n2. Plano Black (R$ 139,90/mês): Acesso livre em qualquer horário, todas as aulas coletivas (spinning, yoga, muay thai), direito a levar 1 amigo 4x no mês e acesso a qualquer unidade da rede.\n3. Plano VIP Personal (R$ 259,90/mês): Todos os benefícios do Plano Black + 2 sessões semanais com personal trainer e acompanhamento com nutricionista.\nNenhum dos planos possui taxa de matrícula ou taxa de adesão neste mês promocional!',
    status: 'Ativo',
    updatedAt: '23/11/2026 10:15'
  },
  {
    id: 'kb-2',
    title: 'Horário de Funcionamento',
    category: 'Horários',
    content: 'Nosso horário de funcionamento é amplo para atender sua rotina:\n• Segunda a Sexta-feira: 06:00 às 23:00\n• Sábados: 08:00 às 18:00\n• Domingos e Feriados: 09:00 às 14:00\nAulas coletivas ocorrem das 07:00 às 11:00 e das 17:30 às 21:30. A grade completa atualizada está disponível no aplicativo do aluno.',
    status: 'Ativo',
    updatedAt: '22/11/2026 14:30'
  },
  {
    id: 'kb-3',
    title: 'Localização e Estacionamento',
    category: 'FAQ Geral',
    content: 'Estamos localizados na Av. Paulista, 1000 - Bela Vista, São Paulo - SP (a apenas 150 metros da estação de metrô Trianon-Masp).\nDispomos de estacionamento próprio conveniado gratuito por até 2 horas para alunos durante o período do treino com validação na recepção.',
    status: 'Ativo',
    updatedAt: '20/11/2026 09:00'
  },
  {
    id: 'kb-4',
    title: 'Agendamento de Aula Experimental e Matrícula',
    category: 'Políticas',
    content: 'A aula experimental é 100% gratuita! Você pode conhecer nossa estrutura, fazer uma sessão de musculação ou participar de uma aula coletiva de spinning ou funcional.\nPara agendar, basta comparecer com documento com foto e roupa esportiva ou solicitar o agendamento por este canal informando seu nome completo e dia desejado. A matrícula pode ser feita online via cartão de crédito ou PIX, ou presencialmente.',
    status: 'Ativo',
    updatedAt: '18/11/2026 16:45'
  },
  {
    id: 'kb-5',
    title: 'Política de Cancelamento e Trancamento',
    category: 'Políticas',
    content: 'Prezamos pela transparência total:\n• Cancelamento: O plano mensal sem fidelidade pode ser cancelado a qualquer momento com aviso prévio de 30 dias, sem cobrança de multas.\n• Trancamento: Em caso de viagem, férias ou recomendação médica, você pode trancar seu plano por até 60 dias por ano sem custo adicional. Para iniciar o procedimento com um de nossos atendentes, digite "falar com atendente".',
    status: 'Ativo',
    updatedAt: '15/11/2026 11:20'
  }
];

// Initial realistic conversations for Transbordo & WhatsApp Simulator
export const INITIAL_CONVERSATIONS = [
  {
    id: 'conv-simulador',
    customerName: 'Você (Simulador WhatsApp)',
    phone: '+55 11 98765-4321',
    status: 'Com a IA', // 'Com a IA' | 'Aguardando Humano' | 'Em Atendimento' | 'Finalizado'
    assignedTo: null,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    unreadCount: 0,
    lastActivity: 'Agora',
    messages: [
      {
        id: 'msg-s1',
        sender: 'ai', // 'customer' | 'ai' | 'operator'
        text: 'Olá! Sou a assistente virtual da Academia FitLife Pro. Como posso te ajudar hoje? Você pode tirar dúvidas sobre planos, horários, localização ou agendar uma aula experimental.',
        time: '12:55'
      }
    ]
  },
  {
    id: 'conv-101',
    customerName: 'Mariana Silveira',
    phone: '+55 11 99812-3456',
    status: 'Aguardando Humano',
    assignedTo: null,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    unreadCount: 2,
    lastActivity: '12:52',
    messages: [
      { id: 'm1', sender: 'customer', text: 'Boa tarde, gostaria de saber como funciona o cancelamento do meu plano Black.', time: '12:48' },
      { id: 'm2', sender: 'ai', text: 'Olá Mariana! Nosso plano pode ser cancelado com aviso prévio de 30 dias sem multa contratual.', time: '12:49' },
      { id: 'm3', sender: 'customer', text: 'Entendi, mas tive um imprevisto financeiro urgente e preciso falar com um atendente humano para ver uma exceção por favor.', time: '12:51' },
      { id: 'm4', sender: 'ai', text: 'Compreendo perfeitamente, Mariana. Estou transferindo seu atendimento para nossa equipe da recepção agora mesmo. Um momento, por favor!', time: '12:52' }
    ]
  },
  {
    id: 'conv-102',
    customerName: 'Carlos Eduardo Mendes',
    phone: '+55 11 97234-8901',
    status: 'Em Atendimento',
    assignedTo: 'Admin (Você)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    unreadCount: 0,
    lastActivity: '12:45',
    messages: [
      { id: 'm5', sender: 'customer', text: 'Olá! Quero matricular eu e minha esposa no plano Black. Tem algum desconto especial para casal?', time: '12:35' },
      { id: 'm6', sender: 'ai', text: 'Olá Carlos! O Plano Black custa R$ 139,90/mês individualmente com acesso total. Para planos corporativos ou em grupo/família, vou te conectar a um consultor.', time: '12:36' },
      { id: 'm7', sender: 'operator', text: 'Olá Carlos, sou o consultor de vendas. Temos uma condição especial com 15% de desconto na segunda matrícula este mês! Gostaria que eu preparasse sua proposta?', time: '12:40' },
      { id: 'm8', sender: 'customer', text: 'Excelente! Pode preparar sim, como envio os documentos?', time: '12:45' }
    ]
  },
  {
    id: 'conv-103',
    customerName: 'Beatriz Vasconcelos',
    phone: '+55 11 98345-6789',
    status: 'Com a IA',
    assignedTo: null,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
    unreadCount: 0,
    lastActivity: '12:30',
    messages: [
      { id: 'm9', sender: 'customer', text: 'Qual o horário do spinning no sábado?', time: '12:29' },
      { id: 'm10', sender: 'ai', text: 'Olá Beatriz! Aos sábados temos aulas de spinning às 09:30 e às 11:00 com o professor Rodrigo. A inscrição pode ser feita até 30 minutos antes pelo app!', time: '12:30' },
      { id: 'm11', sender: 'customer', text: 'Maravilha, muito obrigada!', time: '12:30' }
    ]
  },
  {
    id: 'conv-104',
    customerName: 'Rodrigo Albuquerque',
    phone: '+55 11 96452-1122',
    status: 'Finalizado',
    assignedTo: 'Operador Lucas',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    unreadCount: 0,
    lastActivity: '11:15',
    messages: [
      { id: 'm12', sender: 'customer', text: 'Esqueci minha garrafinha térmica no armário 42 ontem à noite.', time: '10:55' },
      { id: 'm13', sender: 'ai', text: 'Vou conectar você à recepção para verificar nosso setor de achados e perdidos.', time: '10:56' },
      { id: 'm14', sender: 'operator', text: 'Olá Rodrigo, encontramos sua garrafa verde metálica! Ela está guardada na recepção central, pode retirar até as 23h.', time: '11:10' },
      { id: 'm15', sender: 'customer', text: 'Perfeito, passo aí no fim da tarde. Obrigado!', time: '11:14' }
    ]
  }
];

// Helper to fetch with timeout and fallback
async function fetchWithFallback(endpoint, options = {}, fallbackData = null) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout for smooth AI inference
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    // Graceful fallback to realistic mock data
    return typeof fallbackData === 'function' ? fallbackData() : fallbackData;
  }
}

// Local Storage Keys
const STORAGE_KEYS = {
  KB: 'siaw_knowledge_base',
  CONVERSATIONS: 'siaw_conversations',
  USER: 'siaw_auth_user'
};

// Storage Utilities
export const getStoredData = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

export const setStoredData = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage write error', e);
  }
};

// --- AUTH SERVICE ---
export const authService = {
  async login(email, password, role = 'Administrador') {
    return fetchWithFallback('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role })
    }, () => {
      // Mock validation
      if (!email || !password) {
        throw new Error('Preencha todos os campos obrigatórios.');
      }
      
      const cleanEmail = email.trim().toLowerCase();
      
      if (cleanEmail === 'admin@siaw.com' && password === '123456') {
        const user = {
          name: 'Administrador SIAW',
          email: 'admin@siaw.com',
          role: 'Administrador',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
          token: 'jwt-mock-token-admin'
        };
        setStoredData(STORAGE_KEYS.USER, user);
        return { success: true, user };
      }

      if (cleanEmail === 'operador@siaw.com' && password === '123456') {
        const user = {
          name: 'Operador de Atendimento',
          email: 'operador@siaw.com',
          role: 'Operador',
          avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces',
          token: 'jwt-mock-token-operator'
        };
        setStoredData(STORAGE_KEYS.USER, user);
        return { success: true, user };
      }

      // Generic valid user for testing
      if (password.length >= 6) {
        const user = {
          name: email.split('@')[0].toUpperCase(),
          email: cleanEmail,
          role: role || 'Operador',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
          token: 'jwt-mock-token-generic'
        };
        setStoredData(STORAGE_KEYS.USER, user);
        return { success: true, user };
      }

      throw new Error('Credenciais inválidas. Use admin@siaw.com / 123456 ou operador@siaw.com / 123456.');
    });
  },

  getCurrentUser() {
    return getStoredData(STORAGE_KEYS.USER, null);
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

// --- DASHBOARD SERVICE ---
export const dashboardService = {
  async getMetrics() {
    return fetchWithFallback('/dashboard/metrics', {}, () => {
      const convs = getStoredData(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
      const totalAguardando = convs.filter(c => c.status === 'Aguardando Humano').length;
      const totalEmAtendimento = convs.filter(c => c.status === 'Em Atendimento').length;
      
      return {
        kpis: {
          totalHoje: 142,
          totalMes: 3840,
          taxaAutomacao: 78.4,
          tempoMedioResposta: '12s',
          tempoMedioHumano: '48s',
          transbordoFila: totalAguardando,
          transbordoAtivos: totalEmAtendimento
        },
        chartVolume7Dias: [
          { dia: 'Seg', ia: 110, humano: 25, total: 135 },
          { dia: 'Ter', ia: 125, humano: 30, total: 155 },
          { dia: 'Qua', ia: 140, humano: 28, total: 168 },
          { dia: 'Qui', ia: 135, humano: 34, total: 169 },
          { dia: 'Sex', ia: 160, humano: 42, total: 202 },
          { dia: 'Sáb', ia: 95,  humano: 18, total: 113 },
          { dia: 'Dom', ia: 72,  humano: 12, total: 84 }
        ],
        ultimosAtendimentos: convs.slice(0, 5)
      };
    });
  }
};

// --- KNOWLEDGE BASE SERVICE ---
export const knowledgeBaseService = {
  async getAll() {
    return fetchWithFallback('/knowledge-base', {}, () => {
      let items = getStoredData(STORAGE_KEYS.KB, null);
      if (!items || items.length === 0) {
        items = INITIAL_KNOWLEDGE_BASE;
        setStoredData(STORAGE_KEYS.KB, items);
      }
      return items;
    });
  },

  async create(item) {
    return fetchWithFallback('/knowledge-base', {
      method: 'POST',
      body: JSON.stringify(item)
    }, () => {
      const current = getStoredData(STORAGE_KEYS.KB, INITIAL_KNOWLEDGE_BASE);
      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const newItem = {
        ...item,
        id: `kb-${Date.now()}`,
        status: item.status || 'Ativo',
        updatedAt: formattedDate
      };
      const updated = [newItem, ...current];
      setStoredData(STORAGE_KEYS.KB, updated);
      return newItem;
    });
  },

  async update(id, updatedFields) {
    return fetchWithFallback(`/knowledge-base/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields)
    }, () => {
      const current = getStoredData(STORAGE_KEYS.KB, INITIAL_KNOWLEDGE_BASE);
      const now = new Date();
      const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const updated = current.map(item => {
        if (item.id === id) {
          return { ...item, ...updatedFields, updatedAt: formattedDate };
        }
        return item;
      });
      setStoredData(STORAGE_KEYS.KB, updated);
      return updated.find(i => i.id === id);
    });
  },

  async delete(id) {
    return fetchWithFallback(`/knowledge-base/${id}`, {
      method: 'DELETE'
    }, () => {
      const current = getStoredData(STORAGE_KEYS.KB, INITIAL_KNOWLEDGE_BASE);
      const filtered = current.filter(item => item.id !== id);
      setStoredData(STORAGE_KEYS.KB, filtered);
      return { success: true };
    });
  }
};

// --- CHAT / SIMULATOR & TRANSBORDO SERVICE ---
export const chatService = {
  async getConversations() {
    return fetchWithFallback('/transbordo/conversas', {}, () => {
      let convs = getStoredData(STORAGE_KEYS.CONVERSATIONS, null);
      if (!convs || convs.length === 0) {
        convs = INITIAL_CONVERSATIONS;
        setStoredData(STORAGE_KEYS.CONVERSATIONS, convs);
      }
      return convs;
    });
  },

  // AI response engine with RAG over knowledge base
  async simulateAiResponse(userMessage, kbItems = [], customerPhone = '+55 11 98765-4321', customerName = 'Você (Simulador WhatsApp)') {
    return fetchWithFallback('/chat', {
      method: 'POST',
      body: JSON.stringify({ 
        message: userMessage, 
        text: userMessage,
        customerPhone, 
        customerName 
      })
    }, async () => {
      // Simulate network / generative thinking delay
      await new Promise(res => setTimeout(res, 900));

      const lower = userMessage.toLowerCase().trim();

      // Check for human handoff keywords
      const transbordoKeywords = [
        'atendente', 'humano', 'cancelar', 'cancelamento', 'falar com pessoa',
        'atendimento humano', 'gerente', 'reclamação', 'reclamar', 'procon', 'operador'
      ];
      const needsTransbordo = transbordoKeywords.some(kw => lower.includes(kw));

      if (needsTransbordo) {
        return {
          response: 'Compreendo perfeitamente a sua necessidade. Estou transferindo o seu atendimento para a nossa equipe de recepção e consultores humanos agora mesmo! Por favor, aguarde alguns instantes que você já será atendido(a).',
          isTransbordo: true,
          matchedKb: null
        };
      }

      // RAG keyword matching on Knowledge Base items
      let bestMatch = null;
      let highestScore = 0;

      for (const item of kbItems) {
        if (item.status === 'Inativo') continue;
        let score = 0;
        const titleLower = item.title.toLowerCase();
        const contentLower = item.content.toLowerCase();

        // Check plan keywords
        if (lower.includes('plano') || lower.includes('preço') || lower.includes('valor') || lower.includes('mensalidade') || lower.includes('quanto custa') || lower.includes('black') || lower.includes('smart')) {
          if (titleLower.includes('plano') || item.category === 'Planos') score += 10;
        }

        // Check schedule keywords
        if (lower.includes('horário') || lower.includes('hora') || lower.includes('funciona') || lower.includes('abre') || lower.includes('fecha') || lower.includes('domingo') || lower.includes('sábado')) {
          if (titleLower.includes('horário') || item.category === 'Horários') score += 10;
        }

        // Check location keywords
        if (lower.includes('onde') || lower.includes('endereço') || lower.includes('local') || lower.includes('localização') || lower.includes('estacionamento') || lower.includes('metrô') || lower.includes('fica')) {
          if (titleLower.includes('localização') || titleLower.includes('estacionamento') || contentLower.includes('paulista')) score += 10;
        }

        // Check trial class keywords
        if (lower.includes('aula') || lower.includes('experimental') || lower.includes('conhecer') || lower.includes('matrícula') || lower.includes('spinning') || lower.includes('treinar')) {
          if (titleLower.includes('experimental') || titleLower.includes('matrícula')) score += 10;
        }

        if (score > highestScore) {
          highestScore = score;
          bestMatch = item;
        }
      }

      if (bestMatch && highestScore > 0) {
        return {
          response: `Com base em nossas informações oficiais sobre "${bestMatch.title}":\n\n${bestMatch.content}\n\nPosso te ajudar com mais alguma informação sobre a nossa academia?`,
          isTransbordo: false,
          matchedKb: bestMatch.title
        };
      }

      // Greetings
      if (lower.match(/^(oi|olá|ola|bom dia|boa tarde|boa noite|e aí|opa)/i)) {
        return {
          response: 'Olá! Sou a assistente inteligente da Academia FitLife Pro via WhatsApp 🏋️‍♂️.\n\nComo posso te ajudar hoje? Você pode me perguntar sobre:\n1. Planos e valores de mensalidade\n2. Horário de funcionamento\n3. Localização e estacionamento\n4. Agendar aula experimental gratuita\n\nSe preferir falar com a equipe humana, basta digitar "falar com atendente".',
          isTransbordo: false,
          matchedKb: null
        };
      }

      // Fallback AI reply
      return {
        response: 'Obrigado por sua mensagem! Para essa consulta específica ou se preferir um atendimento personalizado com nossos recepcionistas, você pode digitar "falar com atendente" ou me perguntar sobre nossos planos, horários de funcionamento e agendamento de aula experimental gratuita!',
        isTransbordo: false,
        matchedKb: null
      };
    });
  },

  async sendOperatorMessage(convId, text, operatorName = 'Operador') {
    const numericId = String(convId).replace(/\D/g, '') || '1';
    return fetchWithFallback(`/conversations/${numericId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text, operatorName })
    }, () => ({ text, operatorName }));
  },

  async updateStatus(convId, status, operatorName = 'Administrador SIAW') {
    const numericId = String(convId).replace(/\D/g, '') || '1';
    return fetchWithFallback(`/conversations/${numericId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, operatorName })
    }, () => ({ status, operatorName }));
  }
};
