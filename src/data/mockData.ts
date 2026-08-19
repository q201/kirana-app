import type { Product, KiranaStore, KhataLedger, Subscription, DeliveryBoy, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // User Requested Core 13 Items
  {
    id: 'p1',
    item_code: 'STAP_001',
    item_name_en: 'Wheat Atta',
    item_name_hi: 'गेहूं का आटा',
    name: 'Wheat Atta',
    hindiName: 'गेहूं का आटा',
    category: 'Staples',
    price: 37.0,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['atta', 'aata', 'wheat', 'flour', 'गेहूं', 'आटा', 'stap_001', 'wheat atta'],
    stockQty: 42,
    reorderLevel: 15,
    supplier: 'Delhi Flour Mills Co.'
  },
  {
    id: 'p2',
    item_code: 'STAP_002',
    item_name_en: 'Basmati Rice',
    item_name_hi: 'बासमती चावल',
    name: 'Basmati Rice',
    hindiName: 'बासमती चावल',
    category: 'Staples',
    price: 110.0,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['rice', 'chawal', 'basmati', 'बासमती', 'चावल', 'stap_002', 'basmati rice'],
    stockQty: 7,
    reorderLevel: 15,
    supplier: 'Haryana Basmati Traders'
  },
  {
    id: 'p3',
    item_code: 'STAP_003',
    item_name_en: 'Besan',
    item_name_hi: 'बेसन',
    name: 'Besan',
    hindiName: 'बेसन',
    category: 'Staples',
    price: 82.5,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['besan', 'gram flour', 'बेसन', 'stap_003'],
    stockQty: 4,
    reorderLevel: 10,
    supplier: 'Agra Gram Processors'
  },
  {
    id: 'p4',
    item_code: 'PULS_001',
    item_name_en: 'Toor Dal',
    item_name_hi: 'अरहर दाल',
    name: 'Toor Dal',
    hindiName: 'अरहर दाल',
    category: 'Pulses',
    price: 150.0,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['toor dal', 'arhar dal', 'dal', 'अरहर', 'दाल', 'puls_001'],
    stockQty: 24,
    reorderLevel: 10,
    supplier: 'Indore Pulse Hub'
  },
  {
    id: 'p5',
    item_code: 'PULS_002',
    item_name_en: 'Moong Dal',
    item_name_hi: 'मूंग दाल',
    name: 'Moong Dal',
    hindiName: 'मूंग दाल',
    category: 'Pulses',
    price: 120.0,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1585994191611-726a8807282b?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['moong dal', 'mung', 'dal', 'मूंग', 'दाल', 'puls_002'],
    stockQty: 3,
    reorderLevel: 10,
    supplier: 'Indore Pulse Hub'
  },
  {
    id: 'p6',
    item_code: 'OILS_001',
    item_name_en: 'Mustard Oil',
    item_name_hi: 'सरसों का तेल',
    name: 'Mustard Oil',
    hindiName: 'सरसों का तेल',
    category: 'Oils',
    price: 145.0,
    unit: '1 litre',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['mustard oil', 'sarso', 'sarson', 'oil', 'tel', 'सरसों', 'तेल', 'oils_001'],
    stockQty: 4,
    reorderLevel: 12,
    supplier: 'Fortune Oils Agency'
  },
  {
    id: 'p7',
    item_code: 'OILS_002',
    item_name_en: 'Sugar',
    item_name_hi: 'चीनी',
    name: 'Sugar',
    hindiName: 'चीनी',
    category: 'Oils/Sweeteners',
    price: 42.0,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1622484210800-244439fa5a25?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['sugar', 'cheeni', 'chini', 'चीनी', 'oils_002'],
    stockQty: 38,
    reorderLevel: 15,
    supplier: 'Mawana Sugar Works'
  },
  {
    id: 'p8',
    item_code: 'SPIC_001',
    item_name_en: 'Iodized Salt',
    item_name_hi: 'नमक',
    name: 'Iodized Salt',
    hindiName: 'नमक',
    category: 'Spices',
    price: 24.0,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1518110165403-10029b4703a5?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['salt', 'namak', 'iodized salt', 'नमक', 'spic_001'],
    stockQty: 55,
    reorderLevel: 15,
    supplier: 'Tata Salt Distributors'
  },
  {
    id: 'p9',
    item_code: 'SPIC_002',
    item_name_en: 'Turmeric Powder',
    item_name_hi: 'हल्दी पाउडर',
    name: 'Turmeric Powder',
    hindiName: 'हल्दी पाउडर',
    category: 'Spices',
    price: 20.0,
    unit: '100g',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['turmeric', 'haldi', 'haldi powder', 'हल्दी', 'spic_002'],
    stockQty: 2,
    reorderLevel: 10,
    supplier: 'Everest Spices Ltd'
  },
  {
    id: 'p10',
    item_code: 'BEVR_001',
    item_name_en: 'Tea Leaves',
    item_name_hi: 'चाय पत्ती',
    name: 'Tea Leaves',
    hindiName: 'चाय पत्ती',
    category: 'Beverages',
    price: 325.0,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['tea', 'chai', 'chai patti', 'tea leaves', 'चाय', 'bevr_001'],
    stockQty: 18,
    reorderLevel: 8,
    supplier: 'Assam Tea Agency'
  },
  {
    id: 'p11',
    item_code: 'SNAC_001',
    item_name_en: 'Parle-G Biscuit',
    item_name_hi: 'पार्ले-जी बिस्कुट',
    name: 'Parle-G Biscuit',
    hindiName: 'पार्ले-जी बिस्कुट',
    category: 'Snacks',
    price: 10.0,
    unit: 'pack',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['parle-g', 'biscuit', 'parle', 'बिस्कुट', 'snac_001'],
    stockQty: 65,
    reorderLevel: 20,
    supplier: 'Parle Products Hub'
  },
  {
    id: 'p12',
    item_code: 'PERS_001',
    item_name_en: 'Bath Soap',
    item_name_hi: 'नहाने का साबुन',
    name: 'Bath Soap',
    hindiName: 'नहाने का साबुन',
    category: 'Personal Care',
    price: 35.0,
    unit: 'piece',
    image: 'https://images.unsplash.com/photo-1607006482602-765180037159?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['soap', 'sabun', 'bath soap', 'साबुन', 'pers_001'],
    stockQty: 22,
    reorderLevel: 10,
    supplier: 'Hindustan Unilever Depot'
  },
  {
    id: 'p13',
    item_code: 'CLEA_001',
    item_name_en: 'Washing Powder',
    item_name_hi: 'सर्फ पाउडर',
    name: 'Washing Powder',
    hindiName: 'सर्फ पाउडर',
    category: 'Cleaning',
    price: 105.0,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['washing powder', 'surf', 'detergent', 'सर्फ', 'clea_001'],
    stockQty: 15,
    reorderLevel: 8,
    supplier: 'Surf Excel Agency'
  },

  // Additional Indian Mohalla Kirana Essentials
  {
    id: 'p14',
    item_code: 'STAP_004',
    item_name_en: 'Suji / Rava',
    item_name_hi: 'सूजी / रवा',
    name: 'Suji / Rava',
    hindiName: 'सूजी / रवा',
    category: 'Staples',
    price: 45.0,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1608797178974-15b35a6405cb?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['suji', 'rava', 'semolina', 'सूजी', 'रवा', 'stap_004']
  },
  {
    id: 'p15',
    item_code: 'STAP_005',
    item_name_en: 'Thick Poha',
    item_name_hi: 'पोहा',
    name: 'Thick Poha',
    hindiName: 'पोहा',
    category: 'Staples',
    price: 52.0,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1613769049987-b31b641f25b1?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['poha', 'flattened rice', 'पोहा', 'stap_005']
  },
  {
    id: 'p16',
    item_code: 'PULS_003',
    item_name_en: 'Chana Dal',
    item_name_hi: 'चना दाल',
    name: 'Chana Dal',
    hindiName: 'चना दाल',
    category: 'Pulses',
    price: 95.0,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['chana dal', 'chana', 'dal', 'चना दाल', 'puls_003']
  },
  {
    id: 'p17',
    item_code: 'PULS_004',
    item_name_en: 'Rajma Red Kidney Beans',
    item_name_hi: 'राजमा',
    name: 'Rajma Red Kidney Beans',
    hindiName: 'राजमा',
    category: 'Pulses',
    price: 140.0,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['rajma', 'kidney beans', 'राजमा', 'puls_004']
  },
  {
    id: 'p18',
    item_code: 'PULS_005',
    item_name_en: 'Kabuli Chana Chickpeas',
    item_name_hi: 'काबोली चना (छोले)',
    name: 'Kabuli Chana Chickpeas',
    hindiName: 'काबोली चना (छोले)',
    category: 'Pulses',
    price: 130.0,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1588879462806-07a5b61f8c06?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['kabuli chana', 'chole', 'chickpeas', 'चना', 'छोले', 'puls_005']
  },
  {
    id: 'p19',
    item_code: 'OILS_003',
    item_name_en: 'Sunflower Oil',
    item_name_hi: 'सनफ्लावर रिफाइंड तेल',
    name: 'Sunflower Oil',
    hindiName: 'सनफ्लावर रिफाइंड तेल',
    category: 'Oils',
    price: 135.0,
    unit: '1 litre',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['sunflower oil', 'refined oil', 'तेल', 'oils_003']
  },
  {
    id: 'p20',
    item_code: 'OILS_004',
    item_name_en: 'Pure Cow Desi Ghee',
    item_name_hi: 'शुद्ध देसी घी',
    name: 'Pure Cow Desi Ghee',
    hindiName: 'शुद्ध देसी घी',
    category: 'Oils/Sweeteners',
    price: 620.0,
    unit: '1 litre',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['ghee', 'desi ghee', 'cow ghee', 'घी', 'oils_004']
  },
  {
    id: 'p21',
    item_code: 'SPIC_003',
    item_name_en: 'Red Chilli Powder',
    item_name_hi: 'लाल मिर्च पाउडर',
    name: 'Red Chilli Powder',
    hindiName: 'लाल मिर्च पाउडर',
    category: 'Spices',
    price: 35.0,
    unit: '100g',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['chilli', 'mirch', 'lal mirch', 'लाल मिर्च', 'spic_003']
  },
  {
    id: 'p22',
    item_code: 'SPIC_004',
    item_name_en: 'Coriander Powder (Dhaniya)',
    item_name_hi: 'धनिया पाउडर',
    name: 'Coriander Powder (Dhaniya)',
    hindiName: 'धनिया पाउडर',
    category: 'Spices',
    price: 25.0,
    unit: '100g',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['coriander', 'dhaniya', 'धनिया', 'spic_004']
  },
  {
    id: 'p23',
    item_code: 'SPIC_005',
    item_name_en: 'Jeera Cumin Seeds',
    item_name_hi: 'जीरा',
    name: 'Jeera Cumin Seeds',
    hindiName: 'जीरा',
    category: 'Spices',
    price: 48.0,
    unit: '100g',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['jeera', 'cumin', 'जीरा', 'spic_005']
  },
  {
    id: 'p24',
    item_code: 'DAIR_001',
    item_name_en: 'Amul Milk Toned',
    item_name_hi: 'अमुल ताज़ा दूध',
    name: 'Amul Milk Toned',
    hindiName: 'अमुल ताज़ा दूध',
    category: 'Dairy & Eggs',
    price: 28.0,
    unit: '500 ml',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['milk', 'doodh', 'amul', 'दूध', 'dair_001']
  },
  {
    id: 'p25',
    item_code: 'DAIR_002',
    item_name_en: 'Fresh Dahi Curd',
    item_name_hi: 'ताज़ा दही',
    name: 'Fresh Dahi Curd',
    hindiName: 'ताज़ा दही',
    category: 'Dairy & Eggs',
    price: 35.0,
    unit: '400 g',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['curd', 'dahi', 'दही', 'dair_002']
  },
  {
    id: 'p26',
    item_code: 'DAIR_003',
    item_name_en: 'Fresh Malai Paneer',
    item_name_hi: 'ताज़ा मलाई पनीर',
    name: 'Fresh Malai Paneer',
    hindiName: 'ताज़ा मलाई पनीर',
    category: 'Dairy & Eggs',
    price: 90.0,
    unit: '200 g',
    image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['paneer', 'cottage cheese', 'पनीर', 'dair_003']
  },
  {
    id: 'p27',
    item_code: 'SNAC_002',
    item_name_en: 'Nestle Maggi 2-Min Noodles',
    item_name_hi: 'मैगी नूडल्स',
    name: 'Nestle Maggi 2-Min Noodles',
    hindiName: 'मैगी नूडल्स',
    category: 'Snacks',
    price: 14.0,
    unit: 'pack',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['maggi', 'maggie', 'noodles', 'मैगी', 'snac_002']
  },
  {
    id: 'p28',
    item_code: 'SNAC_003',
    item_name_en: 'Haldiram Aloo Bhujia',
    item_name_hi: 'आलू भुजिया नमकीन',
    name: 'Haldiram Aloo Bhujia',
    hindiName: 'आलू भुजिया नमकीन',
    category: 'Snacks',
    price: 55.0,
    unit: '200 g',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['bhujia', 'namkeen', 'aloo bhujia', 'भुजिया', 'snac_003']
  },
  {
    id: 'p29',
    item_code: 'PERS_002',
    item_name_en: 'Colgate Toothpaste',
    item_name_hi: 'कोलगेट टूथपेस्ट',
    name: 'Colgate Toothpaste',
    hindiName: 'कोलगेट टूथपेस्ट',
    category: 'Personal Care',
    price: 65.0,
    unit: '150 g',
    image: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&w=500&q=80',
    inStock: true,
    keywords: ['toothpaste', 'colgate', 'टूथपेस्ट', 'pers_002']
  }
];

