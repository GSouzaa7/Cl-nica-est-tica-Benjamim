import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

/* ─────────────────────────────────────────────
   Hero Light Canvas – lightweight particle layer
   ───────────────────────────────────────────── */
const HeroLightCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match canvas size to container
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const t = Date.now() * 0.001; // seconds

    ctx.clearRect(0, 0, w, h);

    // Ambient glow blobs
    const drawBlob = (x: number, y: number, r: number, color: string) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };

    // Top-center warm glow
    drawBlob(
      w * 0.5 + Math.sin(t * 0.3) * 40,
      h * 0.15 + Math.cos(t * 0.2) * 20,
      Math.min(w, h) * 0.45,
      'rgba(249,115,22,0.06)'
    );

    // Bottom-right accent
    drawBlob(
      w * 0.8 + Math.sin(t * 0.25) * 30,
      h * 0.85 + Math.cos(t * 0.35) * 25,
      Math.min(w, h) * 0.35,
      'rgba(251,146,60,0.04)'
    );

    // Floating particles (low density ~30)
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
      const seed = i * 137.508; // golden angle
      const px = ((seed * 7.31) % w);
      const py = ((seed * 3.17 + t * (8 + (i % 5) * 3)) % h);
      const size = 0.6 + (i % 3) * 0.4;
      const alpha = 0.15 + Math.sin(t * 0.8 + i) * 0.1;

      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};

