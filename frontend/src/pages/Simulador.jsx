import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical, 
  Bot, 
  User, 
  Headphones, 
  CheckCheck, 
  ArrowRight, 
  RefreshCw,
  Sparkles,
  PhoneCall,
  Info
} from 'lucide-react';
import { useChat } from '../context/ChatContext';

export const Simulador = () => {
  const { 
    simulatorConversation, 
    sendCustomerMessage, 
    isAiTyping, 
    requestHumanTransbordoInSimulator 
  } = useChat();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simulatorConversation?.messages, isAiTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendCustomerMessage(inputMessage);
    setInputMessage('');
  };

  const quickQuestions = [
    'Quais são os planos e preços?',
    'Qual o horário de funcionamento?',
    'Onde fica a academia e tem estacionamento?',
    'Como funciona a aula experimental?',
    'Falar com atendente humano'
  ];

  const handleQuickQuestion = (q) => {
    if (q === 'Falar com atendente humano') {
      requestHumanTransbordoInSimulator();
    } else {
      sendCustomerMessage(q);
    }
  };

  const isTransbordoActive = 
    simulatorConversation?.status === 'Aguardando Humano' || 
    simulatorConversation?.status === 'Em Atendimento';

  return (
    <div className="h-[calc(100vh-7rem)] max-w-5xl mx-auto flex flex-col lg:flex-row gap-6">
      {/* LEFT: Explanatory & Control Panel */}
      <div className="w-full lg:w-72 flex flex-col gap-4 shrink-0">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Simulador em Tempo Real</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            Canal WhatsApp da Academia
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Aqui você interage exatamente como um <strong>cliente final</strong> conversando pelo WhatsApp.
          </p>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-900 space-y-1">
            <p className="font-semibold flex items-center gap-1">
              <span>🤖 Resposta Inteligente RAG:</span>
            </p>
            <p>
              A IA responde automaticamente consultando os artigos cadastrados na <strong>Base de Conhecimento</strong>.
            </p>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
            <p className="font-semibold flex items-center gap-1">
              <span>⚠️ Teste de Transbordo:</span>
            </p>
            <p>
              Ao pedir "atendente" ou "cancelar", a conversa é transferida automaticamente para a fila do <strong>Painel de Transbordo</strong>!
            </p>
          </div>
        </div>

        {/* Quick Question Buttons */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-2">
          <p className="text-xs font-bold text-slate-700 mb-2">Perguntas Rápidas de Teste:</p>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickQuestion(q)}
              className={`w-full text-left p-2 rounded-lg text-xs transition-colors border ${
                q.includes('atendente')
                  ? 'bg-amber-50/80 hover:bg-amber-100 border-amber-200 text-amber-900 font-semibold'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              &bull; {q}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: Authentic WhatsApp Web Interface */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-lg overflow-hidden">
        {/* WhatsApp Top Header (Dark Green #075E54) */}
        <div className="h-16 bg-[#075E54] text-white px-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white border-2 border-emerald-400 font-bold text-sm shadow-xs">
                <Bot className="w-6 h-6" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#075E54] rounded-full" />
            </div>

            <div>
              <h4 className="text-xs font-bold leading-tight flex items-center gap-1.5">
                Assistente Virtual FitLife Pro
                <span className="bg-emerald-500/30 text-emerald-200 text-[10px] px-1.5 py-0.2 rounded border border-emerald-400/40">
                  IA Oficial
                </span>
              </h4>
              <p className="text-[11px] text-emerald-100">
                {isAiTyping ? (
                  <span className="font-semibold animate-pulse text-emerald-300">digitando resposta...</span>
                ) : isTransbordoActive ? (
                  <span className="text-amber-200 font-medium">Transbordo: Atendente Humano conectado</span>
                ) : (
                  'Online via WhatsApp Business API'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-emerald-100">
            <button 
              onClick={() => navigate('/transbordo')}
              className="hidden sm:flex items-center gap-1 px-3 py-1 bg-emerald-700/60 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium border border-emerald-600 transition-colors"
            >
              <span>Ver no Transbordo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Transbordo Alert Bar if active */}
        {isTransbordoActive && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Transbordo Humano Ativado!</strong> Esta conversa agora está na fila da recepção/operadores.
              </span>
            </div>
            <button
              onClick={() => navigate('/transbordo')}
              className="text-xs font-bold text-amber-800 underline hover:text-amber-950"
            >
              Abrir Painel de Transbordo
            </button>
          </div>
        )}

        {/* WhatsApp Chat Body with Background Pattern */}
        <div className="flex-1 whatsapp-bg overflow-y-auto p-4 space-y-3">
          <div className="flex justify-center my-2">
            <span className="text-[10px] font-semibold text-slate-600 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-lg shadow-xs uppercase tracking-wider">
              HOJE
            </span>
          </div>

          {simulatorConversation?.messages.map((msg) => {
            const isCustomer = msg.sender === 'customer';
            const isAi = msg.sender === 'ai';
            const isOperator = msg.sender === 'operator';

            return (
              <div
                key={msg.id}
                className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-md p-3 rounded-xl text-xs shadow-xs relative leading-relaxed ${
                    isCustomer
                      ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none'
                      : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'
                  }`}
                >
                  {/* Sender Label */}
                  {!isCustomer && (
                    <div className="flex items-center gap-1 mb-1 text-[10px] font-bold">
                      {isAi ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <Bot className="w-3 h-3 text-emerald-600" />
                          Assistente Virtual IA
                        </span>
                      ) : (
                        <span className="text-blue-700 flex items-center gap-1">
                          <Headphones className="w-3 h-3 text-blue-600" />
                          {msg.operatorName || 'Operador Humano'}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Timestamp & Read Receipts */}
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                    <span>{msg.time}</span>
                    {isCustomer && (
                      <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isAiTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-xs border border-slate-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp Bottom Input Bar */}
        <div className="bg-[#f0f2f5] p-3 border-t border-slate-200 flex items-center gap-2">
          <button 
            type="button" 
            title="Emoji"
            className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg"
          >
            <Smile className="w-5 h-5" />
          </button>
          
          <button 
            type="button" 
            title="Anexar"
            className="p-1.5 text-slate-500 hover:text-slate-700 rounded-lg"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <form onSubmit={handleSend} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              placeholder="Digite uma mensagem como cliente..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
            />
            
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] active:bg-[#007a5e] disabled:opacity-40 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
