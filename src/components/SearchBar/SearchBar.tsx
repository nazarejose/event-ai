import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface SearchBarProps {
  onSearch: (keyword: string, city: string) => void;
}

interface CitySuggestion {
  display_name: string;
  name: string;
  place_id: string;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Geolocation on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const mapUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
            const response = await fetch(mapUrl);
            const data = await response.json();
            if (data?.address) {
              const detectedCity = data.address.city || data.address.town || data.address.village;
              if (detectedCity) {
                setCity(detectedCity);
                onSearch('', detectedCity);
                return;
              }
            }
          } catch (error) {
            console.error('Erro geolocalização:', error);
          }
          onSearch('', '');
        },
        () => { onSearch('', ''); }
      );
    } else {
      onSearch('', '');
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced city autocomplete via Nominatim
  const fetchSuggestions = useCallback((value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&featuretype=city&limit=6&accept-language=pt-BR,pt`;
        const res = await fetch(url);
        const data: CitySuggestion[] = await res.json();
        const unique = Array.from(
          new Map(data.map(item => [item.name, item])).values()
        ).slice(0, 5);
        setSuggestions(unique);
        setShowSuggestions(unique.length > 0);
        setActiveSuggestionIndex(-1);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);
    fetchSuggestions(value);
  };

  const selectSuggestion = (suggestion: CitySuggestion) => {
    // Extract just the city name (first part before comma)
    const cityName = suggestion.name || suggestion.display_name.split(',')[0].trim();
    setCity(cityName);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(keyword, cityName);
  };

  const handleCityKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeSuggestionIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(keyword, city);
  };

  return (
    <form
      className="bg-white/90 backdrop-blur-md p-4 rounded-[24px] shadow-lg flex flex-col gap-4 w-[90%] max-w-3xl absolute -bottom-16"
      onSubmit={handleSubmit}
    >
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Qual evento você está procurando?"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full pl-4 sm:pl-6 pr-12 sm:pr-14 py-6 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 focus-visible:ring-primary focus-visible:bg-white transition-colors text-xs sm:text-sm md:text-base"
        />
        <Button
          type="submit"
          size="icon"
          aria-label='search'
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Search size={18} />
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div ref={wrapperRef} className="relative flex-1">
          <div className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-5 py-3 rounded-full border border-transparent hover:border-gray-300 focus-within:border-gray-200 focus-within:bg-white transition-colors">
            {loadingSuggestions
              ? <Loader2 size={18} className="text-gray-400 animate-spin shrink-0" />
              : <MapPin size={18} className="text-gray-400 shrink-0" />
            }
            <input
              type="text"
              placeholder="Cidade"
              value={city}
              onChange={handleCityChange}
              onKeyDown={handleCityKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              autoComplete="off"
              className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {suggestions.map((suggestion, index) => {
                const cityName = suggestion.name || suggestion.display_name.split(',')[0].trim();
                const subtitle = suggestion.display_name.split(',').slice(1, 3).join(',').trim();
                return (
                  <li
                    key={suggestion.place_id}
                    onMouseDown={() => selectSuggestion(suggestion)}
                    className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${
                      index === activeSuggestionIndex
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate">{cityName}</span>
                      {subtitle && (
                        <span className="text-xs text-gray-400 truncate">{subtitle}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
