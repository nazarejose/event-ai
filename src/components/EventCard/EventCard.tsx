import { useRef, useEffect } from 'react';
import { Heart, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { Pointer } from '../ui/pointer';
import type { TicketmasterEvent } from '@/types';

interface EventCardProps {
  event: TicketmasterEvent;
  isFavorite: boolean;
  onToggleFavorite: (event: TicketmasterEvent) => void;
  index: number;
  variant?: 'dark' | 'light';
}

const EventCard = ({ event, isFavorite, onToggleFavorite, index, variant = 'dark' }: EventCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.6, delay: index * 0.1, ease: 'power3.out' }
      );
    }
  }, [index]);

  const handleCardClick = () => {
    if (event.url) {
      window.open(event.url, '_blank', 'noopener,noreferrer');
    }
  };

  const validImages = (event.images || []).filter(img => !(img as any).fallback);
  const imageSource = validImages.length > 0 ? validImages : (event.images || []);
  const sortedImages = [...imageSource].sort((a, b) => b.width - a.width);
  const imageUrl = sortedImages.find(img => img.ratio === "3_4" || img.ratio === "4_3" || img.ratio === "16_9")?.url || sortedImages[0]?.url;

  const dateObj = new Date(event.dates.start.localDate);
  const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  const shortDate = formattedDate.split(' DE ').join(' ');

  const venue = event._embedded?.venues?.[0];
  const city = venue?.city?.name || venue?.name || venue?.state?.name || 'Evento Online / Não informada';
  const country = venue?.country?.countryCode || 'BR';

  const getArtistTag = (): string => {
    // 1. Try direct attraction (artist/band) name from Ticketmaster
    const attraction = event._embedded?.attractions?.[0]?.name;
    if (attraction) return attraction.toUpperCase();

    // 2. Parse event name: extract text before " - " or ":"
    const name = event.name;
    const beforeDash = name.split(' - ')[0].trim();
    const beforeColon = beforeDash.split(':')[0].trim();
    if (beforeColon && beforeColon !== name) return beforeColon.toUpperCase();

    // 3. Try classification segment (Music, Sports, etc.)
    const segment = event.classifications?.[0]?.segment?.name;
    if (segment && segment !== 'Undefined') return segment.toUpperCase();

    // 4. Fallback: first word if reasonably long
    const firstWord = name.split(' ')[0];
    if (firstWord.length > 3) return firstWord.toUpperCase();

    return 'EVENTS';
  };

  if (variant === 'light') {
    return (
      <div
        className="flex flex-col rounded-[24px] overflow-hidden bg-white group cursor-pointer shadow-sm hover:shadow-md transition-shadow"
        ref={cardRef}
        onClick={handleCardClick}
      >
        <div className="relative aspect-[4/3] w-full rounded-[24px] overflow-hidden bg-gray-100">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={event.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <button
            className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/20 backdrop-blur-md hover:bg-white/40 ${isFavorite ? 'bg-white text-red-500' : 'text-white'}`}
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(event); }}
            aria-label="Favoritar"
          >
            <Heart fill={isFavorite ? 'currentColor' : 'none'} size={20} />
            <Pointer>
              <div className="text-2xl">{isFavorite ? '💔' : '❤️'}</div>
            </Pointer>
          </button>
        </div>

        <div className="py-5 flex flex-col flex-1 px-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-sm uppercase">
              {getArtistTag()}
            </span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {shortDate}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
            {event.name}
          </h3>

          <div className="flex items-center gap-1.5 text-gray-500 mb-6">
            <MapPin size={14} />
            <span className="text-sm">{city}, {country}</span>
          </div>

          <div className="mt-auto">
            <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-full text-sm transition-colors">
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-[24px] overflow-hidden bg-gray-900 aspect-[3/4] flex flex-col group cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
      ref={cardRef}
      onClick={handleCardClick}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 z-0"></div>

      <button
        className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/20 backdrop-blur-md hover:bg-white/40 hover:scale-110 ${isFavorite ? 'bg-white text-red-500 hover:bg-white' : 'text-white'}`}
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(event); }}
        aria-label="Favoritar"
      >
        <Heart fill={isFavorite ? 'currentColor' : 'none'} size={20} />
        <Pointer>
          <div className="text-2xl">{isFavorite ? '💔' : '❤️'}</div>
        </Pointer>
      </button>

      <div className="absolute bottom-0 left-0 w-full p-6 z-10 text-white">
        <div className="flex gap-2 text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wide">
          <span>{shortDate}</span>
          <span>•</span>
          <span>{city}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 leading-tight">
          {event.name}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-2">
          Explore os ingressos e prepare-se para essa experiência imperdível em {city}.
        </p>
      </div>
    </div>
  );
};

export default EventCard;
