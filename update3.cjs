const fs = require('fs');

const appContent = fs.readFileSync('src/App.tsx', 'utf-8');

const settingsStart = 'const SettingsView = ({';
const settingsStartIndex = appContent.indexOf(settingsStart);

if (settingsStartIndex === -1) {
  console.error("SettingsView marker not found");
  process.exit(1);
}

const servicosViewCode = `
const ServicosView = ({ services, setServices, inventory }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Dados do Serviço');
  const [filterCategory, setFilterCategory] = useState('Todos');
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Outros');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [tax, setTax] = useState('');
  const [description, setDescription] = useState('');
  const [serviceItems, setServiceItems] = useState<{id: string, itemId: string, quantity: number}[]>([]);
  
  const [desiredMargin, setDesiredMargin] = useState('60');

  const categories = ['Todos', 'Injetáveis', 'Facial', 'Corporal', 'Laser', 'Outros'];

  const handleOpenModal = (service?: any) => {
    if (service) {
      setEditingId(service.id);
      setName(service.name);
      setCategory(service.category);
      setDuration(service.duration.toString());
      setPrice(service.price.toString());
      setTax(service.tax.toString());
      setDescription(service.description || '');
      setServiceItems(service.items || []);
    } else {
      setEditingId(null);
      setName('');
      setCategory('Outros');
      setDuration('');
      setPrice('');
      setTax('');
      setDescription('');
      setServiceItems([]);
    }
    setActiveTab('Dados do Serviço');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    const newService = {
      id: editingId || Date.now().toString(),
      name,
      category,
      duration: parseInt(duration) || 0,
      price: parseFloat(price) || 0,
      tax: parseFloat(tax) || 0,
      description,
      items: serviceItems
    };

    if (editingId) {
      setServices(services.map((s: any) => s.id === editingId ? newService : s));
    } else {
      setServices([...services, newService]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      setServices(services.filter((s: any) => s.id !== id));
    }
  };

  const handleAddItem = () => {
    setServiceItems([...serviceItems, { id: Date.now().toString(), itemId: '', quantity: 1 }]);
  };

  const handleRemoveItem = (id: string) => {
    setServiceItems(serviceItems.filter(item => item.id !== id));
  };

  const handleItemChange = (id: string, field: string, value: any) => {
    setServiceItems(serviceItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateItemCost = (itemId: string, quantity: number) => {
    const invItem = inventory.find((i: any) => i.id === itemId);
    if (!invItem) return 0;
    return invItem.price * quantity;
  };

  const totalCost = serviceItems.reduce((sum, item) => sum + calculateItemCost(item.itemId, item.quantity), 0);
  const currentPrice = parseFloat(price) || 0;
  const currentTax = parseFloat(tax) || 0;
  const taxAmount = currentPrice * (currentTax / 100);
  const grossProfit = currentPrice - totalCost;
  const netProfit = grossProfit - taxAmount;
  const marginPercent = currentPrice > 0 ? (netProfit / currentPrice) * 100 : 0;

  const idealPrice = totalCost / (1 - (parseFloat(desiredMargin) / 100) - (currentTax / 100));

  const filteredServices = filterCategory === 'Todos' ? services : services.filter((s: any) => s.category === filterCategory);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* Header */}
      <header className="pt-12 px-12 pb-8 z-10 shrink-0 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="text-orange-500" size={32} />
              <h1 className="text-3xl font-bold text-white tracking-tight">Catálogo de Serviços</h1>
            </div>
            <p className="text-zinc-400 text-sm">Gerencie seus procedimentos e precificação</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-[#121214] border border-zinc-800 rounded-xl px-4 py-2 flex items-center gap-2">
              <span className="text-zinc-400 text-sm">Ticket Médio:</span>
              <span className="text-white font-medium">R$ 1011</span>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 flex items-center gap-2 text-emerald-500">
              <TrendingUp size={16} />
              <span className="font-medium">Margem: 86%</span>
            </div>
            <button 
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            >
              <Plus size={18} />
              Novo Serviço
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-6 border-b border-zinc-800/50 pb-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={\`text-sm font-medium transition-colors relative \${filterCategory === cat ? 'text-orange-500' : 'text-zinc-500 hover:text-zinc-300'}\`}
            >
              {cat}
              {filterCategory === cat && (
                <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-12 pb-10 z-10 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service: any) => {
            const sTotalCost = (service.items || []).reduce((sum: number, item: any) => sum + calculateItemCost(item.itemId, item.quantity), 0);
            const sTaxAmount = service.price * (service.tax / 100);
            const sNetProfit = service.price - sTotalCost - sTaxAmount;
            const sMargin = service.price > 0 ? (sNetProfit / service.price) * 100 : 0;

            return (
              <div key={service.id} className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 hover:border-orange-500/30 transition-colors group">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[10px] font-bold text-zinc-400 border border-zinc-800 px-2 py-1 rounded uppercase tracking-wider">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(service)} className="text-zinc-500 hover:text-white transition-colors p-1">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(service.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-white font-bold text-xl mb-1">{service.name}</h3>
                  <p className="text-zinc-500 text-sm line-clamp-2">{service.description || 'Sem descrição.'}</p>
                </div>

                <div className="flex items-center gap-4 mb-6 text-sm text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Box size={14} />
                    <span>{formatCurrency(sTotalCost)}</span>
                  </div>
                </div>

                <div className="flex items-end justify-between pt-4 border-t border-zinc-800/50">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase block mb-1">Valor</span>
                    <span className="text-white font-bold text-2xl">{formatCurrency(service.price)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-500 font-bold text-lg block">{sMargin.toFixed(0)}%</span>
                    <span className="text-zinc-500 text-[10px] uppercase tracking-wider">Lucro: {formatCurrency(sNetProfit)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-orange-900/30 rounded-3xl w-full max-w-2xl p-8 shadow-[0_0_50px_rgba(249,115,22,0.1)] relative max-h-[90vh] flex flex-col">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-2 shrink-0">
              <Briefcase className="text-orange-500" size={24} />
              <h2 className="text-2xl font-bold text-white">Cadastrar Serviço</h2>
            </div>
            <p className="text-zinc-400 text-sm mb-6 shrink-0">Configure os detalhes e precificação do procedimento</p>
            
            <div className="flex items-center gap-2 bg-[#121214] p-1 rounded-xl mb-6 shrink-0">
              <button 
                onClick={() => setActiveTab('Dados do Serviço')}
                className={\`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 \${activeTab === 'Dados do Serviço' ? 'bg-[#1c0d04] text-orange-500 border border-[#431c09]' : 'text-zinc-400 hover:text-white'}\`}
              >
                <FileText size={16} />
                Dados do Serviço
              </button>
              <button 
                onClick={() => setActiveTab('Calculadora de Preço')}
                className={\`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 \${activeTab === 'Calculadora de Preço' ? 'bg-[#1c0d04] text-orange-500 border border-[#431c09]' : 'text-zinc-400 hover:text-white'}\`}
              >
                <DollarSign size={16} />
                Calculadora de Preço
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {activeTab === 'Dados do Serviço' ? (
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Nome do Procedimento</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Harmonização Facial"
                      className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Categoria</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                      >
                        {categories.filter(c => c !== 'Todos').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Duração (Min)</label>
                      <input 
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Ex: 60"
                        className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="border border-zinc-800/80 rounded-xl p-4 bg-[#050505]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Box className="text-orange-500" size={16} />
                        <h4 className="text-white font-medium text-sm">Insumos do Procedimento</h4>
                      </div>
                      <button onClick={handleAddItem} className="text-orange-500 hover:text-orange-400 text-xs font-medium flex items-center gap-1">
                        <Plus size={14} /> Adicionar
                      </button>
                    </div>

                    {serviceItems.length === 0 ? (
                      <div className="text-center py-4 text-zinc-600 text-xs italic border-t border-zinc-800/50">
                        Nenhum insumo adicionado.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {serviceItems.map(item => (
                          <div key={item.id} className="flex items-center gap-2">
                            <select 
                              value={item.itemId}
                              onChange={(e) => handleItemChange(item.id, 'itemId', e.target.value)}
                              className="flex-1 bg-[#121214] border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                            >
                              <option value="">Buscar no estoque...</option>
                              {inventory.map((inv: any) => (
                                <option key={inv.id} value={inv.id}>{inv.name} - {formatCurrency(inv.price)}</option>
                              ))}
                            </select>
                            <input 
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              className="w-20 bg-[#121214] border border-zinc-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500 text-center"
                              min="0"
                              step="0.1"
                            />
                            <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-4 pt-3 border-t border-zinc-800/50 flex justify-end items-center gap-2">
                      <span className="text-zinc-500 text-xs">Custo Total:</span>
                      <span className="text-white font-bold">{formatCurrency(totalCost)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Valor de Cobrança (R$)</label>
                      <input 
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Imposto (%)</label>
                      <input 
                        type="number"
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                        placeholder="0"
                        className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Descrição</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detalhes adicionais do procedimento..."
                      className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none h-24"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium flex items-center gap-2"><Asterisk className="text-orange-500" size={16} /> Estratégia de Precificação</h3>
                      <p className="text-zinc-500 text-xs mt-1">Simule cenários e encontre o preço ideal</p>
                    </div>
                    <button className="text-zinc-500 hover:text-white text-xs flex items-center gap-1 transition-colors">
                      <Clock size={12} /> Resetar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Receita Bruta (Preço de Venda)</label>
                      <input 
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Custo Insumos (Auto)</label>
                        <div className="w-full bg-[#121214] border border-zinc-800 rounded-xl px-4 py-3 text-zinc-400">
                          {formatCurrency(totalCost)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 tracking-wider mb-2 uppercase">Imposto (%)</label>
                        <input 
                          type="number"
                          value={tax}
                          onChange={(e) => setTax(e.target.value)}
                          placeholder="0"
                          className="w-full bg-[#050505] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#050505] border border-zinc-800/80 rounded-xl p-5">
                    <span className="text-[10px] font-bold text-zinc-500 tracking-wider mb-4 uppercase block">Breakdown do Resultado</span>
                    
                    <div className="flex flex-col gap-3 text-sm">
                      <div className="flex justify-between text-zinc-300">
                        <span>Receita Bruta</span>
                        <span>{formatCurrency(currentPrice)}</span>
                      </div>
                      <div className="flex justify-between text-red-400">
                        <span>Custo de Insumos</span>
                        <span>- {formatCurrency(totalCost)}</span>
                      </div>
                      <div className="flex justify-between text-zinc-300">
                        <span>Lucro Bruto</span>
                        <span>{formatCurrency(grossProfit)}</span>
                      </div>
                      <div className="flex justify-between text-red-400">
                        <span>Impostos</span>
                        <span>- {formatCurrency(taxAmount)}</span>
                      </div>
                      
                      <div className="border-t border-zinc-800/80 my-2 pt-4 flex items-end justify-between">
                        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Lucro Líquido</span>
                        <div className="text-right">
                          <span className={\`text-2xl font-bold block \${netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}\`}>
                            {formatCurrency(netProfit)}
                          </span>
                          <span className="text-zinc-500 text-[10px] flex items-center justify-end gap-1 mt-1">
                            <TrendingUp size={10} /> {marginPercent.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-orange-900/30 bg-orange-500/5 rounded-xl p-5">
                    <h4 className="text-orange-500 font-medium text-sm flex items-center gap-2 mb-4">
                      <Asterisk size={16} /> Simulador Inteligente
                    </h4>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-zinc-400 text-sm">Margem desejada:</span>
                      <div className="flex items-center bg-[#050505] border border-zinc-800 rounded-lg overflow-hidden w-24">
                        <input 
                          type="number" 
                          value={desiredMargin}
                          onChange={(e) => setDesiredMargin(e.target.value)}
                          className="w-full bg-transparent px-3 py-1.5 text-white text-sm focus:outline-none text-center"
                        />
                        <span className="text-zinc-500 text-xs pr-3">%</span>
                      </div>
                    </div>
                    
                    <p className="text-zinc-400 text-xs flex items-center gap-2">
                      <span className="text-yellow-500">💡</span> Para atingir <strong className="text-white">{desiredMargin}%</strong> de margem, seu preço ideal seria <strong className="text-orange-500">{formatCurrency(idealPrice || 0)}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-zinc-800/50 shrink-0">
              {activeTab === 'Calculadora de Preço' ? (
                <>
                  <button 
                    onClick={() => setActiveTab('Dados do Serviço')}
                    className="flex-1 bg-transparent border border-zinc-800 hover:bg-zinc-900 text-white font-semibold py-3.5 rounded-xl transition-colors"
                  >
                    Voltar
                  </button>
                  <button 
                    onClick={() => setPrice(idealPrice.toFixed(2))}
                    className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                  >
                    Usar este Valor
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleSave}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                >
                  Salvar Serviço
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
`;

