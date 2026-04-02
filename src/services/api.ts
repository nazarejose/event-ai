const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY || '';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';

export interface TicketmasterEvent {
  id: string;
  name: string;
  url: string;
  images: { url: string; width: number; height: number; ratio?: string }[];
  dates: {
    start: {
      localDate: string;
      localTime?: string;
    }
  };
  _embedded?: {
    venues?: {
      name: string;
      city?: { name: string };
      state?: { name: string };
      country?: { name: string; countryCode?: string };
    }[];
  };
}

export const fetchEvents = async (keyword: string, city?: string): Promise<TicketmasterEvent[]> => {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      size: '20',
      sort: 'date,asc',
    });

    if (keyword) params.append('keyword', keyword);
    if (city) params.append('city', city);

    const response = await fetch(`${BASE_URL}/events.json?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data._embedded?.events || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};
