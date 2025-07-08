export interface User {
  id: string;
  name: string;
  email: string;
  type: 'user' | 'business';
}

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: string;
  expirationDate: string;
  address: string;
  coordinates: { lat: number; lng: number };
  image?: string;
  dietaryTags?: string[];
  userId: string;
  userName: string;
  createdAt: string;
  status: 'available' | 'reserved' | 'expired';
  totalPortions?: number;
  availablePortions?: number;
  portionSize?: string;
}

export interface Reservation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
  listingAddress: string; // Added this property
  reservedBy: string;
  reservedByName: string;
  providerId?: string;
  providerName: string;
  portionsReserved: number;
  reservationDate: string;
  pickupAddress: string;
  expirationDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  category: string;
  createdAt: string; // Added this property
}

export interface Message {
  id: string;
  reservationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}
