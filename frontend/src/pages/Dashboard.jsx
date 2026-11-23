import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Bot, 
  Clock, 
  Headphones, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Calendar,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { dashboardService } from '../services/api';
import { useChat } from '../context/ChatContext';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const { conversations, setActiveConversationId } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    dashboardService.getMetrics().then(res => {
      setData(res);
      setLoading(false);
    }).catch(console.error);
  }, [conversations]);

  const handleOpenConversation = (convId) => {
    setActiveConversationId(convId);
    navigate('/transbordo');
  };

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Count live stats from Context
  const totalAguardando = conversations.filter(c => c.status === 'Aguardando Humano').length;
  const totalEmAtendimento = conversations.filter(c => c.status === 'Em Atendimento').length;
  const totalTransbordo = totalAguardando + totalEmAtendimento;

  const filteredConversations = conversations.filter(conv => {
    if (filterStatus === 'Todos') return true;
    if (filterStatus === 'Transbordo') return conv.status === 'Aguardando Humano' || conv.status === 'Em Atendimento';
    if (filterStatus === 'IA') return conv.status === 'Com a IA';
    if (filterStatus === 'Finalizado') return conv.status === 'Finalizado';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total de Atendimentos
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{data.kpis.totalHoje}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +14% hoje
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Acumulado no mês: <span className="font-semibold text-slate-600">{data.kpis.totalMes.toLocaleString('pt-BR')}</span>
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Taxa de Automação IA
            </span>
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{data.kpis.taxaAutomacao}%</span>
            <span className="text-xs font-semibold text-teal-600 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-0.5" />
              Meta: 75%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Resolvidas sem intervenção de operador
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tempo Médio de Resposta
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{data.kpis.tempoMedioResposta}</span>
            <span className="text-xs font-semibold text-slate-500">
              (IA Generativa)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tempo médio humano: <span className="font-semibold text-slate-600">{data.kpis.tempoMedioHumano}</span>
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Transbordo Humano
            </span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              totalAguardando > 0 ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-100 text-slate-600'
            }`}>
              <Headphones className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalTransbordo}</span>
            <span className="text-xs font-semibold text-amber-600">
              {totalAguardando} aguardando
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {totalEmAtendimento} em atendimento com operador
          </p>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">Volume de Mensagens nos Últimos 7 Dias</h2>
            <p className="text-xs text-slate-500">Distribuição entre mensagens resolvidas por IA vs. Atendimento Humano</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Semana Atual (FitLife Pro)</span>
          </div>
        </div>

        <div className="h-64 mt-4 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.chartVolume7Dias} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="dia" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderRadius: '8px', 
                  border: 'none', 
                  color: '#fff', 
                  fontSize: '12px' 
                }} 
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                formatter={(value) => (value === 'ia' ? 'Atendimentos por IA' : 'Transbordo Humano')}
              />
              <Bar dataKey="ia" fill="#059669" radius={[4, 4, 0, 0]} name="ia" />
              <Bar dataKey="humano" fill="#3b82f6" radius={[4, 4, 0, 0]} name="humano" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Conversations Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Últimos Atendimentos</h2>
            <p className="text-xs text-slate-500">Fluxo em tempo real no canal do WhatsApp</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            {['Todos', 'Transbordo', 'IA', 'Finalizado'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Cliente</th>
                <th className="py-3 px-6">Telefone</th>
                <th className="py-3 px-6">Status Atual</th>
                <th className="py-3 px-6">Última Atividade</th>
                <th className="py-3 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredConversations.map((conv) => (
                <tr key={conv.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={conv.avatar} 
                        alt={conv.customerName} 
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{conv.customerName}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">
                          {conv.messages[conv.messages.length - 1]?.text || 'Nenhuma mensagem'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600 font-mono text-[11px]">
                    {conv.phone}
                  </td>
                  <td className="py-3.5 px-6">
                    {conv.status === 'Com a IA' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                        <Bot className="w-3 h-3 text-emerald-600" />
                        Resolvido pela IA
                      </span>
                    )}
                    {conv.status === 'Aguardando Humano' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold animate-pulse">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        Em Transbordo
                      </span>
                    )}
                    {conv.status === 'Em Atendimento' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                        <Headphones className="w-3 h-3 text-blue-600" />
                        Em Atendimento
                      </span>
                    )}
                    {conv.status === 'Finalizado' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-slate-500" />
                        Finalizado
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-slate-500 text-[11px]">
                    {conv.lastActivity}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleOpenConversation(conv.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <span>Abrir</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