export const MOCK_STORES: KiranaStore[] = [
  {
    id: 'store-1',
    name: 'Gupta Ji General Store & Kirana',
    ownerName: 'Ramprasad Gupta',
    phone: '+91 98765 43210',
    address: 'Shop No. 4, Main Market, Pocket B, Sarita Vihar',
    lat: 28.5292,
    lng: 77.2910,
    radiusKm: 1.5,
    rating: 4.9,
    ordersCompleted: 1420,
    isOpen: true,
    khataAccepted: true
  },
  {
    id: 'store-2',
    name: 'Sharma Super Mart',
    ownerName: 'Sanjay Sharma',
    phone: '+91 98123 98765',
    address: 'Plot 12, Mohalla Corner, Pocket A, Sarita Vihar',
    lat: 28.5350,
    lng: 77.2980,
    radiusKm: 1.5,
    rating: 4.7,
    ordersCompleted: 980,
    isOpen: true,
    khataAccepted: true
  },
  {
    id: 'store-3',
    name: 'Lakshmi Provision & Cold Store',
    ownerName: 'Venkatesh Rao',
    phone: '+91 97777 55544',
    address: 'Near Shiv Mandir, Gate 3, Sector 4',
    lat: 28.5150,
    lng: 77.2800,
    radiusKm: 2.0,
    rating: 4.6,
    ordersCompleted: 650,
    isOpen: false,
    khataAccepted: false
  }
];

