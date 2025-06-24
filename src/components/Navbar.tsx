
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, LogOut, Plus, Home, List } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">NM</span>
            </div>
            <span className="text-2xl font-bold text-green-700">Ni Una Miga</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/feed" className="text-gray-700 hover:text-green-600 flex items-center space-x-1">
                  <List className="w-4 h-4" />
                  <span>Ver Comida</span>
                </Link>
                <Link to="/publicar" className="text-gray-700 hover:text-green-600 flex items-center space-x-1">
                  <Plus className="w-4 h-4" />
                  <span>Publicar</span>
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Hola, {user.name}</span>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                    <LogOut className="w-4 h-4 mr-1" />
                    Salir
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" className="text-green-700 hover:text-green-800">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-100">
            {user ? (
              <div className="space-y-3">
                <Link
                  to="/feed"
                  className="block px-3 py-2 text-gray-700 hover:text-green-600 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <List className="w-4 h-4" />
                  <span>Ver Comida</span>
                </Link>
                <Link
                  to="/publicar"
                  className="block px-3 py-2 text-gray-700 hover:text-green-600 flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Plus className="w-4 h-4" />
                  <span>Publicar</span>
                </Link>
                <div className="px-3 py-2 text-sm text-gray-600 border-t border-green-100 mt-3 pt-3">
                  Hola, {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-600 hover:text-red-700 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Salir</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-green-700 hover:text-green-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-green-700 hover:text-green-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
