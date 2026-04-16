import { Injectable, Logger } from '@nestjs/common';

export interface PjeRecipient {
  polo: string;
  comunicacao_id: number;
  nome: string;
}

export interface PjeLawyer {
  id: number;
  nome: string;
  numero_oab: string;
  uf_oab: string;
}

export interface PjeLawyerEntry {
  id: number;
  comunicacao_id: number;
  advogado_id: number;
  advogado: PjeLawyer;
}

export interface PjeItem {
  id: number;
  hash: string;
  siglaTribunal: string;
  nomeOrgao: string;
  tipoComunicacao: string;
  tipoDocumento: string | null;
  nomeClasse: string | null;
  numero_processo: string;
  numeroprocessocommascara: string;
  texto: string;
  meio: string;
  meiocompleto: string;
  link: string | null;
  status: string;
  data_disponibilizacao: string;
  destinatarios: PjeRecipient[];
  destinatarioadvogados: PjeLawyerEntry[];
}

interface PjeApiResponse {
  status: string;
  message: string;
  count: number;
  items: PjeItem[];
}

const BASE_URL = 'https://comunicaapi.pje.jus.br/api/v1';
const ITEMS_PER_PAGE = 100;
const DELAY_MS = 50;

@Injectable()
export class PjeService {
  private readonly logger = new Logger(PjeService.name);

  async fetchPage(dataInicio: string, dataFim: string, pagina: number): Promise<PjeApiResponse> {
    const params = new URLSearchParams({
      pagina: String(pagina),
      itensPorPagina: String(ITEMS_PER_PAGE),
      dataDisponibilizacaoInicio: dataInicio,
      dataDisponibilizacaoFim: dataFim,
    });

    const response = await fetch(`${BASE_URL}/comunicacao?${params}`, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`PJE API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<PjeApiResponse>;
  }

  async fetchAll(dataInicio: string, dataFim: string): Promise<PjeItem[]> {
    const allItems: PjeItem[] = [];
    let pagina = 1;

    this.logger.log(`Fetching communications from ${dataInicio} to ${dataFim}`);

    while (true) {
      const data = await this.fetchPage(dataInicio, dataFim, pagina);

      if (!data.items?.length) break;

      allItems.push(...data.items);
      this.logger.log(`Page ${pagina}: ${data.items.length} items (total: ${allItems.length})`);

      if (data.items.length < ITEMS_PER_PAGE) break;

      pagina++;
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    }

    this.logger.log(`Fetch complete: ${allItems.length} items for ${dataInicio} to ${dataFim}`);

    return allItems;
  }
}
