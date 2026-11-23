import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Send, 
  Bot, 
  User, 
  Headphones, 
  Undo2, 
  CheckCircle, 
  Phone, 
  Clock, 
  AlertCircle,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

export const Transbordo = () => {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    activeConversation, 
    sendOperatorMessage, 
    assumeConversation, 
    returnToAi, 
    finalizeConversation 
  } = useChat();

  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todas');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = 
      conv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.phone.includes(searchTerm);

    if (!matchesSearch) return false;

    if (statusFilter === 'Todas') return true;
    if (statusFilter === 'Aguardando Humano') return conv.status === 'Aguardando Humano';
    if (statusFilter === 'Em Atendimento') return conv.status === 'Em Atendimento';
    if (statusFilter === 'Com a IA') return conv.status === 'Com a IA';
    if (statusFilter === 'Finalizado') return conv.status === 'Finalizado';
    return true;
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    sendOperatorMessage(
      activeConversation.id, 
      inputText, 
      user?.name || 'Operador SIAW'
    );
    setInputText('');
  };

  const handleAssume = () => {
    if (!activeConversation) return;
    assumeConversation(activeConversation.id, user?.name || 'Administrador SIAW');
  };

  const handleReturnToAi = () => {
    if (!activeConversation) return;
    returnToAi(activeConversation.id);
  };

  const handleFinalize = () => {
    if (!activeConversation) return;
    finalizeConversation(activeConversation.id);
  };

  return (
    <div className="h-[calc(100vh-7rem)] bg-white rounded-2xl border border-slate-200/90 shadow-sm flex overflow-hidden">
      {/* LEFT COLUMN: Conversation List (WhatsApp / Zendesk Style) */}
      <div className="w-80 md:w-96 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
        {/* Search & Filter Header */}
        <div className="p-3.5 border-b border-slate-200 bg-white space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-0.5 text-[11px]">
            {['Todas', 'Aguardando Humano', 'Em Atendimento', 'Com a IA'].map((filter) => {
              const count = conversations.filter(c => {
                if (filter === 'Todas') return true;
                return c.status === filter;
              }).length;

              return (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-all ${
                    statusFilter === filter
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter === 'Aguardando Humano' ? 'Aguardando' : filter} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Nenhuma conversa encontrada neste filtro.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversation?.id;
              const lastMsg = conv.messages[conv.messages.length - 1];

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors relative ${
                    isSelected
                      ? 'bg-emerald-50/80 border-l-4 border-emerald-600'
                      : 'hover:bg-slate-100/70 bg-white'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.avatar}
                      alt={conv.customerName}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                    {conv.status === 'Aguardando Humano' && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 border-2 border-white rounded-full animate-ping" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {conv.customerName}
                      </h4>
                      <span className="text-[10px] text-slate-400">{conv.lastActivity}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                      {conv.phone}
                    </p>

                    <p className="text-xs text-slate-600 mt-1 truncate">
                      {lastMsg ? lastMsg.text : 'Sem mensagens'}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {conv.status === 'Aguardando Humano' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
                          Aguardando Operador
                        </span>
                      )}
                      {conv.status === 'Em Atendimento' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          <Headphones className="w-2.5 h-2.5 text-blue-600" />
                          Em Atendimento
                        </span>
                      )}
                      {conv.status === 'Com a IA' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <Bot className="w-2.5 h-2.5 text-emerald-600" />
                          Com a IA
                        </span>
                      )}
                      {conv.status === 'Finalizado' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          <CheckCircle className="w-2.5 h-2.5 text-slate-500" />
                          Finalizado
                        </span>
                      )}

                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Active Chat & Action Bar */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-slate-50/30">
          {/* Chat Action Header */}
          <div className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.avatar}
                alt={activeConversation.customerName}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    {activeConversation.customerName}
                  </h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    activeConversation.status === 'Aguardando Humano'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : activeConversation.status === 'Em Atendimento'
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : activeConversation.status === 'Com a IA'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {activeConversation.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{activeConversation.phone}</span>
                  {activeConversation.assignedTo && (
                    <>
                      <span>&bull;</span>
                      <span className="text-blue-600 font-medium">
                        Atendente: {activeConversation.assignedTo}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* 3 Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAssume}
                title="Assumir o atendimento para responder ao cliente"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeConversation.status === 'Em Atendimento'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Assumir Conversa</span>
              </button>

              <button
                onClick={handleReturnToAi}
                title="Devolver controle para o bot inteligente"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition-all"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Devolver para a IA</span>
              </button>

              <button
                onClick={handleFinalize}
                title="Encerrar chamado de atendimento"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 transition-all"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Finalizar</span>
              </button>
            </div>
          </div>

          {/* Conversation History Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-100/50">
            {/* Session notice */}
            <div className="flex justify-center">
              <span className="text-[11px] font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                Histórico completo com IA e Operadores &bull; Canal WhatsApp
              </span>
            </div>

            {activeConversation.messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';
              const isAi = msg.sender === 'ai';
              const isOperator = msg.sender === 'operator';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isCustomer ? 'items-start' : isOperator ? 'items-end' : 'items-start'
                  }`}
                >
                  {/* Sender Badge */}
                  <div className="flex items-center gap-1 mb-1 px-1">
                    {isCustomer && (
                      <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        Cliente ({activeConversation.customerName})
                      </span>
                    )}
                    {isAi && (
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                        <Bot className="w-3 h-3 text-emerald-600" />
                        IA SIAW (Automação RAG)
                      </span>
                    )}
                    {isOperator && (
                      <span className="text-[10px] font-bold text-blue-700 flex items-center gap-1 bg-blue-100/70 px-1.5 py-0.5 rounded">
                        <Headphones className="w-3 h-3 text-blue-600" />
                        {msg.operatorName || 'Operador Humano'}
                      </span>
                    )}
                  </div>

                  {/* Message Balloon */}
                  <div
                    className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs whitespace-pre-wrap ${
                      isCustomer
                        ? 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                        : isAi
                        ? 'bg-emerald-50 text-emerald-950 rounded-tl-none border border-emerald-200/80 font-normal'
                        : 'bg-blue-600 text-white rounded-tr-none shadow-blue-500/10'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`text-[10px] mt-1.5 flex items-center justify-end gap-1 ${
                        isOperator ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {isOperator && <CheckCheck className="w-3 h-3 text-blue-200" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Operator Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            {activeConversation.status !== 'Em Atendimento' && (
              <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  Esta conversa está com status <strong>{activeConversation.status}</strong>. Ao enviar uma mensagem, você assumirá automaticamente o atendimento.
                </span>
                <button
                  type="button"
                  onClick={handleAssume}
                  className="px-2 py-0.5 bg-amber-600 text-white text-[11px] font-semibold rounded hover:bg-amber-700 transition-colors"
                >
                  Assumir Agora
                </button>
              </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  activeConversation.status === 'Em Atendimento'
                    ? "Digite sua resposta para o cliente..."
                    : "Digite uma mensagem (você assumirá o atendimento)..."
                }
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                <span>Enviar</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50/50">
          <MessageCircle className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Selecione uma conversa</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            Escolha um atendimento na lista à esquerda para interagir, assumir ou devolver para a IA.
          </p>
        </div>
      )}
    </div>
  );
};
