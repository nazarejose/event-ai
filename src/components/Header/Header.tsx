import { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';

const Header = () => {
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  const isFavorites = location.pathname === '/favorites';

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [location.pathname]);

  return (
    <header ref={headerRef} className="py-6 flex justify-between items-center max-w-[1600px] mx-auto px-4 sm:px-6 w-full gap-2">
      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {isFavorites && (
          <Link to="/" className="text-gray-500 hover:text-gray-900 transition-colors flex-shrink-0 text-xl font-bold">
            ←
          </Link>
        )}
        <Link to="/" className="font-extrabold text-lg sm:text-xl tracking-tight text-gray-900 whitespace-nowrap">
          EVENT AI
        </Link>
      </div>

      <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
        <Link to="/" className={`hover:text-primary transition-colors ${!isFavorites ? 'text-primary border-b-2 border-primary pb-1' : ''}`}>
          Buscar
        </Link>
        <Link to="/favorites" className={`hover:text-primary transition-colors ${isFavorites ? 'text-primary border-b-2 border-primary pb-1' : ''}`}>
          Favoritos
        </Link>
      </nav>

      <div className="flex-shrink-0">
        <Link className="inline-block rounded-full bg-indigo-600 hover:bg-indigo-700 py-2 text-white font-semibold px-4 sm:px-6 text-xs sm:text-sm transition-colors whitespace-nowrap" to="/favorites">
          Ver meus eventos
        </Link>
      </div>
    </header>
  );
};

export default Header;
