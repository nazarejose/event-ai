import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import EventCard from '../../components/EventCard/EventCard';
import EmptyState from '../../components/EmptyState/EmptyState';
import Hero from '../../components/Hero/Hero';
import Footer from '../../components/Footer/Footer';
import { useEvents } from '../../hooks/useEvents';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { TicketmasterEvent } from '../../services/api';

const Home = () => {
  const [searchState, setSearchState] = useState({ keyword: '', city: '' });
  const { data: events = [] as TicketmasterEvent[], isLoading, isError } = useEvents(searchState.keyword, searchState.city);
  const [favorites, setFavorites] = useLocalStorage<TicketmasterEvent[]>('eventai_favorites', []);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const handleSearch = (keyword: string, city: string) => {
    setSearchState({ keyword, city });
    setPage(0);
  };

  const toggleFavorite = (event: TicketmasterEvent) => {
    const isFav = favorites.find(f => f.id === event.id);
    if (!isFav) {
      setFavorites([...favorites, event]);
      navigate('/favorites');
    } else {
      setFavorites(favorites.filter(f => f.id !== event.id));
    }
  };

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const paginatedEvents = events.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  return (
    <div className="pb-8">
      <Hero onSearch={handleSearch} />

      <main className="max-w-[1600px] mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900">Eventos em Destaque</h2>
          </div>
          <div className="hidden md:flex gap-3">
            <button 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              name='search-prev'
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 placeholder:text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              name='search-next'
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {isError && (
          <EmptyState message="Ocorreu um erro ao buscar os eventos. Tente novamente mais tarde." />
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-gray-200 rounded-[24px] aspect-[3/4] animate-pulse"></div>
            ))}
          </div>
        ) : !isError && events.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginatedEvents.map((event, index) => (
               <EventCard 
                key={event.id}
                event={event}
                index={index}
                isFavorite={favorites.some(f => f.id === event.id)}
                onToggleFavorite={toggleFavorite}
                variant="dark"
              />
            ))}
          </div>
        )}
      </main>

      <div className="max-w-[1600px] mx-auto px-6">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