let newContent = appContent.substring(0, settingsStartIndex) + servicosViewCode + '\n' + appContent.substring(settingsStartIndex);

const appComponentStart = 'export default function App() {';
const appComponentStartIndex = newContent.indexOf(appComponentStart);

let appComponentContent = newContent.substring(appComponentStartIndex);

appComponentContent = appComponentContent.replace(
  "const [columns, setColumns] = useState<{ id: string, title: string, cardIds: string[] }[]>([]);",
  "const [columns, setColumns] = useState<{ id: string, title: string, cardIds: string[] }[]>([]);\n  const [services, setServices] = useState([\n    { id: '1', name: 'Botox', category: 'Injetáveis', duration: 30, price: 1200, tax: 0, description: 'Sem descrição.', items: [{id: '1', itemId: 'inv1', quantity: 1}] },\n    { id: '2', name: 'Harmonização Facial', category: 'Outros', duration: 90, price: 2500, tax: 0, description: 'Conjunto de procedimentos para equilibrar e realçar os traços do rosto.', items: [] },\n    { id: '3', name: 'Limpeza de Pele', category: 'Facial', duration: 60, price: 250, tax: 0, description: 'Limpeza profunda com extração e hidratação para uma pele renovada e radiante.', items: [] }\n  ]);\n  const [inventory, setInventory] = useState([\n    { id: 'inv1', name: 'Toxina Botulínica (100U)', price: 850 },\n    { id: 'inv2', name: 'Ácido Hialurônico (1ml)', price: 350 },\n    { id: 'inv3', name: 'Seringa Descartável', price: 0.35 },\n    { id: 'inv4', name: 'Agulha 30G', price: 0.15 }\n  ]);"
);

appComponentContent = appComponentContent.replace(
  "activeMenu === 'Profissionais' ? (\n        <ProfissionaisView professionals={professionals} setProfessionals={setProfessionals} />\n      ) : (",
  "activeMenu === 'Profissionais' ? (\n        <ProfissionaisView professionals={professionals} setProfessionals={setProfessionals} />\n      ) : activeMenu === 'Serviços' ? (\n        <ServicosView services={services} setServices={setServices} inventory={inventory} />\n      ) : ("
);

newContent = newContent.substring(0, appComponentStartIndex) + appComponentContent;

fs.writeFileSync('src/App.tsx', newContent);
