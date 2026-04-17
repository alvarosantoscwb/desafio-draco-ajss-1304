import { Communication, CommunicationsResponse } from '@/types/communication';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getCommunications(params: {
  page?: number;
  limit?: number;
  dataInicio?: string;
  dataFim?: string;
  tribunal?: string;
  numeroProcesso?: string;
}): Promise<CommunicationsResponse> {
  const query = new URLSearchParams();

  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.dataInicio) query.set('dataInicio', params.dataInicio);
  if (params.dataFim) query.set('dataFim', params.dataFim);
  if (params.tribunal) query.set('tribunal', params.tribunal);
  if (params.numeroProcesso) query.set('numeroProcesso', params.numeroProcesso);

  const response = await fetch(`${API_URL}/communications?${query}`, {
    headers: authHeaders(),
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) throw new Error('Erro ao buscar comunicações');

  return response.json();
}

export async function getProcessDetails(processNumber: string) {
  const response = await fetch(
    `${API_URL}/communications/process/${encodeURIComponent(processNumber)}`,
    { headers: authHeaders() },
  );

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!response.ok) throw new Error('Erro ao buscar detalhes do processo');

  return response.json();
}

export async function generateSummary(id: number): Promise<{ summary: string }> {
  const response = await fetch(`${API_URL}/communications/${id}/summary`, {
    method: 'POST',
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error('Erro ao gerar resumo');

  return response.json();
}
