
import React, { useEffect, useRef, useState } from 'react';
import { FoodListing } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Eye, Search } from 'lucide-react';

interface GoogleMapViewProps {
  listings: FoodListing[];
  onListingSelect: (listing: FoodListing) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMapView = ({ listings, onListingSelect }: GoogleMapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [googleApiKey, setGoogleApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const markersRef = useRef<any[]>([]);

  const loadGoogleMapsScript = () => {
    if (window.google) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsMapLoaded(true);
      initializeMap();
    };
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: -33.4489, lng: -70.6693 }, // Santiago, Chile
      zoom: 11,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
    });

    setMap(mapInstance);
    addMarkersToMap(mapInstance);
  };

  const addMarkersToMap = (mapInstance: any) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    listings.forEach((listing) => {
      if (listing.coordinates) {
        const marker = new window.google.maps.Marker({
          position: { lat: listing.coordinates.lat, lng: listing.coordinates.lng },
          map: mapInstance,
          title: listing.title,
          icon: {
            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5QzkuNSA3LjYyIDEwLjYyIDYuNSAxMiA2LjVDMTMuMzggNi41IDE0LjUgNy42MiAxNC41IDlDMTQuNSAxMC4zOCAxMy4zOCAxMS41IDEyIDExLjVaIiBmaWxsPSIjMTZhMzRhIi8+Cjwvc3ZnPgo=',
            scaledSize: new window.google.maps.Size(30, 30),
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #16a34a;">${listing.title}</h3>
              <p style="margin: 0 0 8px 0; font-size: 14px;">${listing.description.substring(0, 100)}...</p>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">📍 ${listing.address}</p>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">👤 ${listing.userName}</p>
              <button 
                onclick="window.selectListing('${listing.id}')" 
                style="background: #16a34a; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;"
              >
                Ver Detalles
              </button>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker);
        });

        markersRef.current.push(marker);
      }
    });

    // Global function to handle listing selection from info window
    (window as any).selectListing = (listingId: string) => {
      const listing = listings.find(l => l.id === listingId);
      if (listing) {
        onListingSelect(listing);
      }
    };
  };

  const searchLocationOnMap = () => {
    if (!map || !searchLocation.trim()) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchLocation }, (results: any, status: any) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        map.setZoom(15);

        // Add a temporary marker for the searched location
        const searchMarker = new window.google.maps.Marker({
          position: location,
          map: map,
          title: 'Ubicación buscada',
          icon: {
            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDlDNSAxNC4yNSAxMiAyMiAxMiAyMkMxMiAyMiAxOSAxNC4yNSAxOSA5QzE5IDUuMTMgMTUuODcgMiAxMiAyWk0xMiAxMS41QzEwLjYyIDExLjUgOS41IDEwLjM4IDkuNSA5QzkuNSA3LjYyIDEwLjYyIDYuNSAxMiA2LjVDMTMuMzggNi41IDE0LjUgNy42MiAxNC41IDlDMTQuNSAxMC4zOCAxMy4zOCAxMS41IDEyIDExLjVaIiBmaWxsPSIjZGM5MzQ0Ii8+Cjwvc3ZnPgo=',
            scaledSize: new window.google.maps.Size(30, 30),
          },
        });

        // Remove the search marker after 3 seconds
        setTimeout(() => {
          searchMarker.setMap(null);
        }, 3000);
      }
    });
  };

  useEffect(() => {
    if (googleApiKey && map) {
      addMarkersToMap(map);
    }
  }, [listings, map]);

  if (showApiInput) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Configurar Google Maps</h3>
        <p className="text-gray-600 mb-4">
          Para mostrar el mapa interactivo, necesitas agregar tu API key de Google Maps.
          <br />
          <a 
            href="https://console.cloud.google.com/apis/credentials" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            Obtén tu API key aquí
          </a>
        </p>
        <div className="max-w-md mx-auto space-y-3">
          <Input
            placeholder="Pega tu Google Maps API key aquí"
            value={googleApiKey}
            onChange={(e) => setGoogleApiKey(e.target.value)}
            className="border-green-200 focus:border-green-500"
          />
          <Button 
            onClick={() => {
              if (googleApiKey) {
                setShowApiInput(false);
                loadGoogleMapsScript();
              }
            }}
            disabled={!googleApiKey}
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
        <h3 className="font-semibold text-green-800 mb-2">Mapa Interactivo de Comida Disponible</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Buscar ubicación (ej: Las Condes, Santiago)"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchLocationOnMap()}
              className="border-green-200 focus:border-green-500"
            />
          </div>
          <Button 
            onClick={searchLocationOnMap}
            disabled={!searchLocation.trim()}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-green-600 mt-2">
          Haz clic en los marcadores verdes para ver detalles de la comida disponible
        </p>
      </div>
      <div ref={mapRef} className="w-full h-96" />
    </div>
  );
};

export default GoogleMapView;
