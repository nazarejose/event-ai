import { useState, useCallback } from 'react';
import type { SearchFilters, TicketmasterEvent } from '@/types';
import { searchEvents } from '@/services/ticketmaster';

interface UseEventsReturn {
  events: TicketmasterEvent[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  totalPages: number;
  currentPage: number;
  search: (filters: SearchFilters) => Promise<void>;
  loadMore: () => Promise<void>;
}

export function useEvents(): UseEventsReturn {
  const [events, setEvents] = useState<TicketmasterEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [lastFilters, setLastFilters] = useState<SearchFilters | null>(null);

  const search = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);
    setIsEmpty(false);
    setLastFilters(filters);

    try {
      const data = await searchEvents({ ...filters, page: 0 });
      const eventsList = data._embedded?.events ?? [];
      setEvents(eventsList);
      setIsEmpty(eventsList.length === 0);
      setTotalPages(data.page?.totalPages ?? 0);
      setCurrentPage(0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Ocorreu um erro ao buscar eventos. Tente novamente.'
      );
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!lastFilters || currentPage + 1 >= totalPages) return;

    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const data = await searchEvents({ ...lastFilters, page: nextPage });
      const newEvents = data._embedded?.events ?? [];
      setEvents((prev) => [...prev, ...newEvents]);
      setCurrentPage(nextPage);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar mais eventos.'
      );
    } finally {
      setLoading(false);
    }
  }, [lastFilters, currentPage, totalPages]);

  return {
    events,
    loading,
    error,
    isEmpty,
    totalPages,
    currentPage,
    search,
    loadMore,
  };
}
