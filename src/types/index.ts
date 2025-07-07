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
  image?: string;
  dietaryTags?: string[];
  userId: string;
  userName: string;
  createdAt: string;
  status: 'available' | 'reserved' | 'completed';
}

export interface Reservation {
  id: string;
  listingId: string;
  reservedBy: string;
  portionsReserved: number;
  reservationDate: string;
  pickupAddress: string;
  expirationDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
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

export interface Coordinates {
  lat: number;
  lng: number;
}

// Update FoodListing to include coordinates
export interface FoodListing {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: string;
  expirationDate: string;
  address: string;
  coordinates?: Coordinates;
  image?: string;
  dietaryTags?: string[];
  userId: string;
  userName: string;
  createdAt: string;
  status: 'available' | 'reserved' | 'completed';
  totalPortions?: number;
  availablePortions?: number;
  portionSize?: string;
}

// Update Reservation to include providerId and providerName
export interface Reservation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage?: string;
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
}
