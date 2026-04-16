import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'https://comunicaapi.pje.jus.br/api/v1';
const ITEMS_PER_PAGE = 100;

interface PjeRecipient {
  polo: string;
  comunicacao_id: number;
  nome: string;
}

interface PjeAdvogado {
  id: number;
  nome: string;
  numero_oab: string;
  uf_oab: string;
}

interface PjeLawyerEntry {
  id: number;
  comunicacao_id: number;
  advogado_id: number;
  advogado: PjeAdvogado;
}

interface PjeItem {
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

interface PjeResponse {
  items: PjeItem[];
}

async function fetchPage(
  dataInicio: string,
  dataFim: string,
  pagina: number,
): Promise<PjeResponse> {
  const params = new URLSearchParams({
    pagina: String(pagina),
    itensPorPagina: String(ITEMS_PER_PAGE),
    dataDisponibilizacaoInicio: dataInicio,
    dataDisponibilizacaoFim: dataFim,
  });

  const response = await fetch(`${BASE_URL}/comunicacao?${params}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json() as Promise<PjeResponse>;
}

async function fetchDay(dateStr: string): Promise<PjeItem[]> {
  const items: PjeItem[] = [];
  let pagina = 1;

  while (true) {
    const data = await fetchPage(dateStr, dateStr, pagina);
    if (!data.items?.length) break;
    items.push(...data.items);
    if (data.items.length < ITEMS_PER_PAGE) break;
    pagina++;
    await new Promise((r) => setTimeout(r, 50));
  }

  return items;
}

async function upsertCommunication(item: PjeItem) {
  await prisma.communication.upsert({
    where: { hash: item.hash },
    create: {
      id: item.id,
      hash: item.hash,
      courtAcronym: item.siglaTribunal,
      organName: item.nomeOrgao,
      communicationType: item.tipoComunicacao,
      documentType: item.tipoDocumento,
      className: item.nomeClasse,
      processNumber: item.numero_processo,
      processNumberMask: item.numeroprocessocommascara,
      content: item.texto,
      medium: item.meio,
      mediumFull: item.meiocompleto,
      link: item.link,
      status: item.status,
      availableAt: new Date(item.data_disponibilizacao),
      recipients: {
        create: [
          ...item.destinatarios.map((d) => ({
            name: d.nome,
            pole: d.polo,
            isLawyer: false,
          })),
          ...item.destinatarioadvogados.map((a) => ({
            name: a.advogado.nome,
            isLawyer: true,
            oabNumber: a.advogado.numero_oab,
            oabState: a.advogado.uf_oab,
          })),
        ],
      },
    },
    update: {},
  });
}

async function main() {
  console.log('Starting seed: fetching last 20 days of communications...');

  let totalSaved = 0;
  const today = new Date();

  for (let i = 1; i <= 20; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    process.stdout.write(`Fetching ${dateStr}... `);

    try {
      const items = await fetchDay(dateStr);

      for (const item of items) {
        await upsertCommunication(item);
        totalSaved++;
      }

      console.log(`${items.length} communications saved`);
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  console.log(`\nSeed complete: ${totalSaved} total communications saved.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
