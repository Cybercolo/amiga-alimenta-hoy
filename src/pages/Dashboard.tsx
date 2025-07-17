
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { FoodListing, Reservation, Message } from '@/types';
import { 
  Plus, Package, Clock, CheckCircle, MessageCircle, Send, 
  Calendar, MapPin, User, Users, TrendingUp, Edit, Trash2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [businessReservations, setBusinessReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
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

    // Load user's listings if business user
    if (user.type === 'business') {
      const storedListings = JSON.parse(localStorage.getItem('niunamiga_listings') || '[]');
      const userListings = storedListings.filter((listing: FoodListing) => listing.userId === user.id);
      setListings(userListings);

      // Load reservations for business listings
      const storedReservations = JSON.parse(localStorage.getItem('niunamiga_reservations') || '[]');
      const userListingIds = userListings.map((l: FoodListing) => l.id);
      const relatedReservations = storedReservations.filter((reservation: Reservation) => 
        userListingIds.includes(reservation.listingId)
      );
      setBusinessReservations(relatedReservations);
    }

    // Load user's reservations if regular user
    if (user.type === 'user') {
      const storedReservations = JSON.parse(localStorage.getItem('niunamiga_reservations') || '[]');
      const userReservations = storedReservations.filter((reservation: Reservation) => reservation.reservedBy === user.id);
      setReservations(userReservations);
    }
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
      case 'available':
        return <Badge className="bg-green-500 hover:bg-green-600">Disponible</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Reservado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL');
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

  const handleConfirmReservation = (reservationId: string) => {
    const storedReservations = JSON.parse(localStorage.getItem('niunamiga_reservations') || '[]');
    const updatedReservations = storedReservations.map((reservation: Reservation) => 
      reservation.id === reservationId ? { ...reservation, status: 'confirmed' } : reservation
    );
    localStorage.setItem('niunamiga_reservations', JSON.stringify(updatedReservations));
    
    setBusinessReservations(prev => prev.map(reservation => 
      reservation.id === reservationId ? { ...reservation, status: 'confirmed' } : reservation
    ));
    
    toast({
      title: "Reserva confirmada",
      description: "La reserva ha sido confirmada. El usuario podrá proceder con la recogida.",
    });
  };

  const handleDeleteListing = (listingId: string) => {
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

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedReservation) return;

    const message: Message = {
      id: Date.now().toString(),
      reservationId: selectedReservation.id,
      senderId: user!.id,
      senderName: user!.name,
      receiverId: selectedReservation.providerId || '',
      receiverName: selectedReservation.providerName,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    const storedMessages = JSON.parse(localStorage.getItem('niunamiga_messages') || '[]');
    storedMessages.push(message);
    localStorage.setItem('niunamiga_messages', JSON.stringify(storedMessages));

    setNewMessage('');
    setIsMessageDialogOpen(false);
    setSelectedReservation(null);

    toast({
      title: "Mensaje enviado",
      description: `Tu mensaje fue enviado a ${selectedReservation.providerName}`,
    });
  };

  const getUserStats = () => {
    if (user?.type === 'user') {
      const pending = reservations.filter(r => r.status === 'pending').length;
      const confirmed = reservations.filter(r => r.status === 'confirmed').length;
      const completed = reservations.filter(r => r.status === 'completed').length;
      return { pending, confirmed, completed, total: reservations.length };
    } else {
      const available = listings.filter(l => l.status === 'available').length;
      const reserved = listings.filter(l => l.status === 'reserved').length;
      const completed = listings.filter(l => l.status === 'completed').length;
      const pendingReservations = businessReservations.filter(r => r.status === 'pending').length;
      return { available, reserved, completed, total: listings.length, pendingReservations };
    }
  };

  const stats = getUserStats();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            {user.type === 'business' ? 'Dashboard Empresarial' : 'Mi Dashboard'}
          </h1>
          <p className="text-gray-600">
            {user.type === 'business' 
              ? 'Gestiona tus publicaciones de comida y reduce el desperdicio'
              : 'Gestiona tus reservas y actividad'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user.type === 'business' ? (
            <>
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
                  <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{businessReservations.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">{stats.pendingReservations}</div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue={user.type === 'business' ? 'listings' : 'reservations'} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            {user.type === 'business' ? (
              <>
                <TabsTrigger value="listings">Mis Publicaciones</TabsTrigger>
                <TabsTrigger value="reservations">Reservas Recibidas</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="reservations">Mis Reservas</TabsTrigger>
                <TabsTrigger value="activity">Actividad</TabsTrigger>
              </>
            )}
          </TabsList>

          {user.type === 'business' ? (
            <>
              {/* Business Listings Tab */}
              <TabsContent value="listings">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Mis Publicaciones</CardTitle>
                        <CardDescription>Gestiona todas tus publicaciones de comida</CardDescription>
                      </div>
                      <Button 
                        onClick={() => navigate('/publicar')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Publicación
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {listings.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes publicaciones aún</h3>
                        <p className="text-gray-600 mb-6">Comienza a publicar comida para reducir el desperdicio</p>
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
                              <TableHead>Porciones</TableHead>
                              <TableHead>Vencimiento</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {listings.map((listing) => (
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
                                <TableCell>
                                  {listing.totalPortions ? listing.availablePortions !== undefined ? `${listing.availablePortions}/${listing.totalPortions}` : listing.totalPortions : 'N/A'}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center text-sm">
                                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                    {formatDate(listing.expirationDate)}
                                  </div>
                                </TableCell>
                                <TableCell>{getStatusBadge(listing.status)}</TableCell>
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
                                      onClick={() => handleDeleteListing(listing.id)}
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
              </TabsContent>

              {/* Business Reservations Tab */}
              <TabsContent value="reservations">
                <Card>
                  <CardHeader>
                    <CardTitle>Reservas Recibidas</CardTitle>
                    <CardDescription>Gestiona las reservas de tus publicaciones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {businessReservations.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes reservas aún</h3>
                        <p className="text-gray-600">Las reservas aparecerán aquí cuando alguien reserve tu comida</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Publicación</TableHead>
                              <TableHead>Reservado por</TableHead>
                              <TableHead>Porciones</TableHead>
                              <TableHead>Estado</TableHead>
                              <TableHead>Fecha Reserva</TableHead>
                              <TableHead>Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {businessReservations.map((reservation) => (
                              <TableRow key={reservation.id}>
                                <TableCell className="font-medium">
                                  {reservation.listingTitle}
                                </TableCell>
                                <TableCell>{reservation.reservedByName}</TableCell>
                                <TableCell>
                                  <Badge className="bg-blue-500 hover:bg-blue-600">
                                    {reservation.portionsReserved}
                                  </Badge>
                                </TableCell>
                                <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                                <TableCell>
                                  <div className="text-sm text-gray-600">
                                    {formatDate(reservation.reservationDate)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {reservation.status === 'pending' && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleConfirmReservation(reservation.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Confirmar
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          ) : (
            <>
              {/* User Reservations Tab */}
              <TabsContent value="reservations">
                <Card>
                  <CardHeader>
                    <CardTitle>Mis Reservas</CardTitle>
                    <CardDescription>Gestiona todas tus reservas de comida</CardDescription>
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

                              <div className="flex gap-2 mt-4">
                                <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 border-green-300 hover:bg-green-50"
                                      onClick={() => setSelectedReservation(reservation)}
                                    >
                                      <MessageCircle className="w-4 h-4 mr-2" />
                                      Enviar Mensaje
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Enviar mensaje a {selectedReservation?.providerName}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <p className="text-sm text-gray-600 mb-2">
                                          Sobre: {selectedReservation?.listingTitle}
                                        </p>
                                        <Textarea
                                          placeholder="Escribe tu mensaje aquí..."
                                          value={newMessage}
                                          onChange={(e) => setNewMessage(e.target.value)}
                                          className="min-h-[100px] border-green-200 focus:border-green-500"
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <Button 
                                          onClick={handleSendMessage}
                                          disabled={!newMessage.trim()}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <Send className="w-4 h-4 mr-2" />
                                          Enviar
                                        </Button>
                                        <Button 
                                          variant="outline"
                                          onClick={() => {
                                            setIsMessageDialogOpen(false);
                                            setNewMessage('');
                                            setSelectedReservation(null);
                                          }}
                                        >
                                          Cancelar
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                {reservation.status === 'confirmed' && (
                                  <Button 
                                    size="sm"
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={() => handleMarkCompleted(reservation.id)}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Marcar Recogido
                                  </Button>
                                )}
                              </div>

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
              </TabsContent>

              {/* User Activity Tab */}
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>Historial de tus reservas y actividades</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reservations.length === 0 ? (
                        <p className="text-gray-600 text-center py-8">No hay actividad reciente</p>
                      ) : (
                        reservations.slice(0, 10).map((reservation) => (
                          <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium">{reservation.listingTitle}</p>
                              <p className="text-sm text-gray-600">
                                Reservado el {formatDate(reservation.reservationDate)}
                              </p>
                            </div>
                            {getStatusBadge(reservation.status)}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
