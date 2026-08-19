import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingBag, BookOpen, QrCode, Trash2, ShieldCheck, AlertTriangle, RefreshCw, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartAndCheckoutModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    cartTotal,
    placeOrder,
    khata,
    activeStore,
    simulateNetworkDrop,
    setSimulateNetworkDrop
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'khata' | 'upi'>('khata');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<any>(null);

  if (!isOpen) return null;

  const handlePlaceOrderSubmit = () => {
    setOrderError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = placeOrder(paymentMethod, 'standard');
      setIsSubmitting(false);

      if (res.success && res.order) {
        setSuccessOrder(res.order);
        confetti({ particleCount: 70, spread: 80 });
      } else {
        setOrderError(res.error || 'Failed to place order.');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>Household Cart & Checkout</span>
              </h2>
              <p className="text-xs text-slate-400">Delivered by {activeStore.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successOrder ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-white">Order Placed Successfully!</h3>
            <p className="text-xs text-slate-400">
              Order ID: <span className="text-amber-400 font-mono font-bold">{successOrder.id}</span>
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Mode:</span>
                <span className="font-bold uppercase text-emerald-400">{successOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Idempotency Key:</span>
                <span className="font-mono text-[10px] text-slate-300">{successOrder.idempotencyKey}</span>
              </div>
              {successOrder.paymentMethod === 'khata' && (
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-300 text-[11px] font-semibold">
                  ✓ Added ₹{successOrder.totalAmount} to Sunita Sharma Khata Ledger.
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setSuccessOrder(null);
                onClose();
              }}
              className="px-6 py-2.5 bg-amber-500 text-slate-950 font-black rounded-xl text-xs hover:bg-amber-400"
            >
              Continue Shopping
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <ShoppingBag className="w-12 h-12 mx-auto text-slate-700" />
            <p className="text-sm font-bold text-slate-400">Your basket is empty!</p>
            <p className="text-xs text-slate-500">Use Voice Note, Photo Upload or Catalog to add items.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Item List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {cart.map(item => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                    />
                    <div>
                      <div className="font-bold text-white leading-tight">{item.product.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {item.product.unit} • ₹{item.product.price}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-slate-900 rounded-xl border border-slate-800 p-1">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-slate-800 text-white font-bold flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-amber-400">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-amber-500 text-slate-950 font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-black text-emerald-400 w-14 text-right">
                      ₹{item.product.price * item.quantity}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Method Selector */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <label className="text-xs font-bold text-slate-400 block">Select Payment Mode:</label>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Digital Khata Credit Option */}
                <button
                  onClick={() => setPaymentMethod('khata')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'khata'
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs text-white">Monthly Khata Credit</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Add to monthly bill (Bal: ₹{khata.totalBalance} / Limit ₹{khata.creditLimit})
                    </div>
                  </div>
                </button>

                {/* Instant UPI Option */}
                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-blue-500/20 border-blue-500/60 text-blue-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs text-white">Instant UPI / QR Code</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Pay via GPay, PhonePe, Paytm
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Architecture Highlight: Idempotency & Network Drop Toggle */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-amber-300">Idempotency Protection</span>
                  <p className="text-[10px] text-slate-400">Prevents double charge on poor network drop</p>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={simulateNetworkDrop}
                  onChange={e => setSimulateNetworkDrop(e.target.checked)}
                  className="accent-amber-500"
                />
                <span className="text-[10px] font-bold text-amber-400">Simulate Network Timeout</span>
              </label>
            </div>

            {orderError && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            {/* Checkout Total & Submit Button */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Grand Total</div>
                <div className="text-xl font-black text-emerald-400">₹{cartTotal}</div>
              </div>

              <button
                onClick={handlePlaceOrderSubmit}
                disabled={isSubmitting}
                className="py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Place Order ({paymentMethod.toUpperCase()})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
