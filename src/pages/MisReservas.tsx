
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Reservation } from '@/types';
import { MapPin, Calendar, User, Package, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const MisReservas = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.type !== 'individual') {
      navigate('/feed');
      return;
    }

    // Load user's reservations from localStorage
    const storedReservations = JSON.parse(localStorage.getItem('niunamiga_reservations') || '[]');
    const userReservations = storedReservations.filter((reservation: Reservation) => reservation.reservedBy === user.id);
    setReservations(userReservations);
  }, [user, navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendiente</Badge>;
      case 'confirmed':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Confirmado</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completado</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

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

  const handleMarkCompleted = (reservationId: string) => {
    const storedReservations = JSON.parse(localStorage.getItem('niunamiga_reservations') || '[]');
    const updatedReservations = storedReservations.map((reservation: Reservation) => 
      reservation.id === reservationId ? { ...reservation, status: 'completed' } : reservation
    );
    localStorage.setItem('niunamiga_reservations', JSON.stringify(updatedReservations));
    
    setReservations(prev => prev.map(reservation => 
      reservation.id === reservationId ? { ...reservation, status: 'completed' } : reservation
    ));
    
    toast({
      title: "Recogida completada",
      description: "¡Gracias por ayudar a reducir el desperdicio de comida!",
    });
  };

  const getStats = () => {
    const pending = reservations.filter(r => r.status === 'pending').length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const completed = reservations.filter(r => r.status === 'completed').length;
    
    return { pending, confirmed, completed, total: reservations.length };
  };

  const stats = getStats();

  if (!user || user.type !== 'individual') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Mis Reservas</h1>
          <p className="text-gray-600">Gestiona todas tus reservas de comida</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{stats.confirmed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations List */}
        <Card>
          <CardHeader>
            <CardTitle>Todas mis reservas</CardTitle>
            <CardDescription>
              Aquí puedes ver todas tus reservas y marcar como completadas las que ya recogiste
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes reservas aún</h3>
                <p className="text-gray-600 mb-6">
                  Ve al feed para encontrar comida disponible y hacer tu primera reserva
                </p>
                <Button 
                  onClick={() => navigate('/feed')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Ver Comida Disponible
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reservations.map((reservation) => (
                  <Card key={reservation.id} className="hover:shadow-lg transition-shadow border-green-200">
                    {reservation.listingImage && (
                      <div className="w-full h-32 overflow-hidden rounded-t-lg">
                        <img 
                          src={reservation.listingImage} 
                          alt={reservation.listingTitle}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg text-green-800 line-clamp-2">
                          {reservation.listingTitle}
                        </CardTitle>
                        {getStatusBadge(reservation.status)}
                      </div>
                      <Badge variant="outline" className="border-green-300 text-green-700 w-fit">
                        {reservation.category}
                      </Badge>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Porciones:</span>
                        <Badge className="bg-blue-500 hover:bg-blue-600">
                          {reservation.portionsReserved}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-green-600" />
                          {reservation.pickupAddress}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-green-600" />
                          Vence: {formatDate(reservation.expirationDate)}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-green-600" />
                          {reservation.providerName}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-green-600" />
                          Reservado: {formatDate(reservation.reservationDate)}
                        </div>
                      </div>

                      {getDaysUntilExpiration(reservation.expirationDate) < 0 && (
                        <div className="bg-red-50 p-2 rounded text-sm text-red-800">
                          ⚠️ Esta comida ya venció
                        </div>
                      )}

                      {reservation.status === 'confirmed' && (
                        <Button 
                          className="w-full bg-green-600 hover:bg-green-700 mt-4"
                          onClick={() => handleMarkCompleted(reservation.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Marcar como Recogido
                        </Button>
                      )}

                      {reservation.status === 'completed' && (
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                          <p className="text-sm text-green-800 font-medium">¡Recogida completada!</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MisReservas;
