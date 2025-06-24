
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

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, type: User['type']) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