export const INITIAL_KHATA_LEDGER: KhataLedger = {
  customerId: 'cust-101',
  customerName: 'Mohalla Household',
  customerPhone: '+91 99887 76655',
  totalBalance: 0,
  creditLimit: 5000,
  lastPaymentDate: '2026-08-01',
  entries: []
};

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    product: INITIAL_PRODUCTS[0], // Wheat Atta
    quantity: 5,
    frequency: 'weekly',
    startDate: '2026-08-01',
    status: 'active',
    nextDeliveryDate: '2026-08-22',
    timeSlot: '6:30 AM - 7:30 AM'
  },
  {
    id: 'sub-2',
    product: INITIAL_PRODUCTS[5], // Mustard Oil
    quantity: 2,
    frequency: 'alternate',
    startDate: '2026-08-05',
    status: 'active',
    nextDeliveryDate: '2026-08-19',
    timeSlot: '7:30 AM - 8:30 AM'
  }
];

export const INITIAL_DELIVERY_BOYS: DeliveryBoy[] = [
  {
    id: 'db-1',
    name: 'Chhotu (Shop Helper)',
    phone: '+91 98989 12345',
    vehicle: 'Hero Splendor (DL 3S CW 4412)',
    activeOrders: 1,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    status: 'available'
  },
  {
    id: 'db-2',
    name: 'Ramu Kaka (Store Assistant)',
    phone: '+91 97111 88899',
    vehicle: 'Hero Bicycle',
    activeOrders: 0,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: 'available'
  },
  {
    id: 'db-3',
    name: 'Sonu Kumar',
    phone: '+91 96543 21098',
    vehicle: 'Honda Activa',
    activeOrders: 2,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    status: 'on_delivery'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9841',
    idempotencyKey: 'idemp_key_initial_01',
    customerName: 'Homemaker Customer',
    customerPhone: '+91 99887 76655',
    address: 'House #42, Lane 3, Pocket B, Sarita Vihar',
    items: [
      { productId: 'p1', productName: 'Wheat Atta (गेहूं का आटा)', price: 37, unit: '5 kg', quantity: 5 },
      { productId: 'p6', productName: 'Mustard Oil (सरसों का तेल)', price: 145, unit: '1 litre', quantity: 1 },
      { productId: 'p8', productName: 'Iodized Salt (नमक)', price: 24, unit: '1 kg', quantity: 1 }
    ],
    totalAmount: 354,
    paymentMethod: 'khata',
    paymentStatus: 'added_to_khata',
    status: 'accepted',
    orderType: 'voice_note',
    createdAt: '10 mins ago',
    assignedDeliveryBoy: 'db-1',
    audioNoteUrl: 'voice_memo_001.mp3'
  },
  {
    id: 'ORD-9840',
    idempotencyKey: 'idemp_key_initial_02',
    customerName: 'Rajesh Verma',
    customerPhone: '+91 98111 22233',
    address: 'Flat 302, Green View Apts',
    items: [
      { productId: 'p2', productName: 'Basmati Rice (बासमती चावल)', price: 110, unit: '1 kg', quantity: 2 },
      { productId: 'p4', productName: 'Toor Dal (अरहर दाल)', price: 150, unit: '1 kg', quantity: 1 }
    ],
    totalAmount: 370,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    status: 'dispatched',
    orderType: 'photo_list',
    createdAt: '25 mins ago',
    assignedDeliveryBoy: 'db-3',
    photoListUrl: 'handwritten_list_sample.jpg'
  }
];

