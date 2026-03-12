import React from 'react';
import { AlertCircle, Key, Server, Settings } from 'lucide-react';

export const MissingConfigScreen = () => {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-sans text-white selection:bg-orange-500/30">
      <div className="max-w-2xl w-full">
        {/* Header Alert */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Conexão com Banco de Dados Ausente</h1>
            <p className="text-neutral-400 text-sm md:text-base">
              A aplicação carregou com sucesso, mas não pôde se conectar ao Firebase. Para resolver isso, você precisa configurar as <strong className="text-white">Variáveis de Ambiente</strong>.
            </p>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-orange-500" />
            Como resolver este aviso (Passo a Passo)
          </h2>

          <div className="space-y-6 relative">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold shrink-0">1</div>
                <div className="w-px h-full bg-white/5 my-2"></div>
              </div>
              <div className="pb-4">
                <h3 className="font-medium text-white mb-1">Abra o painel da sua hospedagem</h3>
                <p className="text-sm text-neutral-400">
                  Acesse o painel do seu projeto na <strong>Vercel</strong> (ou host equivalente) e vá até a aba <strong className="text-white text-xs bg-white/10 px-2 py-0.5 rounded">Settings</strong> e depois em <strong className="text-white text-xs bg-white/10 px-2 py-0.5 rounded">Environment Variables</strong>.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold shrink-0">2</div>
                <div className="w-px h-full bg-white/5 my-2"></div>
              </div>
              <div className="pb-4">
                <h3 className="font-medium text-white mb-1 flex items-center gap-2">
                  <Key className="w-4 h-4 text-neutral-400" /> Copie as chaves do seu código
                </h3>
                <p className="text-sm text-neutral-400 mb-3">
                  Localize o arquivo <code className="text-orange-400 text-xs">.env.local</code> no seu computador e adicione TODAS as variáveis que começam com <code className="text-orange-400 text-xs">VITE_FIREBASE_</code> e também a <code className="text-orange-400 text-xs">VITE_MASTER_KEY</code>.
                </p>
                <div className="bg-neutral-900 border border-white/5 rounded-xl p-4 text-xs font-mono text-neutral-300">
                  <div className="text-neutral-500 mb-2"># Exemplo do que você precisa adicionar:</div>
                  <div>VITE_FIREBASE_API_KEY=AIzaxxx...</div>
                  <div>VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com</div>
                  <div>VITE_FIREBASE_PROJECT_ID=seu-projeto</div>
                  <div>... (adicione todas as 6 chaves do Firebase + a MASTER_KEY)</div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold shrink-0">3</div>
              </div>
              <div>
                <h3 className="font-medium text-white mb-1 flex items-center gap-2">
                  <Server className="w-4 h-4 text-neutral-400" /> Faça um novo Deploy
                </h3>
                <p className="text-sm text-neutral-400">
                  Depois de salvar as variáveis, o painel <strong>NÃO</strong> as aplica automaticamente ao site no ar. Você deve forçar um <strong className="text-white text-xs bg-white/10 px-2 py-0.5 rounded">Redeploy</strong> (recompilação) para que as chaves sejam embutidas na aplicação.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-8 text-center text-sm text-neutral-500">
          Após fazer o redeploy, atualize esta página. Se esta tela sumir, é porque a configuração deu certo! 🎉
        </div>
      </div>
    </div>
  );
};
