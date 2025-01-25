export interface MenuItem {
  id: string;
  name: string;
  category: 'main' | 'side' | 'dessert' | 'beverage';
  price: number;
  available: boolean;
  ingredients: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  lastRestocked: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'chef' | 'server' | 'cashier' | 'manager';
  shift: 'morning' | 'afternoon' | 'evening';
  schedule: string[];
}

export interface Order {
  id: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  totalAmount: number;
  timestamp: string;
}