export const SAMPLE_VOICE_PRESETS = [
  {
    title: 'Hindi Number Words',
    audioText: 'Bhaiya paanch kilo aata, do litre sarson tel aur ek kilo besan bhej do urgent',
    translated: '5kg Wheat Atta, 2 Litre Mustard Oil, 1kg Besan'
  },
  {
    title: 'Daily Hindi Voice Order',
    audioText: 'भैया 5 किलो गेहूं का आटा, 1 लीटर सरसों का तेल, और 1 किलो अरहर दाल भेज देना',
    translated: 'Bhaiya, 5kg Wheat Atta, 1 litre Mustard Oil, aur 1kg Toor Dal bhej dena'
  },
  {
    title: 'Hinglish Essentials Order',
    audioText: 'Gupta ji 2kg basmati rice, 1kg chini aur 2 maggi bhej do urgent',
    translated: 'Gupta ji, 2kg Basmati Rice, 1kg Sugar and 2 Maggi send urgent'
  },
  {
    title: 'Monthly Ration Quick Voice',
    audioText: 'Bhaiya teen kilo toor dal, ek kilo moong dal aur aadha kilo haldi bhej dena',
    translated: '3kg Toor Dal, 1kg Moong Dal, 0.5kg Turmeric Powder'
  }
];

export const SAMPLE_HANDWRITTEN_LISTS = [
  {
    title: 'Hindi Devanagari Paper List',
    itemsText: `१. गेहूं का आटा - ५ किलो
२. सरसों का तेल - १ लीटर
३. अरहर दाल - १ किलो
४. बेसन - २ किलो`,
    imagePreview: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Weekly Kirana List (Hinglish)',
    itemsText: `1. Wheat Atta - 5kg
2. Basmati Rice - 2kg
3. Toor Dal - 1kg
4. Mustard Oil - 1 litre`,
    imagePreview: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Household Cleaning & Spices',
    itemsText: `1. Washing Powder - 1kg
2. Bath Soap - 2 pcs
3. Turmeric Powder - 100g
4. Iodized Salt - 1kg`,
    imagePreview: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'
  }
];
