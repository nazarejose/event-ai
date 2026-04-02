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

/**
 * Search with city fallback:
 * 1. Search with city filter
 * 2. If no results and city was provided → retry without city (global)
 */
export async function searchEventsWithFallback(
  filters: SearchFilters
): Promise<{ data: TicketmasterResponse; usedFallback: boolean }> {
  const result = await searchEvents(filters);

  const hasResults =
    result._embedded && result._embedded.events && result._embedded.events.length > 0;

  if (!hasResults && filters.city) {
    const globalResult = await searchEvents({
      ...filters,
      city: undefined,
    });
    return { data: globalResult, usedFallback: true };
  }

  return { data: result, usedFallback: false };
}
