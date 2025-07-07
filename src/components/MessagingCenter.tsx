
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Message, Reservation } from '@/types';
import { Send, MessageCircle, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MessagingCenter = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
    loadReservations();
  }, []);

  const loadMessages = () => {
    const storedMessages = JSON.parse(localStorage.getItem('niunamiga_messages') || '[]');
    const userMessages = storedMessages.filter((msg: Message) => 
      msg.senderId === user?.id || msg.receiverId === user?.id
    );
    setMessages(userMessages);
  };

  const loadReservations = () => {
    const storedReservations = JSON.parse(localStorage.getItem('niunamiga_reservations') || '[]');
    const userReservations = storedReservations.filter((res: Reservation) => 
      res.reservedBy === user?.id || res.providerId === user?.id
    );
    setReservations(userReservations);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedReservation) return;

    const reservation = reservations.find(r => r.id === selectedReservation);
    if (!reservation) return;

    const receiverId = reservation.reservedBy === user?.id ? reservation.providerId : reservation.reservedBy;
    const receiverName = reservation.reservedBy === user?.id ? reservation.providerName : reservation.reservedByName;

    const message: Message = {
      id: Date.now().toString(),
      reservationId: selectedReservation,
      senderId: user!.id,
      senderName: user!.name,
      receiverId: receiverId || '',
      receiverName: receiverName || '',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };

    const storedMessages = JSON.parse(localStorage.getItem('niunamiga_messages') || '[]');
    storedMessages.push(message);
    localStorage.setItem('niunamiga_messages', JSON.stringify(storedMessages));

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    toast({
      title: "Mensaje enviado",
      description: `Tu mensaje fue enviado a ${receiverName}`,
    });
  };

  const getReservationMessages = (reservationId: string) => {
    return messages.filter(msg => msg.reservationId === reservationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CL');
  };

  if (reservations.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No hay conversaciones</h3>
        <p className="text-gray-600">
          Las conversaciones aparecerán aquí cuando hagas o recibas reservas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Reservas/Conversaciones */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">Conversaciones</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {reservations.map((reservation) => {
                  const reservationMessages = getReservationMessages(reservation.id);
                  const lastMessage = reservationMessages[reservationMessages.length - 1];
                  const unreadCount = reservationMessages.filter(msg => 
                    !msg.read && msg.senderId !== user?.id
                  ).length;

                  return (
                    <div
                      key={reservation.id}
                      className={`p-4 cursor-pointer hover:bg-green-50 border-b ${
                        selectedReservation === reservation.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                      }`}
                      onClick={() => setSelectedReservation(reservation.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm text-gray-800 line-clamp-2">
                          {reservation.listingTitle}
                        </h4>
                        {unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-600 mb-1">
                        <User className="w-3 h-3 mr-1" />
                        {reservation.reservedBy === user?.id ? reservation.providerName : reservation.reservedByName}
                      </div>
                      {lastMessage && (
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat */}
        <div className="lg:col-span-2">
          {selectedReservation ? (
            <Card className="h-[500px] flex flex-col">
              <CardHeader className="pb-3">
                {(() => {
                  const reservation = reservations.find(r => r.id === selectedReservation);
                  return reservation ? (
                    <div>
                      <CardTitle className="text-green-800 text-lg">
                        {reservation.listingTitle}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <User className="w-4 h-4 mr-1" />
                        Conversación con {reservation.reservedBy === user?.id ? reservation.providerName : reservation.reservedByName}
                      </div>
                    </div>
                  ) : null;
                })()}
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-4">
                {/* Mensajes */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {getReservationMessages(selectedReservation).map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === user?.id
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === user?.id ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {formatDate(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input de nuevo mensaje */}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Escribe tu mensaje..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 min-h-[60px] border-green-200 focus:border-green-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-green-600 hover:bg-green-700 self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[500px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-16 h-16 mx-auto mb-4" />
                <p>Selecciona una conversación para comenzar a chatear</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagingCenter;
