// ─── Ticketmaster API Types ───

export interface TicketmasterImage {
  ratio: string;
  url: string;
  width: number;
  height: number;
}

export interface TicketmasterVenue {
  name: string;
  city?: {
    name: string;
  };
  state?: {
    name: string;
    stateCode: string;
  };
  country?: {
    name: string;
    countryCode: string;
  };
  address?: {
    line1: string;
  };
}

export interface TicketmasterDateInfo {
  localDate: string;
  localTime?: string;
  dateTime?: string;
}

export interface TicketmasterPriceRange {
  type: string;
  currency: string;
  min: number;
  max: number;
}

export interface TicketmasterClassification {
  segment?: { name: string };
  genre?: { name: string };
  subGenre?: { name: string };
}

export interface TicketmasterEvent {
  id: string;
  name: string;
  type: string;
  url: string;
  images: TicketmasterImage[];
  dates: {
    start: TicketmasterDateInfo;
    status?: {
      code: string;
    };
  };
  priceRanges?: TicketmasterPriceRange[];
  classifications?: TicketmasterClassification[];
  _embedded?: {
    venues?: TicketmasterVenue[];
    attractions?: { id: string; name: string; url?: string }[];
  };
}

export interface TicketmasterResponse {
  _embedded?: {
    events: TicketmasterEvent[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

// ─── App Types ───

export interface FavoriteEvent {
  id: string;
  name: string;
  imageUrl: string;
  date: string;
  time?: string;
  venueName: string;
  city: string;
  category: string;
  url: string;
  priceMin?: number;
  priceCurrency?: string;
}

export interface SearchFilters {
  keyword: string;
  city?: string;
  startDateTime?: string;
  endDateTime?: string;
  page?: number;
  size?: number;
}
