import React, { useState } from 'react';
import { FileSignature, Printer, Save } from 'lucide-react';

const compareDates = (d1: string, d2: string) => {
  if (!d1 || !d2) return false;
  const format = (d: string) => new Date(d).toISOString().split('T')[0].replace(/-/g, '');
  try {
    const normalizeBR = (s: string) => s.includes('/') ? s.split('/').reverse().join('') : s.replace(/-/g, '');
    return normalizeBR(d1) === normalizeBR(d2);
  } catch { return false; }
};

export const ReceituarioView = ({ patients, professionals, selectedPatientId, isDarkMode = true }: any) => {
  const [tipo, setTipo] = useState('simples');
  const [patientId, setPatientId] = useState(selectedPatientId || '');
  const [professionalId, setProfessionalId] = useState(professionals[0]?.id || '');
  const [conteudo, setConteudo] = useState('');
  const [historyLookupDate, setHistoryLookupDate] = useState(new Date().toISOString().split('T')[0]);
  const [patientSearch, setPatientSearch] = useState('');

  const selectedPatientData = patients?.find((p: any) => p.id === patientId);
  const selectedProfessional = professionals?.find((p: any) => p.id === professionalId);

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    alert('Receituário salvo no histórico do paciente!');
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Background stars/dots effect */}


      {/* Header - Hidden in print */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <FileSignature className="text-[var(--text-primary)]" size={32} />
          <h1 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">Receituário</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-default)] hover:bg-zinc-800 hover:text-white text-[var(--text-primary)] font-semibold transition-all shadow-[var(--card-shadow)]">
            <Save size={18} />
            Salvar no Prontuário
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            <Printer size={18} />
            Imprimir
          </button>
        </div>
      </header>

      {/* Content Grid - Hidden in print */}
      <div className="flex-1 overflow-y-auto px-12 pb-10 z-10 custom-scrollbar print:hidden">
        <div className="flex gap-8 max-w-7xl mx-auto">

          {/* Controls */}
          <div className={`w-80 shrink-0 ${isDarkMode ? 'bg-[#0a0a0a] border-zinc-800' : 'bg-white border-zinc-200'} border rounded-2xl p-6 shadow-xl flex flex-col gap-6 print:hidden`}>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                <label className="block text-[10px] font-bold text-orange-600 mb-2 uppercase tracking-widest">
                  Data da Sessão Anterior
                </label>
                <input
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={historyLookupDate}
                  onChange={(e) => setHistoryLookupDate(e.target.value)}
                  className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none transition-all"
                />
              </div>

              <div className={`mt-4 p-5 rounded-2xl border ${patientId ? "border-orange-500/20 bg-orange-500/5" : "border-zinc-800 bg-zinc-900/30"} h-[220px] flex flex-col print:hidden`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${patientId ? "bg-orange-500 animate-pulse" : "bg-zinc-600"}`} />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Resumo da Evolução</span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {(() => {
                    const client = patients?.find((c: any) => String(c.id) === String(patientId) || c.name.toLowerCase() === patientSearch.toLowerCase());

                    if (!client) {
                      return <p className="text-xs text-zinc-600 italic text-center mt-8">Selecione um paciente para carregar o histórico clínico.</p>;
                    }

                    // Busca exata pela data selecionada
                    const exactEntry = client?.history?.find((h: any) => compareDates(h.date, historyLookupDate));

                    // Fallback: Se não houver na data, pega o registro mais recente (último)
                    const latestEntry = client?.history?.[client.history.length - 1];

                    const contentToShow = exactEntry?.content || latestEntry?.content || client?.notes;

                    if (!contentToShow) {
                      return <p className="text-xs text-zinc-500 italic mt-8 text-center">Nenhum registro clínico encontrado para o paciente.</p>;
                    }

                    return (
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-300 leading-relaxed font-medium">{contentToShow}</p>
                        <button
                          onClick={() => setConteudo(prev => prev + "\n\nNotas da sessão anterior: " + contentToShow)}
                          className="text-[9px] font-bold text-orange-500 uppercase hover:underline block mt-2"
                        >
                          + Importar para a receita
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Tipo de Receituário</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)} className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors`}>
                <option value="simples">Receituário Simples</option>
                <option value="controlado">Controle Especial (2 vias)</option>
                <option value="antibiotico">Antibiótico (2 vias)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Profissional Emitente</label>
              <select value={professionalId} onChange={(e) => setProfessionalId(e.target.value)} className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors`}>
                {professionals.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Paciente</label>
              <select
                value={patientId}
                onChange={(e) => {
                  setPatientId(e.target.value);
                  const pt = patients.find((p: any) => String(p.id) === String(e.target.value));
                  if (pt) setPatientSearch(pt.name);
                }}
                className={`w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors`}
              >
                <option value="">Selecione um paciente</option>
                {patients.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name} - ID/CPF: {p.cpf || p.id}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Prescrição (Medicamentos/Exames)</label>
              <textarea
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                placeholder="Ex: Dipirona 500mg - Tomar 1 comprimido de 8/8h se dor..."
                className={`flex-1 w-full ${isDarkMode ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900'} border rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 transition-colors resize-none`}
              />
            </div>
          </div>

          {/* Preview Area */}
          <div className="flex-1 bg-zinc-200 rounded-2xl p-8 overflow-y-auto flex justify-center shadow-inner">
            <div className="bg-[#ffffff] w-[210mm] min-h-[297mm] shadow-2xl p-[20mm] text-zinc-900 font-sans relative">
              {/* This is the printable area */}
              <PrintableReceituario
                tipo={tipo}
                patient={selectedPatientData}
                professional={selectedProfessional}
                conteudo={conteudo}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>

      {/* Hidden Print Container */}
      <div className="hidden print:block print-area w-[210mm] min-h-[297mm] bg-[#ffffff] text-zinc-900 p-[20mm]">
        <PrintableReceituario
          tipo={tipo}
          patient={selectedPatientData}
          professional={selectedProfessional}
          conteudo={conteudo}
        />
      </div>
    </div>
  );
};

