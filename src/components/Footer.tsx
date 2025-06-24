
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-green-50 border-t border-green-100 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">NM</span>
              </div>
              <span className="text-xl font-bold text-green-700">Ni Una Miga</span>
            </div>
            <p className="text-gray-600 text-sm">
              Reduciendo el desperdicio de alimentos y ayudando a nuestras comunidades en toda Latinoamérica.
            </p>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-green-700">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/niunamigaapp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/niunamigaapp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/niunamigaapp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-green-700">Contacto</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>Plataforma gratuita y social</p>
              <p>Juntos contra el desperdicio</p>
              <p className="text-green-600 font-medium">@niunamigaapp</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-green-200 text-center text-sm text-gray-600">
          <p>&copy; 2024 Ni Una Miga. Plataforma gratuita para reducir el desperdicio de alimentos.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
