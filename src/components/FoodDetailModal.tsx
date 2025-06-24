
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FoodListing } from '@/types';
import { MapPin, Calendar, User, Phone, Mail, MessageCircle, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FoodDetailModalProps {
  listing: FoodListing | null;
  isOpen: boolean;
  onClose: () => void;
}

const FoodDetailModal = ({ listing, isOpen, onClose }: FoodDetailModalProps) => {
  const [showContact, setShowContact] = useState(false);
  const { toast } = useToast();

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

  const handleContactAction = (type: string) => {
    setShowContact(true);
    toast({
      title: "¡Genial!",
      description: `En una versión completa, aquí se ${type === 'phone' ? 'mostraría el teléfono' : type === 'email' ? 'abriría el correo' : 'iniciaría el chat'} con ${listing.userName}.`,
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
          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-4">Contactar para coordinar recogida</h3>
            
            {!showContact ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  ¿Te interesa esta comida? Contacta con {listing.userName} para coordinar la recogida.
                </p>
                <Button 
                  onClick={() => setShowContact(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Ver opciones de contacto
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-gray-600 mb-4">
                  Elige cómo quieres contactar con {listing.userName}:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => handleContactAction('phone')}
                    className="flex items-center space-x-2 border-green-300 hover:bg-green-50"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Llamar</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleContactAction('email')}
                    className="flex items-center space-x-2 border-green-300 hover:bg-green-50"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleContactAction('message')}
                    className="flex items-center space-x-2 border-green-300 hover:bg-green-50"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Mensaje</span>
                  </Button>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Recordatorio:</strong> Coordina la hora y lugar de recogida. 
                    Sé respetuoso con los horarios y confirma tu asistencia.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FoodDetailModal;
