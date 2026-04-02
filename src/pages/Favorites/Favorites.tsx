import { useEffect, useRef } from 'react';
import { HeartCrack } from 'lucide-react';
import gsap from 'gsap';
import EventCard from '../../components/EventCard/EventCard';
import Footer from '../../components/Footer/Footer';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { TicketmasterEvent } from '../../services/api';

const Favorites = () => {
  const [favorites, setFavorites] = useLocalStorage<TicketmasterEvent[]>('eventai_favorites', []);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  const toggleFavorite = (event: TicketmasterEvent) => {
    setFavorites(favorites.filter(f => f.id !== event.id));
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 pb-24 min-h-screen" ref={containerRef}>
      <header className="mb-16">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6">
          Sua curadoria.
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl font-medium">
          Os eventos que você salvou estão prontos para serem vividos.
        </p>
      </header>

      {favorites.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[32px] border border-gray-100 flex flex-col items-center gap-4">
          <HeartCrack size={48} className="text-gray-300" />
          <h3 className="text-2xl font-bold text-gray-900">Nenhum favorito ainda</h3>
          <p className="text-gray-500 max-w-md">Você não adicionou nenhum evento à sua lista de favoritos. Volte para a página principal para descobrir eventos incríveis.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {favorites.map((event, index) => (
              <EventCard 
                key={event.id}
                event={event}
                index={index}
                variant="light"
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Favorites;