/* ─────────────────────────────────────────────
   Login Page
   ───────────────────────────────────────────── */
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      let errorMessage = err.message || 'Erro ao fazer login';
      if (errorMessage.includes('auth/invalid-credential') || errorMessage.includes('auth/wrong-password') || errorMessage.includes('auth/user-not-found')) {
        errorMessage = 'Email ou senha incorretos.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden selection:bg-orange-500/30">

      {/* ── CANVAS HERO-LIGHT (absolute, z-0) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HeroLightCanvas />
        <div className="stars absolute inset-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-950/20 blur-[100px] rounded-full"></div>
      </div>

      {/* ── GRID CONTAINER (z-10) ── */}
      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_480px] items-center">

        {/* ── LEFT COLUMN: Welcome content (desktop only) ── */}
        <div className="hidden lg:flex flex-col items-start justify-center px-16 xl:px-24">
          <nav className="absolute top-0 left-0 right-0 flex items-center px-6 py-6 max-w-7xl mx-auto animate-entry delay-75">
            <div className="flex gap-2 items-center">
              <div className="relative flex items-center justify-center w-8 h-8">
                <Sparkles className="w-8 h-8 text-orange-500 absolute" />
              </div>
              <span className="text-xl text-white font-sans font-medium">Clínica Benjamim</span>
            </div>
          </nav>

          <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm text-xs text-neutral-300 animate-entry delay-100">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span className="font-sans">Sistema de Gestão Integrada</span>
          </div>

          <h1 className="text-5xl lg:text-[76px] leading-[1.05] text-white mb-6 font-light tracking-tight animate-entry delay-150"
            style={{ backgroundImage: 'linear-gradient(to right, #ffffff, #fed7aa, #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            BEM-VINDO AO <br />
            SISTEMA DA <br />
            CLÍNICA
          </h1>

          <p className="text-lg text-neutral-400 max-w-xl mb-10 leading-relaxed font-sans animate-entry delay-200">
            Acesse sua conta para gerenciar agendamentos, visualizar relatórios e acompanhar a jornada dos seus pacientes.
          </p>

          <div className="flex flex-wrap gap-4 items-center animate-entry delay-300">
            <Link to="/register" className="group relative flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-t from-yellow-200 via-orange-400 to-orange-500 px-8 py-3 text-lg font-medium text-[#2c1306] shadow-[0_0_40px_-5px_rgba(249,115,22,0.6)] ring-1 ring-inset ring-white/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_-5px_rgba(249,115,22,0.8)] font-sans">
              <span>Criar Nova Conta</span>
            </Link>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Login Card ── */}
        <div className="flex items-center justify-center lg:justify-end lg:pr-16 xl:pr-24 px-6 py-12 lg:py-0">

          {/* Mobile-only nav */}
          <nav className="lg:hidden absolute top-0 left-0 right-0 flex items-center px-6 py-6 animate-entry delay-75 z-20">
            <div className="flex gap-2 items-center">
              <div className="relative flex items-center justify-center w-8 h-8">
                <Sparkles className="w-8 h-8 text-orange-500 absolute" />
              </div>
              <span className="text-xl text-white font-sans font-medium">Clínica Benjamim</span>
            </div>
          </nav>

          <div className="relative w-full max-w-[400px] animate-entry delay-500">
            {/* Glow behind the card – absolute, pointer-events: none */}
            <div
              className="absolute rounded-[32px] pointer-events-none"
              style={{
                inset: '-2px',
                zIndex: -1,
                background: 'linear-gradient(to bottom, #fde68a, #f97316, transparent)',
                opacity: 0.8,
                filter: 'blur(40px)',
              }}
            />

            {/* Card shell */}
            <div
              className="relative w-full bg-neutral-900 rounded-[32px] p-[2px] overflow-hidden"
              style={{
                boxShadow: '0 0 30px rgba(249,115,22,0.3), inset 0 0 20px rgba(249,115,22,0.1)',
              }}
            >
              {/* Border gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 via-orange-500 to-transparent opacity-80 z-0"></div>

              {/* Card inner */}
              <div className="relative z-10 bg-[#0A0A0A] rounded-[30px] h-full p-8 flex flex-col items-start overflow-hidden w-full">
                <div className="absolute top-0 right-0 w-full h-40 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none"></div>

                <div className="flex justify-between w-full items-start mb-6 relative">
                  <span className="text-[10px] uppercase text-neutral-400 border border-white/10 px-2 py-1 rounded bg-white/5 flex items-center gap-1.5 font-sans">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                    Acesso Restrito
                  </span>
                </div>

                {/* Title with gradient */}
                <h3
                  className="text-2xl mb-2 font-light tracking-tight"
                  style={{
                    backgroundImage: 'linear-gradient(to right, #ffffff, #fed7aa, #fb923c)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Login
                </h3>
                <p className="text-sm text-neutral-400 mb-8 leading-relaxed font-sans w-full">Insira suas credenciais abaixo.</p>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 w-full text-left">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-neutral-300 mb-2 font-sans">E-mail</label>
                    <div className="flex items-center rounded-lg bg-[#050505] border border-white/10 focus-within:border-white/20 transition-all w-full">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-transparent border-none text-sm text-white px-4 py-3 focus:outline-none placeholder:text-neutral-600 font-sans h-12 rounded-lg"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-neutral-300 mb-2 font-sans">Senha</label>
                    <div className="flex items-center rounded-lg bg-[#050505] border border-white/10 focus-within:border-white/20 transition-all w-full">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent border-none text-sm text-white px-4 py-3 focus:outline-none placeholder:text-neutral-600 font-sans h-12 rounded-lg"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {/* Button – visual only changes */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative flex items-center justify-center gap-2.5 rounded-full px-8 py-3 text-sm font-medium text-[#2c1306] ring-1 ring-inset ring-white/40 transition-all duration-300 hover:scale-105 disabled:opacity-50 mt-4"
                    style={{
                      background: 'linear-gradient(to top, #fde68a, #fb923c, #f97316)',
                      boxShadow: '0 0 40px -5px rgba(249,115,22,0.6)',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 60px -5px rgba(249,115,22,0.8)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px -5px rgba(249,115,22,0.6)';
                    }}
                  >
                    {loading ? 'Entrando...' : 'Acessar Sistema'}
                  </button>
                </form>

                <div className="mt-8 relative w-full h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent flex items-center justify-center">
                  <span className="bg-[#0A0A0A] px-2 text-[10px] text-neutral-400 uppercase font-sans">
                    Clínica Benjamim
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
