import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FoodListing, Reservation, Message } from '@/types';
import { MapPin, Calendar, User, Image, Send, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface FoodDetailModalProps {
  listing: FoodListing | null;
  isOpen: boolean;
  onClose: () => void;
}

const FoodDetailModal = ({ listing, isOpen, onClose }: FoodDetailModalProps) => {
  const [showContact, setShowContact] = useState(false);
  const [message, setMessage] = useState('');
  const [portionsToReserve, setPortionsToReserve] = useState(1);
  const [messageSent, setMessageSent] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  if (!listing) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const availablePortions = listing.availablePortions || listing.totalPortions || 1;
  const totalPortions = listing.totalPortions || 1;

  const handleReserve = () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Por favor escribe un mensaje antes de reservar.",
        variant: "destructive"
      });
      return;
    }

    if (portionsToReserve > availablePortions) {
      toast({
        title: "Error",
        description: `Solo hay ${availablePortions} porciones disponibles.`,
        variant: "destructive"
      });
      return;
    }

    // Crear reserva
    const newReservation: Reservation = {
      id: Date.now().toString(),
      listingId: listing.id,
      listingTitle: listing.title,
      listingImage: listing.image,
      listingAddress: listing.address,
      reservedBy: user!.id,
      reservedByName: user!.name,
      providerId: listing.userId,
      providerName: listing.userName,
      portionsReserved: portionsToReserve,
      reservationDate: new Date().toISOString(),
      pickupAddress: listing.address,
      expirationDate: listing.expirationDate,
      status: 'pending',
      category: listing.category,
      createdAt: new Date().toISOString()
    };

    // Guardar reserva
    const storedReservations = JSON.parse(localStorage.getItem('niunamiga_reservations') || '[]');
    storedReservations.push(newReservation);
    localStorage.setItem('niunamiga_reservations', JSON.stringify(storedReservations));

    // Crear mensaje inmediatamente
    const newMessage: Message = {
      id: (Date.now() + 1).toString(), // +1 para evitar conflicto con ID de reserva
      reservationId: newReservation.id,
      senderId: user!.id,
      senderName: user!.name,
      receiverId: listing.userId,
      receiverName: listing.userName,
      content: message,
      timestamp: new Date().toISOString(),
      read: false
    };

    // Guardar mensaje
    const storedMessages = JSON.parse(localStorage.getItem('niunamiga_messages') || '[]');
    storedMessages.push(newMessage);
    localStorage.setItem('niunamiga_messages', JSON.stringify(storedMessages));

    // Actualizar las porciones disponibles del listing
    const storedListings = JSON.parse(localStorage.getItem('niunamiga_listings') || '[]');
    const updatedListings = storedListings.map((l: FoodListing) => {
      if (l.id === listing.id) {
        const newAvailablePortions = (l.availablePortions || l.totalPortions || 1) - portionsToReserve;
        return {
          ...l,
          availablePortions: newAvailablePortions,
          status: newAvailablePortions <= 0 ? 'reserved' : l.status
        };
      }
      return l;
    });
    localStorage.setItem('niunamiga_listings', JSON.stringify(updatedListings));

    setMessageSent(true);
    setMessage('');
    
    toast({
      title: "¡Reserva realizada!",
      description: `Has reservado ${portionsToReserve} porción(es). Tu mensaje fue enviado a ${listing.userName}.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-green-800 mb-2">
            {listing.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Food Image */}
          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            {listing.image ? (
              <img 
                src={listing.image} 
                alt={listing.title}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center text-gray-500">
                <Image className="w-16 h-16 mx-auto mb-2" />
                <p>Sin imagen disponible</p>
              </div>
            )}
          </div>

          {/* Status and Category */}
          <div className="flex justify-between items-center">
            <Badge variant="outline" className="border-green-300 text-green-700">
              {listing.category}
            </Badge>
            {getExpirationBadge(listing.expirationDate)}
          </div>

          {/* Portions Available */}
          {listing.totalPortions && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">Porciones disponibles</span>
                </div>
                <Badge className="bg-blue-500 hover:bg-blue-600">
                  {availablePortions} de {totalPortions}
                </Badge>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Descripción</h3>
            <p className="text-gray-600 leading-relaxed">{listing.description}</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-800 mb-3">Detalles</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium w-20">Cantidad:</span>
                    <span className="text-gray-600">{listing.quantity}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-green-600" />
                    <span className="font-medium">Vence:</span>
                    <span className="text-gray-600 ml-2">{formatDate(listing.expirationDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-800 mb-3">Ubicación</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 text-green-600 mt-0.5" />
                    <span className="text-gray-600">{listing.address}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-gray-600">{listing.userName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Section */}
          {availablePortions > 0 ? (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-800 mb-4">Reservar y contactar</h3>
              
              {!showContact ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    ¿Te interesa esta comida? Reserva las porciones que necesitas y contacta a {listing.userName}.
                  </p>
                  <Button 
                    onClick={() => setShowContact(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Reservar
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {!messageSent ? (
                    <>
                      {listing.totalPortions && listing.totalPortions > 1 && (
                        <div>
                          <Label className="text-sm font-medium">Porciones a reservar</Label>
                          <Input
                            type="number"
                            min="1"
                            max={availablePortions}
                            value={portionsToReserve}
                            onChange={(e) => setPortionsToReserve(parseInt(e.target.value) || 1)}
                            className="mt-1 border-green-200 focus:border-green-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Máximo {availablePortions} porciones disponibles
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <Label className="text-sm font-medium">Mensaje para {listing.userName}</Label>
                        <Textarea
                          placeholder="Hola! Me interesa reservar esta comida. ¿Podríamos coordinar la recogida? Estoy disponible..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="mt-1 min-h-[100px] border-green-200 focus:border-green-500"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleReserve}
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Reservar {listing.totalPortions && listing.totalPortions > 1 ? `${portionsToReserve} porción(es)` : ''}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setShowContact(false)}
                          className="border-green-300 hover:bg-green-50"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Send className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-green-800 mb-2">¡Reserva realizada!</h4>
                      <p className="text-green-700 mb-4">
                        Tu solicitud de reserva ha sido enviada a {listing.userName}. Te responderá pronto para coordinar la recogida.
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setMessageSent(false);
                          setShowContact(false);
                        }}
                        className="border-green-300 hover:bg-green-50"
                      >
                        Enviar otro mensaje
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="border-t pt-4 text-center">
              <div className="bg-gray-50 p-6 rounded-lg">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-700 mb-2">No hay porciones disponibles</h4>
                <p className="text-gray-600">
                  Todas las porciones de esta publicación ya han sido reservadas.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FoodDetailModal;
