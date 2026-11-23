import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Headphones, 
  BookOpen, 
  Smartphone, 
  LogOut, 
  Bot, 
  MessageCircle,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { conversations } = useChat();
  const navigate = useNavigate();

  // Count pending transbordos
  const pendingTransbordos = conversations.filter(c => c.status === 'Aguardando Humano').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      to: '/dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      name: 'Painel de Transbordo',
      to: '/transbordo',
      icon: Headphones,
      badge: pendingTransbordos > 0 ? pendingTransbordos : null
    },
    {
      name: 'Base de Conhecimento',
      to: '/base-conhecimento',
      icon: BookOpen,
      badge: null
    },
    {
      name: 'Simulador WhatsApp',
      to: '/simulador',
      icon: Smartphone,
      badge: 'Live'
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800/80 bg-slate-950/40">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <MessageCircle className="w-6 h-6 fill-white/20" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-lg text-white tracking-tight">SIAW</span>
            <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate w-36">Atendimento WhatsApp</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Menu Principal
        </div>
        
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </div>
            
            {item.badge && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  item.badge === 'Live'
                    ? 'bg-emerald-400/20 text-emerald-300 text-[10px]'
                    : 'bg-amber-500 text-slate-950 text-[11px] animate-pulse'
                }`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* User Info & Logout footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <UserCheck className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'Administrador'}</p>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="truncate">{user?.role || 'Administrador'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sair do sistema"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
