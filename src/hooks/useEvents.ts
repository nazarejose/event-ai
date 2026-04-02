import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../services/api';

export const useEvents = (keyword: string, city: string) => {
  return useQuery({
    queryKey: ['events', keyword, city],
    queryFn: async () => {
      let data = await fetchEvents(keyword, city);
      
      if ((!data || data.length === 0) && city) {
        data = await fetchEvents(keyword, '');
      }
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};
