import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Lock, Mail, Eye, EyeOff, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('admin@siaw.com');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState('Administrador');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao efetuar login. Verifique suas credenciais.');
    }
  };

  const fillCredentials = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('123456');
    setRole(demoRole);
    setError('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden select-none">
      {/* Background Decorative Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Main Card */}
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-8">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-xl shadow-emerald-500/25 mb-4">
              <MessageCircle className="w-9 h-9 fill-white/20" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SIAW</h1>
            <p className="text-xs text-emerald-400 font-medium tracking-wide mt-1">
              Sistema Inteligente de Atendimento via WhatsApp
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Acesse a plataforma de monitoramento, transbordo e RAG
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-shake">
              <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail Corporativo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@siaw.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/70 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Profile Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Perfil de Acesso
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('Administrador')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                    role === 'Administrador'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-semibold shadow-sm'
                      : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Administrador
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Operador')}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                    role === 'Operador'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 font-semibold shadow-sm'
                      : 'bg-slate-900/40 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Operador
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-700/60">
            <p className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider mb-2.5">
              Credenciais Rápidas de Demonstração
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@siaw.com', 'Administrador')}
                className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/60 text-left hover:border-emerald-500/50 transition-colors"
              >
                <p className="text-[11px] font-semibold text-emerald-400">Admin</p>
                <p className="text-[10px] text-slate-400 truncate">admin@siaw.com</p>
                <p className="text-[10px] text-slate-500">Senha: 123456</p>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials('operador@siaw.com', 'Operador')}
                className="p-2 rounded-lg bg-slate-900/60 border border-slate-700/60 text-left hover:border-emerald-500/50 transition-colors"
              >
                <p className="text-[11px] font-semibold text-emerald-400">Operador</p>
                <p className="text-[10px] text-slate-400 truncate">operador@siaw.com</p>
                <p className="text-[10px] text-slate-500">Senha: 123456</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-4">
          Projeto Integrador SIAW &bull; Academia FitLife Pro &bull; Resolução 1280x720
        </p>
      </div>
    </div>
  );
};
