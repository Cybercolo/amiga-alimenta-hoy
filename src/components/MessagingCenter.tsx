
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Message, Reservation } from '@/types';
import { Send, MessageCircle, User, Calendar, Clock, MapPin } from 'lucide-react';
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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-CL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (reservations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No hay conversaciones</h3>
            <p className="text-gray-600 text-lg">
              Las conversaciones aparecerán aquí cuando hagas o recibas reservas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Centro de Mensajes</h1>
          <p className="text-gray-600">Coordina la entrega de comida con otros usuarios</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Lista de Conversaciones */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-green-800 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Conversaciones ({reservations.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-0">
                <div className="space-y-1">
                  {reservations.map((reservation) => {
                    const reservationMessages = getReservationMessages(reservation.id);
                    const lastMessage = reservationMessages[reservationMessages.length - 1];
                    const unreadCount = reservationMessages.filter(msg => 
                      !msg.read && msg.senderId !== user?.id
                    ).length;

                    return (
                      <div
                        key={reservation.id}
                        className={`p-4 cursor-pointer hover:bg-green-50 border-b transition-colors ${
                          selectedReservation === reservation.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                        }`}
                        onClick={() => setSelectedReservation(reservation.id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm text-gray-800 line-clamp-2 pr-2">
                            {reservation.listingTitle}
                          </h4>
                          {unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 mb-3">
                          <div className="flex items-center text-xs text-gray-600">
                            <User className="w-3 h-3 mr-1" />
                            <span className="font-medium">
                              {reservation.reservedBy === user?.id ? reservation.providerName : reservation.reservedByName}
                            </span>
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            Reservado: {formatDate(reservation.createdAt)}
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate">{reservation.listingAddress}</span>
                          </div>
                        </div>

                        {lastMessage && (
                          <div className="bg-gray-50 p-2 rounded text-xs">
                            <p className="text-gray-600 line-clamp-2 mb-1">
                              <span className="font-medium">
                                {lastMessage.senderId === user?.id ? 'Tú: ' : `${lastMessage.senderName}: `}
                              </span>
                              {lastMessage.content}
                            </p>
                            <div className="flex items-center text-gray-400">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTime(lastMessage.timestamp)}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Área de Chat */}
          <div className="lg:col-span-2">
            {selectedReservation ? (
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3 border-b">
                  {(() => {
                    const reservation = reservations.find(r => r.id === selectedReservation);
                    return reservation ? (
                      <div>
                        <CardTitle className="text-green-800 text-xl mb-2">
                          {reservation.listingTitle}
                        </CardTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            <span>Con: {reservation.reservedBy === user?.id ? reservation.providerName : reservation.reservedByName}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Reservado: {formatDate(reservation.createdAt)}</span>
                          </div>
                          <div className="flex items-center text-gray-600 md:col-span-2">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{reservation.listingAddress}</span>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-4">
                  {/* Mensajes */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                    {getReservationMessages(selectedReservation).map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] lg:max-w-md`}>
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-sm ${
                              message.senderId === user?.id
                                ? 'bg-green-500 text-white rounded-br-md'
                                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                          <p className={`text-xs mt-1 px-1 ${
                            message.senderId === user?.id ? 'text-right text-gray-500' : 'text-left text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input de nuevo mensaje */}
                  <div className="border-t pt-4">
                    <div className="flex gap-3">
                      <Textarea
                        placeholder="Escribe tu mensaje para coordinar la entrega..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 min-h-[50px] max-h-[120px] border-green-200 focus:border-green-500 resize-none"
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
                        className="bg-green-600 hover:bg-green-700 self-end px-6"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Presiona Enter para enviar, Shift+Enter para nueva línea
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500 p-8">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Selecciona una conversación</h3>
                  <p>Elige una reserva de la lista para comenzar a chatear y coordinar la entrega</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingCenter;
