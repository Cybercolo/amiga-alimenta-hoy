
export interface User {
  id: string;
  email: string;
  name: string;
  type: 'individual' | 'business' | 'ngo';
}

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: string;
  totalPortions?: number; // Nueva propiedad para cantidad numérica
  availablePortions?: number; // Porciones disponibles
  expirationDate: string;
  address: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  userId: string;
  userName: string;
  createdAt: string;
  status: 'available' | 'reserved' | 'completed';
  dietaryTags?: string[];
}

export interface Reservation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  reservedBy: string;
  reservedByName: string;
  portionsReserved: number;
  reservationDate: string;
  pickupAddress: string;
  expirationDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  providerName: string;
  category: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, type: User['type']) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
