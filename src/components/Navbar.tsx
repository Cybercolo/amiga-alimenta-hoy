
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Apple, Plus, Calendar, User, MessageCircle, Building2, LogOut } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    ...(user ? [
      { name: 'Comida Disponible', path: '/feed', icon: Apple },
      { name: 'Publicar', path: '/publicar', icon: Plus },
      { name: 'Mis Reservas', path: '/mis-reservas', icon: Calendar },
      { name: 'Mensajes', path: '/mensajes', icon: MessageCircle },
      ...(user.type === 'business' ? [{ name: 'Dashboard', path: '/dashboard-empresas', icon: Building2 }] : [])
    ] : []),
  ];

  return (
    <nav className="bg-green-100 border-b border-green-200 py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to={user ? "/feed" : "/"} className="flex items-center text-green-800 font-bold text-lg">
          <img src="/logo-ni-una-miga.png" alt="Ni Una Miga Logo" className="h-8 w-auto mr-2" />
          Ni Una Miga
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-gray-700 hover:text-green-600 flex items-center space-x-1"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
          {user ? (
            <Button variant="outline" size="sm" onClick={handleLogout} className="bg-red-50 text-red-500 border-red-200 hover:bg-red-100 hover:text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-green-600">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
                Regístrate
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white">
              <SheetHeader>
                <SheetTitle>Menú</SheetTitle>
                <SheetDescription>
                  Navega por la aplicación
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-gray-700 hover:text-green-600 flex items-center space-x-2 py-2 px-4 rounded hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                {user ? (
                  <Button variant="outline" size="sm" onClick={handleLogout} className="justify-start bg-red-50 text-red-500 border-red-200 hover:bg-red-100 hover:text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Salir
                  </Button>
                ) : (
                  <>
                    <Link to="/login" className="text-gray-700 hover:text-green-600 py-2 px-4 rounded hover:bg-gray-100 block">
                      Iniciar Sesión
                    </Link>
                    <Link to="/register" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 block">
                      Regístrate
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
