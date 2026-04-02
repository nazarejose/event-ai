import type { SearchFilters, TicketmasterResponse } from '@/types';

const API_BASE = '/api/ticketmaster/discovery/v2/events.json';

function getApiKey(): string {
  return import.meta.env.VITE_TICKETMASTER_API_KEY || '';
}

export async function searchEvents(
  filters: SearchFilters
): Promise<TicketmasterResponse> {
  const params = new URLSearchParams();
  params.set('apikey', getApiKey());
  params.set('locale', '*');
  params.set('size', String(filters.size ?? 20));
  params.set('page', String(filters.page ?? 0));

  if (filters.keyword) {
    params.set('keyword', filters.keyword);
  }
  if (filters.city) {
    params.set('city', filters.city);
  }
  if (filters.startDateTime) {
    params.set('startDateTime', filters.startDateTime);
  }
  if (filters.endDateTime) {
    params.set('endDateTime', filters.endDateTime);
  }

  const url = `${API_BASE}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ticketmaster API error: ${response.status}`);
  }

  return response.json();
}
