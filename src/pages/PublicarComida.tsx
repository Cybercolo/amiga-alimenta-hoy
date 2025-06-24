
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FoodListing } from '@/types';
import { Loader2, Camera } from 'lucide-react';

const PublicarComida = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    quantity: '',
    expirationDate: '',
    address: '',
    latitude: '',
    longitude: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.quantity || !formData.expirationDate || !formData.address) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newListing: FoodListing = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        quantity: formData.quantity,
        expirationDate: formData.expirationDate,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        userId: user.id,
        userName: user.name,
        createdAt: new Date().toISOString(),
        status: 'available'
      };

      // Store in localStorage for demo
      const existingListings = JSON.parse(localStorage.getItem('niunamiga_listings') || '[]');
      existingListings.unshift(newListing);
      localStorage.setItem('niunamiga_listings', JSON.stringify(existingListings));

      toast({
        title: "¡Publicación creada!",
        description: "Tu comida ha sido publicada exitosamente",
      });

      navigate('/feed');
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la publicación. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Frutas y Verduras',
    'Panadería',
    'Carnes y Pescados',
    'Lácteos',
    'Comida Preparada',
    'Conservas',
    'Otros'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-800">Publicar Comida</CardTitle>
            <CardDescription>
              Comparte comida que de otro modo se desperdiciaría y ayuda a tu comunidad
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ej. Verduras frescas de mi huerto"
                  required
                  className="border-green-200 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe qué comida estás compartiendo, su estado, etc."
                  rows={4}
                  required
                  className="border-green-200 focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="border-green-200 focus:border-green-500">
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad *</Label>
                  <Input
                    id="quantity"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="ej. 2 kg, 5 porciones"
                    required
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationDate">Fecha de Vencimiento *</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  required
                  className="border-green-200 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Dirección donde se puede recoger la comida"
                  required
                  className="border-green-200 focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitud (opcional)</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    placeholder="-33.4489"
                    className="border-green-200 focus:border-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitud (opcional)</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    placeholder="-70.6693"
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Foto (próximamente)</Label>
                <div className="border-2 border-dashed border-green-200 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-500">La función de fotos estará disponible pronto</p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  'Publicar Comida'
                )}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Recuerda:</strong> Al publicar comida, te comprometes a coordinar la entrega con quien la solicite. 
                Mantén siempre la comunicación respetuosa y asegúrate de que la comida esté en buen estado.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicarComida;
