import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface SearchBarProps {
  onSearch: (keyword: string, city: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const mapUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
          const response = await fetch(mapUrl);
          const data = await response.json();
          if (data && data.address) {
            const detectedCity = data.address.city || data.address.town || data.address.village;
            if (detectedCity) setCity(detectedCity);
          }
        } catch (error) {
          console.error("Erro geolocalização:", error);
        }
      }, () => {});
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          className="w-full pl-6 pr-14 py-6 rounded-full border-gray-200 bg-gray-50 focus-visible:ring-primary focus-visible:bg-white text-base"
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
        <div className="flex-1 flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full border border-transparent focus-within:border-gray-200 focus-within:bg-white transition-colors">
          <MapPin size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cidade" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
