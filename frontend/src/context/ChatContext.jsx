import React, { createContext, useContext, useState, useEffect } from 'react';
import { chatService, knowledgeBaseService, getStoredData, setStoredData, INITIAL_CONVERSATIONS } from '../services/api';

const ChatContext = createContext(null);

const STORAGE_KEY_CONVS = 'siaw_conversations';

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState(() => {
    return getStoredData(STORAGE_KEY_CONVS, INITIAL_CONVERSATIONS);
  });
  
  const [activeConversationId, setActiveConversationId] = useState('conv-101');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [kbItems, setKbItems] = useState([]);

  // Load KB items for local RAG
  useEffect(() => {
    knowledgeBaseService.getAll().then(items => {
      setKbItems(items);
    }).catch(console.error);
  }, []);

  // Sync conversations to localStorage whenever changed
  useEffect(() => {
    setStoredData(STORAGE_KEY_CONVS, conversations);
  }, [conversations]);

  // Current active conversation in Transbordo
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  // Simulator conversation (always syncs with 'conv-simulador')
  const simulatorConversation = conversations.find(c => c.id === 'conv-simulador') || conversations[0];

  // Send message as Customer (from Simulator)
  const sendCustomerMessage = async (text) => {
    if (!text.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      text: text.trim(),
      time: timeStr
    };

    // Update conversation with customer message
    setConversations(prev => prev.map(conv => {
      if (conv.id === 'conv-simulador') {
        return {
          ...conv,
          lastActivity: 'Agora',
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));

    // If conversation is already in Transbordo (Em Atendimento), don't trigger AI response automatically
    const currentSimConv = conversations.find(c => c.id === 'conv-simulador');
    if (currentSimConv && currentSimConv.status === 'Em Atendimento') {
      // Operator is handling, AI remains silent
      return;
    }

    // Trigger AI response with RAG
    setIsAiTyping(true);
    try {
      const aiResult = await chatService.simulateAiResponse(text, kbItems);
      
      const nowAi = new Date();
      const timeAiStr = `${String(nowAi.getHours()).padStart(2, '0')}:${String(nowAi.getMinutes()).padStart(2, '0')}`;

      const aiMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: aiResult.response,
        time: timeAiStr
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === 'conv-simulador') {
          return {
            ...conv,
            status: aiResult.isTransbordo ? 'Aguardando Humano' : conv.status,
            unreadCount: aiResult.isTransbordo ? (conv.unreadCount + 1) : conv.unreadCount,
            lastActivity: 'Agora',
            messages: [...conv.messages, aiMsg]
          };
        }
        return conv;
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Send message as Operator (from Transbordo)
  const sendOperatorMessage = (convId, text, operatorName = 'Operador') => {
    if (!text.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'operator',
      operatorName: operatorName,
      text: text.trim(),
      time: timeStr
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return {
          ...conv,
          status: 'Em Atendimento',
          assignedTo: operatorName,
          lastActivity: 'Agora',
          unreadCount: 0,
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));
  };

  // Operator Actions on Conversation
  const assumeConversation = (convId, operatorName = 'Administrador SIAW') => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return {
          ...conv,
          status: 'Em Atendimento',
          assignedTo: operatorName,
          unreadCount: 0
        };
      }
      return conv;
    }));
  };

  const returnToAi = (convId) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const sysMsg = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: 'Atendimento retornado para a assistente virtual inteligente.',
      time: timeStr
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return {
          ...conv,
          status: 'Com a IA',
          assignedTo: null,
          messages: [...conv.messages, sysMsg]
        };
      }
      return conv;
    }));
  };

  const finalizeConversation = (convId) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const sysMsg = {
      id: `msg-${Date.now()}`,
      sender: 'ai',
      text: 'Atendimento finalizado. Obrigado por entrar em contato com a FitLife Pro! Tenha um ótimo treino! 🏋️‍♂️',
      time: timeStr
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return {
          ...conv,
          status: 'Finalizado',
          unreadCount: 0,
          messages: [...conv.messages, sysMsg]
        };
      }
      return conv;
    }));
  };

  const requestHumanTransbordoInSimulator = () => {
    sendCustomerMessage('Por favor, gostaria de falar com um atendente humano.');
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        setActiveConversationId,
        activeConversation,
        simulatorConversation,
        isAiTyping,
        sendCustomerMessage,
        sendOperatorMessage,
        assumeConversation,
        returnToAi,
        finalizeConversation,
        requestHumanTransbordoInSimulator
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
