
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FoodListing } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Eye } from 'lucide-react';

interface MapViewProps {
  listings: FoodListing[];
  onListingSelect: (listing: FoodListing) => void;
}

const MapView = ({ listings, onListingSelect }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-70.6693, -33.4489], // Santiago, Chile
      zoom: 11
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each listing
    listings.forEach((listing) => {
      if (listing.coordinates) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5QzkuNSA3LjYyIDEwLjYyIDYuNSAxMiA2LjVDMTMuMzggNi41IDE0LjUgNy42MiAxNC41IDlDMTQuNSAxMC4zOCAxMy4zOCAxMS41IDEyIDExLjVaIiBmaWxsPSIjMTZhMzRhIi8+Cjwvc3ZnPgo=)';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundSize = 'cover';
        el.style.cursor = 'pointer';

        el.addEventListener('click', () => {
          onListingSelect(listing);
        });

        new mapboxgl.Marker(el)
          .setLngLat([listing.coordinates.lng, listing.coordinates.lat])
          .addTo(map.current!);
      }
    });
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap();
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, listings]);

  if (showTokenInput) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Configurar Mapa</h3>
        <p className="text-gray-600 mb-4">
          Para mostrar el mapa, necesitas agregar tu token público de Mapbox.
          <br />
          <a 
            href="https://mapbox.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            Obtén tu token aquí
          </a>
        </p>
        <div className="max-w-md mx-auto space-y-3">
          <Input
            placeholder="Pega tu token público de Mapbox aquí"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="border-green-200 focus:border-green-500"
          />
          <Button 
            onClick={() => setShowTokenInput(false)}
            disabled={!mapboxToken}
            className="bg-green-600 hover:bg-green-700"
          >
            <Eye className="w-4 h-4 mr-2" />
            Mostrar Mapa
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 bg-green-50 border-b border-green-200">
        <h3 className="font-semibold text-green-800">Mapa de Comida Disponible</h3>
        <p className="text-sm text-green-600">Haz clic en los marcadores para ver detalles</p>
      </div>
      <div ref={mapContainer} className="w-full h-96" />
    </div>
  );
};

export default MapView;
