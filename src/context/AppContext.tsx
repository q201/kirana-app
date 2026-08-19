import React, { createContext, useContext, useState } from 'react';
import type {
  ViewMode,
  LanguageMode,
  Product,
  CartItem,
  KiranaStore,
  Order,
  KhataLedger,
  Subscription,
  DeliveryBoy,
  OrderStatus,
  IdempotencyLog
} from '../types';
import {
  INITIAL_PRODUCTS,
  MOCK_STORES,
  INITIAL_KHATA_LEDGER,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_DELIVERY_BOYS,
  INITIAL_ORDERS
} from '../data/mockData';
import { idempotencyEngine } from '../utils/idempotency';
import { routeUserToStores, type GeofenceResult } from '../utils/geofence';

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getStoredCustomerSession, saveCustomerSession } from '../lib/supabaseAuth';

interface AppContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  
  languageMode: LanguageMode;
  setLanguageMode: (lang: LanguageMode) => void;

  // Customer Registration Profile
  userProfile: { name: string; phone: string; address: string; houseNo: string };
  setUserProfile: (profile: { name: string; phone: string; address: string; houseNo: string }) => void;

  // Supabase Status
  isSupabaseConnected: boolean;
  
  // User Location & Geofence
  userLat: number;
  userLng: number;
  setUserLocation: (lat: number, lng: number) => void;
  geofenceResults: GeofenceResult[];
  activeStore: KiranaStore;
  setActiveStore: (store: KiranaStore) => void;
  
  // Catalog & Cart
  products: Product[];
  updateProductStock: (productId: string, newQty: number) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;

  // Orders
  orders: Order[];
  placeOrder: (
    paymentMethod: 'khata' | 'upi' | 'cod',
    orderType?: 'standard' | 'voice_note' | 'photo_list' | 'subscription',
    simulateDrop?: boolean,
    customKey?: string
  ) => { success: boolean; isCached?: boolean; error?: string; order?: Order };
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  assignDeliveryBoy: (orderId: string, deliveryBoyId: string) => void;

  // Digital Khata Ledger
  khata: KhataLedger;
  makeKhataPayment: (amount: number, description?: string) => void;
  updateCreditLimit: (newLimit: number) => void;

  // Subscriptions
  subscriptions: Subscription[];
  addSubscription: (product: Product, quantity: number, frequency: 'daily' | 'alternate' | 'weekly', timeSlot: any) => void;
  toggleSubscriptionStatus: (subId: string) => void;

  // Delivery Boys
  deliveryBoys: DeliveryBoy[];

  // Idempotency Logs & Network Simulation
  idempotencyLogs: IdempotencyLog[];
  simulateNetworkDrop: boolean;
  setSimulateNetworkDrop: (val: boolean) => void;

  // Thermal Receipt Modal State
  selectedReceiptOrder: Order | null;
  setSelectedReceiptOrder: (order: Order | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('homemaker');
  const [languageMode, setLanguageMode] = useState<LanguageMode>('en');
  
  // Sarita Vihar, Pocket B Coordinates (Default)
  const [userLat, setUserLat] = useState<number>(28.5292);
  const [userLng, setUserLng] = useState<number>(77.2910);

  const [userProfile, setUserProfileState] = useState<{ name: string; phone: string; address: string; houseNo: string }>(
    () => {
      const stored = getStoredCustomerSession();
      if (stored) {
        return {
          name: stored.name,
          phone: stored.phone,
          address: stored.address,
          houseNo: stored.houseNo
        };
      }
      return {
        name: 'Guest Homemaker',
        phone: '',
        address: '',
        houseNo: ''
      };
    }
  );

  const setUserProfile = (profile: { name: string; phone: string; address: string; houseNo: string }) => {
    setUserProfileState(profile);
    saveCustomerSession({
      id: 'cust_' + Math.random().toString(36).substring(2, 8),
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
      houseNo: profile.houseNo
    });
  };
  
  const [products, setProducts] = useState<Product[]>(isSupabaseConfigured() ? [] : INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stores] = useState<KiranaStore[]>(MOCK_STORES);
  const [activeStore, setActiveStore] = useState<KiranaStore>(MOCK_STORES[0]);
  
  const [orders, setOrders] = useState<Order[]>(isSupabaseConfigured() ? [] : INITIAL_ORDERS);
  const [khata, setKhata] = useState<KhataLedger>(
    isSupabaseConfigured()
      ? {
          customerId: 'cust_user',
          customerName: userProfile?.name || 'Customer Account',
          customerPhone: userProfile?.phone || '',
          creditLimit: 5000,
          totalBalance: 0,
          entries: []
        }
      : INITIAL_KHATA_LEDGER
  );
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>(INITIAL_DELIVERY_BOYS);
  
  const [simulateNetworkDrop, setSimulateNetworkDrop] = useState<boolean>(false);
  const [idempotencyLogs, setIdempotencyLogs] = useState<IdempotencyLog[]>([]);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(isSupabaseConfigured());

  // Fetch 100% dynamic data directly from Supabase tables
  React.useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchSupabaseData = async () => {
      try {
        const { data: prodsData, error: prodsErr } = await supabase.from('products').select('*');
        if (prodsErr) console.error('Supabase products error:', prodsErr);
        if (prodsData) {
          const mappedProds: Product[] = prodsData.map(p => ({
            id: p.id,
            item_code: p.item_code,
            item_name_en: p.item_name_en,
            item_name_hi: p.item_name_hi,
            name: p.name,
            hindiName: p.hindi_name,
            category: p.category,
            price: Number(p.price),
            unit: p.unit,
            image: p.image,
            inStock: p.in_stock,
            keywords: p.keywords || [],
            stockQty: p.stock_qty,
            reorderLevel: p.reorder_level,
            supplier: p.supplier
          }));
          setProducts(mappedProds);
        }

        const { data: ordersData, error: ordersErr } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (ordersErr) console.error('Supabase orders error:', ordersErr);
        if (ordersData) {
          const mappedOrders: Order[] = ordersData.map(o => ({
            id: o.id,
            idempotencyKey: o.idempotency_key,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            address: o.address,
            items: o.items,
            totalAmount: Number(o.total_amount),
            paymentMethod: o.payment_method,
            paymentStatus: o.payment_status,
            status: o.status,
            orderType: o.order_type,
            createdAt: new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            assignedDeliveryBoy: o.assigned_delivery_boy
          }));
          setOrders(mappedOrders);
        }

        const { data: khataData, error: khataErr } = await supabase.from('khata_entries').select('*').order('created_at', { ascending: false });
        if (khataErr) console.error('Supabase khata_entries error:', khataErr);
        if (khataData) {
          const mappedEntries = khataData.map(k => ({
            id: k.id,
            orderId: k.order_id,
            date: k.date,
            description: k.description,
            amount: Number(k.amount),
            type: k.type as 'debit' | 'credit',
            balanceAfter: Number(k.balance_after),
            itemsSummary: k.items_summary
          }));
          const totalBal = mappedEntries.length > 0 ? mappedEntries[0].balanceAfter : 0;
          setKhata(prev => ({
            ...prev,
            totalBalance: totalBal,
            entries: mappedEntries
          }));
        }

        setIsSupabaseConnected(true);
      } catch (err) {
        console.error('Supabase dynamic fetch error:', err);
      }
    };

    fetchSupabaseData();
  }, []);

  // Compute geofence routing
  const geofenceResults = routeUserToStores(userLat, userLng, stores);

  const setUserLocation = (lat: number, lng: number) => {
    setUserLat(lat);
    setUserLng(lng);
  };

  const updateProductStock = (productId: string, newQty: number) => {
    const qty = Math.max(0, newQty);
    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          return { ...p, stockQty: qty, inStock: qty > 0 };
        }
        return p;
      })
    );

    if (isSupabaseConfigured()) {
      supabase
        .from('products')
        .update({ stock_qty: qty, in_stock: qty > 0 })
        .eq('id', productId)
        .then(({ error }) => {
          if (error) console.error('Supabase stock update error:', error);
        });
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Place order with Idempotency simulation
  const placeOrder = (
    paymentMethod: 'khata' | 'upi' | 'cod',
    orderType: 'standard' | 'voice_note' | 'photo_list' | 'subscription' = 'standard',
    simulateDrop: boolean = simulateNetworkDrop,
    customKey?: string
  ) => {
    const key = customKey || idempotencyEngine.generateKey();
    const orderItems = cart.map(item => ({
      productId: item.product.id,
      productName: languageMode === 'hi' ? item.product.item_name_hi : item.product.item_name_en,
      price: item.product.price,
      unit: item.product.unit,
      quantity: item.quantity
    }));

    const result = idempotencyEngine.processOrderRequest(
      key,
      {
        customerName: userProfile.name,
        customerPhone: userProfile.phone,
        address: `${userProfile.houseNo}, ${userProfile.address}`,
        items: orderItems,
        totalAmount: cartTotal,
        paymentMethod,
        orderType
      },
      simulateDrop
    );

    setIdempotencyLogs([...idempotencyEngine.getLogs()]);

    if (result.success && result.order) {
      if (!result.isCached) {
        setOrders(prev => [result.order!, ...prev]);

        // Auto-decrement inventory stock quantities
        orderItems.forEach(item => {
          setProducts(prevProds =>
            prevProds.map(p => {
              if (p.id === item.productId && p.stockQty !== undefined) {
                const newStock = Math.max(0, p.stockQty - item.quantity);
                return { ...p, stockQty: newStock, inStock: newStock > 0 };
              }
              return p;
            })
          );
        });

        // If paying on Khata, create ledger debit entry
        if (paymentMethod === 'khata') {
          const newBalance = khata.totalBalance + result.order.totalAmount;
          const newEntry = {
            id: 'kh-' + Date.now(),
            orderId: result.order.id,
            date: new Date().toISOString().split('T')[0],
            description: `${orderType.replace('_', ' ').toUpperCase()} Order (${result.order.id})`,
            amount: result.order.totalAmount,
            type: 'debit' as const,
            balanceAfter: newBalance,
            itemsSummary: orderItems.map(i => `${i.productName} x${i.quantity}`).join(', ')
          };

          setKhata(prev => ({
            ...prev,
            totalBalance: newBalance,
            entries: [newEntry, ...prev.entries]
          }));
        }

        // Sync order to Supabase live DB
        supabase.from('orders').insert([{
          id: result.order.id,
          idempotency_key: result.order.idempotencyKey,
          customer_name: userProfile.name,
          customer_phone: userProfile.phone,
          address: `${userProfile.houseNo}, ${userProfile.address}`,
          items: orderItems,
          total_amount: result.order.totalAmount,
          payment_method: paymentMethod,
          payment_status: paymentMethod === 'khata' ? 'added_to_khata' : 'paid',
          status: 'pending',
          order_type: orderType,
          assigned_delivery_boy: 'db-1'
        }]).then(({ data, error }) => {
          if (error) {
            console.error('Supabase Order Insert Error:', error);
          } else {
            console.log('Successfully inserted order to Supabase live DB:', result.order!.id);
          }
        });

        if (paymentMethod === 'khata') {
          supabase.from('khata_entries').insert([{
            id: 'kh-' + Date.now(),
            customer_id: 'cust_42',
            customer_name: userProfile.name,
            customer_phone: userProfile.phone,
            order_id: result.order.id,
            date: new Date().toISOString().split('T')[0],
            description: `${orderType.replace('_', ' ').toUpperCase()} Order (${result.order.id})`,
            amount: result.order.totalAmount,
            type: 'debit',
            balance_after: khata.totalBalance + result.order.totalAmount,
            items_summary: orderItems.map(i => `${i.productName} x${i.quantity}`).join(', ')
          }]).then(({ error }) => {
            if (error) console.error('Supabase Khata Entry Error:', error);
          });
        }

        clearCart();
      }
      return { success: true, isCached: result.isCached, order: result.order };
    } else {
      return { success: false, error: result.error };
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status } : ord))
    );
    if (isSupabaseConfigured()) {
      supabase.from('orders').update({ status }).eq('id', orderId).then(({ error }) => {
        if (error) console.error('Supabase order status error:', error);
      });
    }
  };

  const assignDeliveryBoy = (orderId: string, deliveryBoyId: string) => {
    setOrders(prev =>
      prev.map(ord =>
        ord.id === orderId
          ? { ...ord, assignedDeliveryBoy: deliveryBoyId, status: 'dispatched' }
          : ord
      )
    );
    setDeliveryBoys(prev =>
      prev.map(db =>
        db.id === deliveryBoyId ? { ...db, activeOrders: db.activeOrders + 1, status: 'on_delivery' } : db
      )
    );
    if (isSupabaseConfigured()) {
      supabase.from('orders').update({ assigned_delivery_boy: deliveryBoyId, status: 'dispatched' }).eq('id', orderId).then(({ error }) => {
        if (error) console.error('Supabase assign delivery boy error:', error);
      });
    }
  };

  const makeKhataPayment = (amount: number, description: string = 'UPI Payment Settlement') => {
    const newBalance = Math.max(0, khata.totalBalance - amount);
    const newEntry = {
      id: 'kh-pay-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      description,
      amount,
      type: 'credit' as const,
      balanceAfter: newBalance
    };

    setKhata(prev => ({
      ...prev,
      totalBalance: newBalance,
      lastPaymentDate: new Date().toISOString().split('T')[0],
      entries: [newEntry, ...prev.entries]
    }));

    if (isSupabaseConfigured()) {
      supabase.from('khata_entries').insert([{
        id: newEntry.id,
        customer_id: 'cust_42',
        customer_name: khata.customerName,
        customer_phone: khata.customerPhone,
        date: newEntry.date,
        description,
        amount,
        type: 'credit',
        balance_after: newBalance
      }]).then(({ error }) => {
        if (error) console.error('Supabase Khata payment settlement error:', error);
      });
    }
  };

  const updateCreditLimit = (newLimit: number) => {
    setKhata(prev => ({ ...prev, creditLimit: newLimit }));
  };

  const addSubscription = (
    product: Product,
    quantity: number,
    frequency: 'daily' | 'alternate' | 'weekly',
    timeSlot: any
  ) => {
    const newSub: Subscription = {
      id: 'sub-' + Date.now(),
      product,
      quantity,
      frequency,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      nextDeliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      timeSlot
    };
    setSubscriptions(prev => [newSub, ...prev]);
  };

  const toggleSubscriptionStatus = (subId: string) => {
    setSubscriptions(prev =>
      prev.map(s =>
        s.id === subId
          ? { ...s, status: s.status === 'active' ? 'paused' : 'active' }
          : s
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        viewMode,
        setViewMode,
        languageMode,
        setLanguageMode,
        userProfile,
        setUserProfile,
        isSupabaseConnected,
        userLat,
        userLng,
        setUserLocation,
        geofenceResults,
        activeStore,
        setActiveStore,
        products,
        updateProductStock,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        orders,
        placeOrder,
        updateOrderStatus,
        assignDeliveryBoy,
        khata,
        makeKhataPayment,
        updateCreditLimit,
        subscriptions,
        addSubscription,
        toggleSubscriptionStatus,
        deliveryBoys,
        idempotencyLogs,
        simulateNetworkDrop,
        setSimulateNetworkDrop,
        selectedReceiptOrder,
        setSelectedReceiptOrder
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
