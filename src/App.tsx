import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import Favorites from './pages/Favorites/Favorites';

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
