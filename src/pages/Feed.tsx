import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { FoodListing } from '@/types';
import { MapPin, Calendar, User, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<FoodListing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load listings from localStorage
    const storedListings = JSON.parse(localStorage.getItem('niunamiga_listings') || '[]');
    
    // Add some sample data if none exists
    if (storedListings.length === 0) {
      const sampleListings: FoodListing[] = [
        {
          id: '1',
          title: 'Verduras frescas del huerto',
          description: 'Tengo lechugas, tomates y zanahorias que no voy a poder consumir. Están súper frescas y orgánicas.',
          category: 'Frutas y Verduras',
          quantity: '3 kg aprox',
          expirationDate: '2024-06-27',
          address: 'Las Condes, Santiago',
          latitude: -33.4172,
          longitude: -70.6036,
          userId: '2',
          userName: 'María González',
          createdAt: '2024-06-25T10:00:00Z',
          status: 'available'
        },
        {
          id: '2',
          title: 'Pan del día anterior',
          description: 'Somos una panadería y tenemos pan fresco del día anterior. Perfecto para tostadas o para compartir.',
          category: 'Panadería',
          quantity: '20 unidades',
          expirationDate: '2024-06-26',
          address: 'Providencia, Santiago',
          latitude: -33.4378,
          longitude: -70.6504,
          userId: '3',
          userName: 'Panadería El Trigal',
          createdAt: '2024-06-25T08:30:00Z',
          status: 'available'
        },
        {
          id: '3',
          title: 'Frutas variadas',
          description: 'Manzanas, peras y plátanos. Algunas tienen manchitas pero están buenas para consumir o hacer jugos.',
          category: 'Frutas y Verduras',
          quantity: '2 kg',
          expirationDate: '2024-06-26',
          address: 'Ñuñoa, Santiago',
          latitude: -33.4569,
          longitude: -70.5959,
          userId: '4',
          userName: 'Carlos Mendoza',
          createdAt: '2024-06-24T16:20:00Z',
          status: 'available'
        }
      ];
      
      localStorage.setItem('niunamiga_listings', JSON.stringify(sampleListings));
      setListings(sampleListings);
    } else {
      setListings(storedListings);
    }
  }, [user, navigate]);

  useEffect(() => {
    let filtered = listings.filter(listing => listing.status === 'available');

    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(listing => listing.category === categoryFilter);
    }

    setFilteredListings(filtered);
  }, [listings, searchTerm, categoryFilter]);

  const categories = [
    'Frutas y Verduras',
    'Panadería',
    'Carnes y Pescados',
    'Lácteos',
    'Comida Preparada',
    'Conservas',
    'Otros'
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL');
  };

  const getDaysUntilExpiration = (expirationDate: string) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpirationBadge = (expirationDate: string) => {
    const days = getDaysUntilExpiration(expirationDate);
    
    if (days < 0) {
      return <Badge variant="destructive">Vencido</Badge>;
    } else if (days === 0) {
      return <Badge className="bg-orange-500 hover:bg-orange-600">Vence hoy</Badge>;
    } else if (days === 1) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Vence mañana</Badge>;
    } else if (days <= 3) {
      return <Badge className="bg-yellow-400 hover:bg-yellow-500">{days} días</Badge>;
    } else {
      return <Badge variant="secondary">{days} días</Badge>;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Comida Disponible</h1>
          <p className="text-gray-600">Descubre comida cerca de ti y ayuda a reducir el desperdicio</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por título, descripción o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-green-200 focus:border-green-500"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-green-200 focus:border-green-500">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {listings.length === 0 ? 'No hay comida publicada aún' : 'No se encontraron resultados'}
            </h3>
            <p className="text-gray-600 mb-6">
              {listings.length === 0 
                ? 'Sé el primero en compartir comida con tu comunidad'
                : 'Intenta con otros términos de búsqueda o filtros'}
            </p>
            <Button 
              onClick={() => navigate('/publicar')}
              className="bg-green-600 hover:bg-green-700"
            >
              Publicar Comida
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow border-green-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-green-800 line-clamp-2">
                      {listing.title}
                    </CardTitle>
                    {getExpirationBadge(listing.expirationDate)}
                  </div>
                  <CardDescription className="line-clamp-3">
                    {listing.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline" className="border-green-300 text-green-700">
                      {listing.category}
                    </Badge>
                    <span className="text-sm font-medium text-gray-700">
                      {listing.quantity}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      {listing.address}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-green-600" />
                      Vence: {formatDate(listing.expirationDate)}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-green-600" />
                      {listing.userName}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 mt-4"
                    onClick={() => {
                      // For now, just show a toast. In a real app, this would open a contact modal
                      alert(`¡Interesado en "${listing.title}"! En una versión completa, aquí podrías contactar a ${listing.userName}.`);
                    }}
                  >
                    Estoy Interesado
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
