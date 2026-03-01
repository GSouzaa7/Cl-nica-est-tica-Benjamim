import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const authData = await register(name, email, password);
      if (authData?.session) {
        // User is logged in automatically
      } else {
        alert('Cadastro realizado com sucesso! Por favor, verifique seu email para confirmar a conta antes de fazer login.');
        navigate('/login');
      }
    } catch (err: any) {
      console.error(err);
      let errorMessage = err.message || 'Erro ao criar conta';
      if (errorMessage.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado no sistema.';
      } else if (errorMessage.includes('Password should be at least')) {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/professional');
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="stars absolute inset-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-[#0A0A0A] rounded-[32px] border border-white/10 electric-card">
        <div className="flex justify-center mb-8">
          <div className="relative flex items-center justify-center w-12 h-12">
            <Sparkles className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bricolage font-light tracking-tight text-center mb-2">Solicitar Acesso</h2>
        <p className="text-neutral-400 text-center mb-8 text-sm">Crie sua conta profissional</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="Seu Nome"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="seu@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white rounded-full py-3 font-medium hover:brightness-110 transition-all shadow-[0_4px_15px_rgba(249,115,22,0.4)] disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-orange-400 hover:text-orange-300 transition-colors">
            Fazer Login
          </Link>
        </div>
      </div>
    </div>
  );
};
