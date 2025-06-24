
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Users, Recycle, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-6">
            Ni Una Miga
          </h1>
          <p className="text-xl md:text-2xl text-green-700 mb-4 font-medium">
            Reduciendo el desperdicio de alimentos
          </p>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Conectamos personas, empresas y ONGs para compartir comida que de otro modo se desperdiciaría. 
            Juntos construimos comunidades más fuertes y sostenibles.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="border-green-600 text-green-700 hover:bg-green-50 px-8 py-4 text-lg">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/publicar">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                  Publicar Comida
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/feed">
                <Button variant="outline" size="lg" className="border-green-600 text-green-700 hover:bg-green-50 px-8 py-4 text-lg">
                  Ver Disponible
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            Nuestro Impacto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Recycle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">1/3</h3>
                <p className="text-gray-600">de toda la comida producida se desperdicia globalmente</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-yellow-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Gratis</h3>
                <p className="text-gray-600">Plataforma 100% gratuita para ayudar a tu comunidad</p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Juntos</h3>
                <p className="text-gray-600">Construyendo comunidades más fuertes y sostenibles</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-green-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
            ¿Cómo Funciona?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-green-800">
                1
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-4">Publica</h3>
              <p className="text-gray-600">
                ¿Tienes comida que no vas a usar? Publícala con una descripción, foto y ubicación.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-green-800">
                2
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-4">Conecta</h3>
              <p className="text-gray-600">
                Otros usuarios verán tu publicación y podrán contactarte para coordinar la entrega.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-green-800">
                3
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-4">Ayuda</h3>
              <p className="text-gray-600">
                Reduces el desperdicio y ayudas a alguien de tu comunidad. ¡Todos ganamos!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">
            Únete a la Lucha Contra el Desperdicio
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Cada comida compartida es un paso hacia un mundo más sostenible y una comunidad más unida.
          </p>
          {!user && (
            <Link to="/register">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-green-800 px-8 py-4 text-lg font-semibold">
                Comenzar Gratis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
