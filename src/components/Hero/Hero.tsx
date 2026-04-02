import SearchBar from '../SearchBar/SearchBar';

interface HeroProps {
  onSearch: (keyword: string, city: string) => void;
}

const Hero = ({ onSearch }: HeroProps) => {
  return (
    <div className="relative w-full h-[500px] mb-40 rounded-[32px]">
      <div className="absolute inset-x-6 inset-y-0 rounded-[32px] overflow-hidden">
        <picture>
          <source srcSet="fotoHero.webp" type="image/webp" />
          <img src="fotoHero.jpg" alt="Concert" className="w-full h-full object-cover" fetchPriority="high" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-[#f8f9fa]/40 to-transparent"></div>
      </div>

      <div className="absolute bottom-0 inset-x-0 w-full flex justify-center translate-y-16 z-20">
        <SearchBar onSearch={onSearch} />
      </div>
    </div>
  );
};

export default Hero;
