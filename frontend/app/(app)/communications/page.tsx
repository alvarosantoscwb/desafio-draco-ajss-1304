'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { CommunicationCard, CommunicationCardSkeleton } from '@/components/communication-card';
import { DateRangePicker } from '@/components/date-range-picker';
import { getCommunications } from '@/services/communications';
import { Communication } from '@/types/communication';

const TRIBUNAIS = [
  'TJSP', 'TJRJ', 'TJMG', 'TJRS', 'TJPR', 'TJSC', 'TJBA',
  'TJGO', 'TJPE', 'TJCE', 'TJMA', 'TJPB', 'TJRN', 'TJES',
  'TJMS', 'TJMT', 'TJRO', 'TJAM', 'TJPA', 'TJAL', 'TJSE',
  'TJPI', 'TJTO', 'TJAC', 'TJAP', 'TJRR',
];

export default function ComunicacoesPage() {
  const router = useRouter();

  const [communications, setCommunications] = useState<Communication[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [tribunal, setTribunal] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const [search, setSearch] = useState('');

  const fetchData = useCallback(async (currentPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCommunications({
        page: currentPage,
        limit: 10,
        numeroProcesso: numeroProcesso || undefined,
        tribunal: tribunal || undefined,
        dataInicio: dateRange.from || undefined,
        dataFim: dateRange.to || undefined,
      });
      setCommunications(result.data);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {
      setError('Erro ao carregar comunicações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [numeroProcesso, tribunal, dateRange]);

  useEffect(() => {
    fetchData(page);
  }, [fetchData, page]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setNumeroProcesso(search);
    setPage(1);
  }

  function handleDateRangeChange(range: { from: string; to: string }) {
    setDateRange(range);
    setPage(1);
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6 border border-gray-300 p-6 rounded-xl rounded-[#D4D4D4]">
        <h1 className="text-2xl font-bold text-[#262626] rounded ">Comunicações</h1>
        <p className="text-sm text-[#262626] mt-1">
          Acompanhe as comunicações processuais obtidas do Diário de Justiça Eletrônico Nacional,
          organizadas e salvas automaticamente para sua consulta.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Busca por processo */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por número do processo"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0D4897] focus:border-transparent transition"
              />
            </div>
          </form>

          {/* Tribunal */}
          <select
            value={tribunal}
            onChange={(e) => { setTribunal(e.target.value); setPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#0D4897] focus:border-transparent transition text-[#6D6D6E] min-w-[180px]"
          >
            <option value="">Selecione um tribunal</option>
            {TRIBUNAIS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Datas */}
          <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
        </div>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <CommunicationCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-24">
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={() => fetchData(page)}
            className="mt-3 text-sm text-[#0D4897] hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      ) : communications.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#E5E5E5' }}>
            <Search size={24} style={{ color: '#262626' }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#262626]">Nenhuma comunicação encontrada</p>
            <p className="text-sm text-[#6D6D6E] mt-1">Não encontramos resultados para os filtros<br />aplicados. Tente ajustar os critérios de busca.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {communications.map((c) => (
              <CommunicationCard
                key={c.id}
                communication={c}
                onClick={() => router.push(`/communications/${encodeURIComponent(c.processNumber)}`)}
              />
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition ${pageNum === page
                      ? 'bg-[#0D4897] text-white'
                      : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