const PrintableReceituario = ({ tipo, patient, professional, conteudo }: any) => {
  const dataAtual = new Date().toLocaleDateString('pt-BR');

  const Header = () => (
    <div className="text-center border-b-2 border-black pb-4 mb-8">
      <h2 className="text-2xl font-bold uppercase">{professional?.name || 'Nome do Profissional'}</h2>
      <p className="text-sm mt-1">{professional?.specialty || 'Especialidade'} - CRM/CRO: 123456-UF</p>
      <p className="text-xs mt-1">Av. Exemplo, 1000 - Bairro, Cidade - UF | (00) 0000-0000</p>
    </div>
  );

  const Footer = () => (
    <div className="mt-16 pt-8 flex flex-col items-center">
      <div className="w-64 border-t border-black mb-2"></div>
      <p className="text-sm font-bold">{professional?.name || 'Assinatura do Profissional'}</p>
      <p className="text-xs">Data: {dataAtual}</p>
    </div>
  );

  if (tipo === 'simples') {
    return (
      <div className="h-full flex flex-col">
        <Header />
        <div className="mb-8">
          <p className="text-sm font-bold">Paciente: <span className="font-normal">{patient?.name || '________________________________________________'}</span></p>
        </div>
        <div className="flex-1 whitespace-pre-wrap text-sm leading-relaxed">
          {conteudo || 'Prescrição...'}
        </div>
        <Footer />
      </div>
    );
  }

  if (tipo === 'controlado') {
    return (
      <div className="h-full flex flex-col relative">
        <div className="absolute top-0 right-0 border border-black p-2 text-[10px] w-48">
          <p className="font-bold text-center mb-1">IDENTIFICAÇÃO DO COMPRADOR</p>
          <p>Nome: _______________________</p>
          <p>RG: _________________________</p>
          <p>End: ________________________</p>
          <p>Cidade: _________ UF: _______</p>
          <p>Telefone: ____________________</p>
        </div>
        <div className="absolute top-0 left-0 border border-black p-2 text-[10px] w-48">
          <p className="font-bold text-center mb-1">IDENTIFICAÇÃO DO FORNECEDOR</p>
          <p>Data: ___/___/___</p>
          <p className="mt-4 text-center">_________________________</p>
          <p className="text-center">Assinatura do Farmacêutico</p>
        </div>

        <div className="text-center mt-32 mb-8">
          <h1 className="text-xl font-bold uppercase">Receituário de Controle Especial</h1>
          <p className="text-sm">1ª Via - Retenção da Farmácia | 2ª Via - Paciente</p>
        </div>

        <div className="border border-black p-4 mb-6">
          <p className="text-sm font-bold mb-2">IDENTIFICAÇÃO DO EMITENTE</p>
          <p className="text-sm">{professional?.name || 'Nome do Profissional'} - CRM/CRO: 123456-UF</p>
          <p className="text-sm">Av. Exemplo, 1000 - Bairro, Cidade - UF</p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold">Paciente: <span className="font-normal">{patient?.name || '________________________________________________'}</span></p>
          <p className="text-sm font-bold mt-2">Endereço: <span className="font-normal">________________________________________________</span></p>
        </div>

        <div className="flex-1 border border-black p-4 whitespace-pre-wrap text-sm leading-relaxed">
          <p className="font-bold mb-2">PRESCRIÇÃO:</p>
          {conteudo || '...'}
        </div>

        <Footer />
      </div>
    );
  }

  if (tipo === 'antibiotico') {
    return (
      <div className="h-full flex flex-col relative">
        <div className="absolute top-0 right-0 border border-black p-2 text-[10px] w-48">
          <p className="font-bold text-center mb-1">IDENTIFICAÇÃO DO COMPRADOR</p>
          <p>Nome: _______________________</p>
          <p>RG: _________________________</p>
          <p>End: ________________________</p>
          <p>Cidade: _________ UF: _______</p>
          <p>Telefone: ____________________</p>
        </div>

        <div className="text-center mt-16 mb-8">
          <h1 className="text-xl font-bold uppercase">Receituário de Antimicrobianos</h1>
          <p className="text-sm">1ª Via - Retenção da Farmácia | 2ª Via - Paciente</p>
        </div>

        <div className="border border-black p-4 mb-6">
          <p className="text-sm font-bold mb-2">IDENTIFICAÇÃO DO EMITENTE</p>
          <p className="text-sm">{professional?.name || 'Nome do Profissional'} - CRM/CRO: 123456-UF</p>
          <p className="text-sm">Av. Exemplo, 1000 - Bairro, Cidade - UF</p>
        </div>

        <div className="mb-6">
          <p className="text-sm font-bold">Paciente: <span className="font-normal">{patient?.name || '________________________________________________'}</span></p>
          <p className="text-sm font-bold mt-2">Idade/Sexo: <span className="font-normal">________________________________________________</span></p>
        </div>

        <div className="flex-1 border border-black p-4 whitespace-pre-wrap text-sm leading-relaxed">
          <p className="font-bold mb-2">PRESCRIÇÃO:</p>
          {conteudo || '...'}
        </div>

        <Footer />
      </div>
    );
  }

  return null;
};
