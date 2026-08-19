import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, QrCode, ArrowUpRight, ArrowDownLeft, Shield, Calendar, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const KhataLedgerView: React.FC = () => {
  const { khata, makeKhataPayment, activeStore } = useApp();
  const [showUPIModal, setShowUPIModal] = useState<boolean>(false);
  const [paymentInput, setPaymentInput] = useState<string>(khata.totalBalance.toString());
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const usedPercentage = Math.min(100, Math.round((khata.totalBalance / khata.creditLimit) * 100));

  const handleSettleSubmit = () => {
    const amt = parseFloat(paymentInput);
    if (!isNaN(amt) && amt > 0) {
      makeKhataPayment(amt, `UPI Settlement for ${activeStore.name}`);
      setPaymentSuccess(true);
      confetti({ particleCount: 60, spread: 80 });
      setTimeout(() => {
        setPaymentSuccess(false);
        setShowUPIModal(false);
      }, 1800);
    }
  };

  return (
    <div className="space-y-6">
      {/* Khata Banner Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <BookOpen className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-black text-white">Digital "Khata" Credit Book</h2>
                <p className="text-xs text-slate-400">
                  Store: <span className="text-amber-400 font-bold">{activeStore.name}</span> ({activeStore.ownerName})
                </p>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs text-slate-400">Total Outstanding Dues</div>
              <div className="text-3xl font-black text-emerald-400">₹{khata.totalBalance}</div>
            </div>
          </div>

          {/* Limit Bar & Settle Button */}
          <div className="space-y-3 min-w-[260px]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Approved Credit Limit:</span>
              <span className="font-bold text-white">₹{khata.creditLimit}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-500 ${
                  usedPercentage > 85
                    ? 'bg-red-500'
                    : usedPercentage > 60
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${usedPercentage}%` }}
              ></div>
            </div>
            <div className="text-[11px] text-right text-slate-400 font-semibold">
              {usedPercentage}% of limit utilized
            </div>

            <button
              onClick={() => {
                setPaymentInput(khata.totalBalance.toString());
                setShowUPIModal(true);
              }}
              disabled={khata.totalBalance <= 0}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
            >
              <QrCode className="w-4 h-4" />
              <span>Settle Dues via UPI / QR Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Itemized Khata Transaction Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
          <span>Itemized Past Bill Ledger</span>
          <span className="text-xs font-normal text-slate-400">({khata.entries.length} records)</span>
        </h3>

        <div className="space-y-3">
          {khata.entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    entry.type === 'debit'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {entry.type === 'debit' ? (
                    <ArrowUpRight className="w-5 h-5" />
                  ) : (
                    <ArrowDownLeft className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div className="font-bold text-white text-sm">{entry.description}</div>
                  {entry.itemsSummary && (
                    <div className="text-[11px] text-slate-400 mt-0.5">{entry.itemsSummary}</div>
                  )}
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>{entry.date}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`text-sm font-black ${
                    entry.type === 'debit' ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {entry.type === 'debit' ? '+' : '-'}₹{entry.amount}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Bal: ₹{entry.balanceAfter}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPI Payment Modal */}
      {showUPIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-slate-100 shadow-2xl relative text-center">
            <button
              onClick={() => setShowUPIModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-full text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black text-white mb-1">Settle Khata Bill via UPI</h3>
            <p className="text-xs text-slate-400 mb-4">Pay to {activeStore.name}</p>

            {paymentSuccess ? (
              <div className="py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <div className="text-base font-bold text-white">Payment Received!</div>
                <div className="text-xs text-emerald-400">Khata ledger updated instantly.</div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Generated Mock QR Code */}
                <div className="bg-white p-4 rounded-2xl inline-block shadow-inner mx-auto border-4 border-amber-500/50">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=gupta.kirana@upi%26pn=Gupta%20Ji%20Kirana%26am=${paymentInput}`}
                    alt="UPI QR Code"
                    className="w-36 h-36 mx-auto"
                  />
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  UPI ID: <span className="text-amber-400 font-bold">guptaji.kirana@okicici</span>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Settlement Amount (₹):</label>
                  <input
                    type="number"
                    value={paymentInput}
                    onChange={e => setPaymentInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-center text-emerald-400 font-black text-lg focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={handleSettleSubmit}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs shadow-lg"
                >
                  Simulate UPI Payment Success
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
