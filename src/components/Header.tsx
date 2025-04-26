
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Contrôle Qualité Microbiologique" }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-[#0091CA] text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-semibold">MAISON COLLET</h1>
          </Link>
          <h2 className="text-xl ml-4">{title}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="border border-white/20 hover:bg-[#007AA8]"
          >
            <Home className="w-4 h-4 mr-2" />
            Accueil
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
