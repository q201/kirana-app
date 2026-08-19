import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus, Product } from '../../types';
import {
  Store,
  Printer,
  Bike,
  CheckCircle2,
  Clock,
  Mic,
  FileText,
  BookOpen,
  Phone,
  AlertCircle,
  Volume2,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Package,
  Plus,
  Minus,
  RefreshCw,
  Send,
  AlertTriangle,
  Boxes,
  Truck,
  X,
  Copy,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StoreDashboardProps {
  onOpenReceipt: (order: Order) => void;
  onOpenDeliveryAssignment: (order: Order) => void;
}

export const StoreDashboard: React.FC<StoreDashboardProps> = ({
  onOpenReceipt,
  onOpenDeliveryAssignment
}) => {
  const { orders, updateOrderStatus, khata, activeStore, deliveryBoys, products, updateProductStock } = useApp();
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'inventory' | 'khata_books'>('pending');
  const [inventoryFilter, setInventoryFilter] = useState<'all' | 'low_stock'>('all');

  const [isPoModalOpen, setIsPoModalOpen] = useState<boolean>(false);
  const [poSentSuccess, setPoSentSuccess] = useState<boolean>(false);

  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'accepted');
  const activeOrders = orders.filter(o => o.status === 'preparing' || o.status === 'dispatched');

  const lowStockProducts = products.filter(
    p => (p.stockQty ?? 0) <= (p.reorderLevel ?? 10)
  );

  const displayedProducts = inventoryFilter === 'low_stock' ? lowStockProducts : products;

  const handleSendWholesalerPO = () => {
    setPoSentSuccess(true);
    confetti({ particleCount: 80, spread: 80 });
    setTimeout(() => {
      setPoSentSuccess(false);
      setIsPoModalOpen(false);
    }, 2200);
  };

  return (
    <div className="space-y-6">
      {/* High-Contrast Kirana Uncle Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 rounded-3xl p-6 text-slate-950 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-4 border-amber-400">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Store className="w-8 h-8 font-black" />
            <h2 className="text-2xl font-black tracking-tight">{activeStore.name}</h2>
          </div>
          <p className="text-sm font-bold text-slate-900">
            Dukaan Owner: <span className="underline">{activeStore.ownerName}</span> ({activeStore.phone})
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="flex items-center gap-4 bg-slate-950/20 p-3 rounded-2xl border border-slate-950/10">
          <div className="text-center px-3 border-r border-slate-950/20">
            <div className="text-xs font-extrabold text-slate-900">Incoming Orders</div>
            <div className="text-2xl font-black text-slate-950">{pendingOrders.length}</div>
          </div>

          <div className="text-center px-3 border-r border-slate-950/20">
            <div className="text-xs font-extrabold text-slate-900">Active Deliveries</div>
            <div className="text-2xl font-black text-slate-950">{activeOrders.length}</div>
          </div>

          <div className="text-center px-3 border-r border-slate-950/20">
            <div className="text-xs font-extrabold text-slate-900">Low Stock Items</div>
            <div className="text-2xl font-black text-rose-950 flex items-center justify-center gap-1">
              <span>{lowStockProducts.length}</span>
              {lowStockProducts.length > 0 && <AlertTriangle className="w-4 h-4 text-rose-900 fill-rose-900" />}
            </div>
          </div>

          <div className="text-center px-3">
            <div className="text-xs font-extrabold text-slate-900">Khata Dues Owed</div>
            <div className="text-2xl font-black text-slate-950">₹{khata.totalBalance}</div>
          </div>
        </div>
      </div>

      {/* Simplified High-Contrast Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 min-w-[140px] ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-slate-950 shadow-lg'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>New Orders ({pendingOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 min-w-[140px] ${
            activeTab === 'active'
              ? 'bg-amber-500 text-slate-950 shadow-lg'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Out for Delivery ({activeOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 min-w-[140px] ${
            activeTab === 'inventory'
              ? 'bg-rose-500 text-slate-950 shadow-lg'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Stock & Inventory ({lowStockProducts.length} Alert)</span>
        </button>

        <button
          onClick={() => setActiveTab('khata_books')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 min-w-[140px] ${
            activeTab === 'khata_books'
              ? 'bg-emerald-500 text-slate-950 shadow-lg'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Mohalla Khata Book</span>
        </button>
      </div>

      {/* INVENTORY & STOCK ALERTS TAB */}
      {activeTab === 'inventory' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>Dukaan Inventory & Low-Stock Alerts</span>
                {lowStockProducts.length > 0 && (
                  <span className="text-xs bg-rose-500/20 text-rose-400 px-2.5 py-0.5 rounded-full border border-rose-500/30 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{lowStockProducts.length} Low Stock</span>
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">Track stock levels, replenish inventory, and generate Wholesale Purchase Orders</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setInventoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    inventoryFilter === 'all'
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Items ({products.length})
                </button>
                <button
                  onClick={() => setInventoryFilter('low_stock')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    inventoryFilter === 'low_stock'
                      ? 'bg-rose-500 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Low Stock ({lowStockProducts.length})
                </button>
              </div>

              <button
                onClick={() => setIsPoModalOpen(true)}
                className="py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-900/30 transition-all"
              >
                <Truck className="w-4 h-4" />
                <span>Wholesale P.O. Generator</span>
              </button>
            </div>
          </div>

          {/* Product Stock Table / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedProducts.map(product => {
              const currentQty = product.stockQty ?? 20;
              const threshold = product.reorderLevel ?? 10;
              const isLowStock = currentQty <= threshold;
              const isOutOfStock = currentQty === 0;

              return (
                <div
                  key={product.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isOutOfStock
                      ? 'bg-rose-950/20 border-rose-500/50'
                      : isLowStock
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-sm text-white truncate">{product.name}</h4>
                        {isOutOfStock ? (
                          <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/30 font-extrabold shrink-0">
                            Out of Stock
                          </span>
                        ) : isLowStock ? (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-extrabold shrink-0 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            <span>Low Stock</span>
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-bold shrink-0">
                            Healthy Stock
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">{product.hindiName} • {product.unit}</p>
                      <p className="text-[11px] text-amber-400 font-bold mt-0.5">Supplier: {product.supplier || 'Delhi FMCG Wholesaler'}</p>
                    </div>
                  </div>

                  {/* Stock Level Progress Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-400">Current Stock:</span>
                      <span className={isLowStock ? 'text-amber-300' : 'text-emerald-400'}>
                        {currentQty} units (Min: {threshold})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full transition-all rounded-full ${
                          isOutOfStock
                            ? 'bg-rose-600'
                            : isLowStock
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, (currentQty / (threshold * 3)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Adjust Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <span className="text-xs font-bold text-slate-300">₹{product.price} / unit</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateProductStock(product.id, currentQty - 1)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800"
                        title="Reduce stock by 1"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 font-mono font-black text-xs text-white">{currentQty}</span>
                      <button
                        onClick={() => updateProductStock(product.id, currentQty + 1)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800"
                        title="Increase stock by 1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>

                      {/* Quick Restock Action */}
                      <button
                        onClick={() => updateProductStock(product.id, currentQty + 50)}
                        className="ml-1 px-2 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-[10px] font-extrabold border border-emerald-500/30 flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>+50 Restock</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Orders List / Khata Content */}
      {activeTab === 'khata_books' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-white">Neighborhood Household Udhar Ledgers</h3>
              <p className="text-xs text-slate-400">Track and manage credit limits for verified Mohalla families</p>
            </div>
            <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-xl text-xs font-black border border-emerald-500/30">
              Total Udhar: ₹{khata.totalBalance}
            </div>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-base border border-amber-500/30">
                S
              </div>
              <div>
                <div className="font-bold text-white text-sm">{khata.customerName}</div>
                <div className="text-slate-400">{khata.customerPhone}</div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <div className="text-slate-400 text-[10px]">Current Balance</div>
                <div className="text-base font-black text-emerald-400">₹{khata.totalBalance}</div>
              </div>

              <div>
                <div className="text-slate-400 text-[10px]">Credit Limit</div>
                <div className="text-sm font-bold text-white">₹{khata.creditLimit}</div>
              </div>

              <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs border border-slate-700">
                Send SMS Remind
              </button>
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'pending' || activeTab === 'active') && (
        <div className="space-y-4">
          {(activeTab === 'pending' ? pendingOrders : activeOrders).map((order) => {
            const assignedBoy = deliveryBoys.find(b => b.id === order.assignedDeliveryBoy);

            return (
              <div
                key={order.id}
                className="bg-slate-900 border-2 border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 shadow-xl space-y-4 transition-all"
              >
                {/* Header line */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-amber-400 font-mono">{order.id}</span>
                    
                    {/* Order Type Badge */}
                    {order.orderType === 'voice_note' ? (
                      <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-extrabold text-xs flex items-center gap-1">
                        <Mic className="w-3.5 h-3.5 animate-pulse" />
                        <span>Voice Note Order</span>
                      </span>
                    ) : order.orderType === 'photo_list' ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-extrabold text-xs flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Photo List Order</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-extrabold text-xs">
                        App Order
                      </span>
                    )}

                    <span className="text-xs text-slate-400">• {order.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Payment Mode Badge */}
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                        order.paymentMethod === 'khata'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      Payment: {order.paymentMethod}
                    </span>

                    <span className="text-lg font-black text-emerald-400">₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="flex items-start justify-between bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
                  <div>
                    <div className="font-black text-white text-sm">{order.customerName}</div>
                    <div className="text-slate-400">{order.address}</div>
                  </div>
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-amber-400 font-bold rounded-xl border border-slate-800 hover:bg-slate-800"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Customer</span>
                  </a>
                </div>

                {/* Order Items Table */}
                <div className="space-y-1 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 text-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Itemized Shopping List:
                  </div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-800/40 last:border-0">
                      <span className="font-bold text-white">
                        {item.productName} <span className="text-amber-400">x{item.quantity}</span>
                      </span>
                      <span className="text-emerald-400 font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery Helper Assignment Info */}
                {assignedBoy && (
                  <div className="flex items-center justify-between bg-amber-500/10 p-3 rounded-2xl border border-amber-500/30 text-xs">
                    <div className="flex items-center gap-2">
                      <Bike className="w-4 h-4 text-amber-400" />
                      <span className="text-slate-300">Delivery Helper:</span>
                      <span className="font-bold text-amber-300">{assignedBoy.name}</span>
                      <span className="text-slate-500">({assignedBoy.vehicle})</span>
                    </div>
                    <span className="text-emerald-400 font-bold">Out on Scooter</span>
                  </div>
                )}

                {/* Action Buttons for Kirana Uncle */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {/* Thermal Receipt Print Button */}
                    <button
                      onClick={() => onOpenReceipt(order)}
                      className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700"
                    >
                      <Printer className="w-4 h-4 text-amber-400" />
                      <span>Thermal Receipt</span>
                    </button>

                    {/* Assign Helper Button */}
                    <button
                      onClick={() => onOpenDeliveryAssignment(order)}
                      className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700"
                    >
                      <UserCheck className="w-4 h-4 text-amber-400" />
                      <span>{assignedBoy ? 'Re-assign Helper' : 'Assign Delivery Boy'}</span>
                    </button>
                  </div>

                  {/* Order Status Advancement Buttons */}
                  <div className="flex items-center gap-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'accepted')}
                        className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-900/30"
                      >
                        ✓ Accept Order
                      </button>
                    )}

                    {order.status === 'accepted' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'dispatched')}
                        className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-lg"
                      >
                        Dispatch Order
                      </button>
                    )}

                    {order.status === 'dispatched' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                        className="py-2.5 px-5 bg-green-600 hover:bg-green-500 text-white font-black rounded-xl text-xs shadow-lg"
                      >
                        Mark Delivered
                      </button>
                    )}

                    {order.status === 'delivered' && (
                      <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 font-black rounded-xl text-xs border border-emerald-500/30">
                        ✓ Order Complete
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
