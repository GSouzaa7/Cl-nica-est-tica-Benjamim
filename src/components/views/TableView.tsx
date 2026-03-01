import React from 'react';
import { Search, Filter, Download, Plus, MoreVertical } from 'lucide-react';
import { Card, Button, Badge } from '../ui/BaseComponents';

interface TableViewProps {
  title: string;
  subtitle: string;
  columns: { key: string, label: string, render?: (val: any, row: any) => React.ReactNode }[];
  data: any[];
  onAdd?: () => void;
  actions?: (row: any) => React.ReactNode;
}

export const TableView = ({ title, subtitle, columns, data, onAdd, actions }: TableViewProps) => {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
          <p className="text-slate-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter size={18} /> Filtros
          </Button>
          <Button variant="outline">
            <Download size={18} /> Exportar
          </Button>
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus size={18} /> Novo Registro
            </Button>
          )}
        </div>
      </header>

      <Card className="p-0">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar registros..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                {columns.map((col) => (
                  <th key={col.key} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-slate-600">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    {actions ? actions(row) : (
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-500 text-sm">Nenhum registro encontrado.</p>
          </div>
        )}

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Mostrando {data.length} registros</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>Próximo</button>
          </div>
        </div>
      </Card>
    </div>
  );
};
