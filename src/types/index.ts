export type ViewMode = 'homemaker' | 'storeowner' | 'architecture';
export type LanguageMode = 'en' | 'hi';

export interface Product {
  id: string;
  item_code: string;
  item_name_en: string;
  item_name_hi: string;
  name: string;
  hindiName: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  inStock: boolean;
  keywords: string[];
  stockQty?: number;
  reorderLevel?: number;
  supplier?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface KiranaStore {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  radiusKm: number;
  rating: number;
  ordersCompleted: number;
  isOpen: boolean;
  khataAccepted: boolean;
}

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'dispatched' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  unit: string;
  quantity: number;
}

export interface Order {
  id: string;
  idempotencyKey: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'khata' | 'upi' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'added_to_khata';
  status: OrderStatus;
  orderType: 'standard' | 'voice_note' | 'photo_list' | 'subscription';
  createdAt: string;
  assignedDeliveryBoy?: string;
  audioNoteUrl?: string;
  photoListUrl?: string;
  idempotentRetryCount?: number;
}

export interface KhataEntry {
  id: string;
  orderId?: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit'; // debit = customer bought on udhar, credit = customer paid bill
  balanceAfter: number;
  itemsSummary?: string;
}

export interface KhataLedger {
  customerId: string;
  customerName: string;
  customerPhone: string;
  totalBalance: number; // positive means customer owes store
  creditLimit: number;
  lastPaymentDate?: string;
  entries: KhataEntry[];
}

export interface Subscription {
  id: string;
  product: Product;
  quantity: number;
  frequency: 'daily' | 'alternate' | 'weekly';
  startDate: string;
  status: 'active' | 'paused';
  nextDeliveryDate: string;
  timeSlot: '6:30 AM - 7:30 AM' | '7:30 AM - 8:30 AM' | '5:00 PM - 6:00 PM';
}

export interface DeliveryBoy {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  activeOrders: number;
  avatar: string;
  status: 'available' | 'on_delivery' | 'offline';
}

export interface IdempotencyLog {
  idempotencyKey: string;
  timestamp: string;
  status: 'cached' | 'processing' | 'new_creation';
  orderId: string;
  requestBody: any;
  responsePayload: any;
}
