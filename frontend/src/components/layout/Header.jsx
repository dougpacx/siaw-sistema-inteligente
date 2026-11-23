import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Wifi, Sparkles, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/dashboard':
        return {
          title: 'Dashboard Administrativo',
          subtitle: 'Visão geral das métricas de atendimento e inteligência artificial'
        };
      case '/transbordo':
        return {
          title: 'Painel de Transbordo Humano',
          subtitle: 'Gestão de atendimentos que requerem intervenção de operadores'
        };
      case '/base-conhecimento':
        return {
          title: 'Gestão da Base de Conhecimento (RAG)',
          subtitle: 'Artigos e respostas oficiais que orientam o modelo de IA'
        };
      case '/simulador':
        return {
          title: 'Simulador WhatsApp Web',
          subtitle: 'Ambiente de teste em tempo real do canal WhatsApp com a IA'
        };
      default:
        return {
          title: 'SIAW',
          subtitle: 'Sistema Inteligente de Atendimento via WhatsApp'
        };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
      <div>
        <h1 className="text-lg font-bold text-slate-900 leading-tight">{title}</h1>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* WhatsApp Connection status indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>WhatsApp API: Conectado</span>
        </div>

        {/* IA Model indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>IA Generativa: RAG Ativo</span>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-slate-200" />

        {/* Logged in User Pill */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold text-xs">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 leading-none">{user?.name || 'Administrador'}</p>
            <p className="text-[11px] text-slate-500 leading-tight mt-0.5 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-600" />
              {user?.role || 'Administrador'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
