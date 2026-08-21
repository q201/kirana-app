import React from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { Printer, X, Check } from 'lucide-react';

interface ThermalReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({ order, onClose }) => {
  const { activeStore, khata } = useApp();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in print:p-0 print:bg-white cursor-pointer">
      <div onClick={(e) => e.stopPropagation()} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-slate-100 shadow-2xl relative print:border-none print:shadow-none print:bg-white print:text-black cursor-default">
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-full text-slate-400 print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Thermal Receipt Paper Roll Preview (80mm Width Look) */}
        <div className="bg-stone-100 text-stone-900 font-mono p-5 rounded-2xl shadow-inner border border-stone-300 text-xs space-y-4 print:p-0 print:border-none">
          {/* Header */}
          <div className="text-center space-y-1 border-b border-dashed border-stone-400 pb-3">
            <div className="font-black text-sm uppercase tracking-wide">{activeStore.name}</div>
            <div className="text-[10px] text-stone-600">{activeStore.address}</div>
            <div className="text-[10px] text-stone-600">Ph: {activeStore.phone}</div>
            <div className="text-[10px] font-bold mt-1">*** CASH / KHATA MEMO ***</div>
          </div>

          {/* Metadata */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-stone-400 pb-3">
            <div className="flex justify-between">
              <span>Receipt #:</span>
              <span className="font-bold">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Date/Time:</span>
              <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-bold">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <span className="font-bold uppercase">{order.paymentMethod}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-1 border-b border-dashed border-stone-400 pb-3">
            <div className="flex justify-between font-bold text-[10px] uppercase border-b border-stone-300 pb-1">
              <span>Item Description</span>
              <span>Qty x Rate</span>
              <span>Total</span>
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-[11px]">
                <span className="max-w-[130px] truncate">{item.productName}</span>
                <span>{item.quantity} x {item.price}</span>
                <span className="font-bold">₹{item.quantity * item.price}</span>
              </div>
            ))}
          </div>

          {/* Total & Khata Dues */}
          <div className="space-y-1 border-b border-dashed border-stone-400 pb-3 text-right">
            <div className="flex justify-between font-black text-sm">
              <span>GRAND TOTAL:</span>
              <span>₹{order.totalAmount}</span>
            </div>
            {order.paymentMethod === 'khata' && (
              <div className="text-[10px] text-stone-700 pt-1 text-left bg-stone-200 p-2 rounded">
                <div>* Added to Monthly Udhar Book</div>
                <div>Updated Total Balance: <strong>₹{khata.totalBalance}</strong></div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-[10px] text-stone-600 space-y-1">
            <div>Thank You! Visit Again.</div>
            <div>Apne Mohalle Ki Trusted Dukaan</div>
          </div>
        </div>

        {/* Actions (Hidden on Print) */}
        <div className="mt-4 flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print 80mm Thermal Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
