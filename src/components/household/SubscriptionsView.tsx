import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RefreshCw, Calendar, Clock, Plus, Play, Pause, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SubscriptionsView: React.FC = () => {
  const { subscriptions, products, addSubscription, toggleSubscriptionStatus, activeStore } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[1].id); // Amul Milk
  const [quantity, setQuantity] = useState<number>(2);
  const [frequency, setFrequency] = useState<'daily' | 'alternate' | 'weekly'>('daily');
  const [timeSlot, setTimeSlot] = useState<'6:30 AM - 7:30 AM' | '7:30 AM - 8:30 AM' | '5:00 PM - 6:00 PM'>('6:30 AM - 7:30 AM');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const handleCreateSub = () => {
    const prod = products.find(p => p.id === selectedProductId);
    if (prod) {
      addSubscription(prod, quantity, frequency, timeSlot);
      confetti({ particleCount: 50, spread: 70 });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <RefreshCw className="w-5 h-5 animate-spin-slow" />
            </span>
            <h2 className="text-xl font-black text-white">Daily Essentials Subscriptions</h2>
          </div>
          <p className="text-xs text-slate-400">
            Automated morning delivery of Milk, Eggs, Water & Bread from <span className="text-amber-400 font-bold">{activeStore.name}</span>
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Essential Subscription</span>
        </button>
      </div>

      {/* Subscription List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptions.map(sub => (
          <div
            key={sub.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg"
          >
            <div className="flex items-start gap-4 mb-4">
              <img
                src={sub.product.image}
                alt={sub.product.name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-white">{sub.product.name}</h3>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      sub.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {sub.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mt-1">
                  Qty: <span className="text-amber-300 font-bold">{sub.quantity}</span> ({sub.product.unit})
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span className="capitalize">{sub.frequency}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{sub.timeSlot}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-500">Next Delivery: </span>
                <span className="font-bold text-emerald-400">{sub.nextDeliveryDate}</span>
              </div>

              <button
                onClick={() => toggleSubscriptionStatus(sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  sub.status === 'active'
                    ? 'bg-slate-950 border-amber-500/40 text-amber-400 hover:bg-slate-800'
                    : 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                }`}
              >
                {sub.status === 'active' ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause Subscription</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Resume Delivery</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Subscription Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative space-y-4">
            <h3 className="text-lg font-black text-white">Create Recurring Subscription</h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Select Essential Product:</label>
              <select
                value={selectedProductId}
                onChange={e => setSelectedProductId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (₹{p.price} / {p.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Quantity per Delivery:</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={e => setQuantity(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Frequency:</label>
                <select
                  value={frequency}
                  onChange={e => setFrequency(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                >
                  <option value="daily">Daily Morning</option>
                  <option value="alternate">Alternate Days</option>
                  <option value="weekly">Weekly Once</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Morning Time Slot:</label>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
              >
                <option value="6:30 AM - 7:30 AM">6:30 AM - 7:30 AM (Early Milk)</option>
                <option value="7:30 AM - 8:30 AM">7:30 AM - 8:30 AM</option>
                <option value="5:00 PM - 6:00 PM">5:00 PM - 6:00 PM (Evening)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSub}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs"
              >
                Start Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
