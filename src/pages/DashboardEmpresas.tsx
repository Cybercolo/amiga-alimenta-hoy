
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { FoodListing } from '@/types';
import { Plus, TrendingUp, Package, Clock, Eye, Edit, Trash2, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const DashboardEmpresas = () => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<FoodListing[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.type !== 'business') {
      navigate('/feed');
      return;
    }

    // Load user's listings from localStorage
    const storedListings = JSON.parse(localStorage.getItem('niunamiga_listings') || '[]');
    const userListings = storedListings.filter((listing: FoodListing) => listing.userId === user.id);
    setListings(userListings);
  }, [user, navigate]);

  useEffect(() => {
    let filtered = [...listings];

    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(listing => listing.status === statusFilter);
    }

    setFilteredListings(filtered);
  }, [listings, searchTerm, statusFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500 hover:bg-green-600">Disponible</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Reservado</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Completado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL');
  };

  const handleDelete = (listingId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      const storedListings = JSON.parse(localStorage.getItem('niunamiga_listings') || '[]');
      const updatedListings = storedListings.filter((listing: FoodListing) => listing.id !== listingId);
      localStorage.setItem('niunamiga_listings', JSON.stringify(updatedListings));
      
      setListings(prev => prev.filter(listing => listing.id !== listingId));
      
      toast({
        title: "Publicación eliminada",
        description: "La publicación ha sido eliminada exitosamente.",
      });
    }
  };

  const handleStatusChange = (listingId: string, newStatus: string) => {
    const storedListings = JSON.parse(localStorage.getItem('niunamiga_listings') || '[]');
    const updatedListings = storedListings.map((listing: FoodListing) => 
      listing.id === listingId ? { ...listing, status: newStatus } : listing
    );
    localStorage.setItem('niunamiga_listings', JSON.stringify(updatedListings));
    
    setListings(prev => prev.map(listing => 
      listing.id === listingId ? { ...listing, status: newStatus as any } : listing
    ));
    
    toast({
      title: "Estado actualizado",
      description: `El estado de la publicación ha sido actualizado a ${newStatus}.`,
    });
  };

  const getStats = () => {
    const available = listings.filter(l => l.status === 'available').length;
    const reserved = listings.filter(l => l.status === 'reserved').length;
    const completed = listings.filter(l => l.status === 'completed').length;
    
    return { available, reserved, completed, total: listings.length };
  };

  const stats = getStats();

  if (!user || user.type !== 'business') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Dashboard Empresarial</h1>
          <p className="text-gray-600">Gestiona tus publicaciones de comida y reduce el desperdicio</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Publicaciones</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.available}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reservados</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.reserved}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completados</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-500">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <Input
                placeholder="Buscar publicaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-green-200 focus:border-green-500"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-green-200 focus:border-green-500 md:w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="reserved">Reservado</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={() => navigate('/publicar')}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Publicación
            </Button>
          </div>
        </div>

        {/* Listings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Mis Publicaciones</CardTitle>
            <CardDescription>
              Gestiona todas tus publicaciones de comida desde aquí
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredListings.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {listings.length === 0 ? 'No tienes publicaciones aún' : 'No se encontraron resultados'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {listings.length === 0 
                    ? 'Comienza a publicar comida para reducir el desperdicio'
                    : 'Intenta con otros términos de búsqueda o filtros'}
                </p>
                <Button 
                  onClick={() => navigate('/publicar')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Publicación
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Vencimiento</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha Publicación</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium max-w-xs">
                          <div className="truncate">{listing.title}</div>
                          <div className="text-sm text-gray-500 truncate">{listing.description}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-green-300 text-green-700">
                            {listing.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{listing.quantity}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {formatDate(listing.expirationDate)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(listing.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {formatDate(listing.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={listing.status}
                              onValueChange={(value) => handleStatusChange(listing.id, value)}
                            >
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">Disponible</SelectItem>
                                <SelectItem value="reserved">Reservado</SelectItem>
                                <SelectItem value="completed">Completado</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(listing.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardEmpresas;
