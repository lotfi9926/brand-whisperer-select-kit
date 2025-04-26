
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import NotificationBell from '@/components/NotificationBell';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, History, LogOut, Home } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Contrôle Qualité Microbiologique" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAccessLog = () => {
    navigate('/access-log');
  };

  const handleChangeHistory = () => {
    navigate('/history');
  };

  const roleLabel = user?.role === 'coordinator' ? 'Coordinateur' : 'Technicien';
  const roleBgColor = user?.role === 'coordinator' ? 'bg-blue-100' : 'bg-green-100';
  const roleTextColor = user?.role === 'coordinator' ? 'text-blue-800' : 'text-green-800';

  return (
    <header className="bg-[#0091CA] text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-semibold">MAISON COLLET</h1>
          </Link>
          <h2 className="text-xl ml-4">{title}</h2>
        </div>
        
        {user ? (
          <div className="flex items-center gap-2">
            <NotificationBell />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative border border-white/20 hover:bg-[#007AA8]">
                  <span className="mr-2">{user.name}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${roleBgColor} ${roleTextColor}`}>
                    {roleLabel}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/')}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Accueil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleChangeHistory}>
                  <History className="mr-2 h-4 w-4" />
                  <span>Historique des modifications</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAccessLog}>
                  <Clock className="mr-2 h-4 w-4" />
                  <span>Journal des accès</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="border border-white/20 hover:bg-[#007AA8]"
            >
              <Home className="w-4 h-4 mr-2" />
              Accueil
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="bg-white text-[#0091CA] hover:bg-gray-100"
            >
              Connexion
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
