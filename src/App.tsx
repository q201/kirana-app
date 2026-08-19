import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ProductCatalog } from './components/household/ProductCatalog';
import { VoiceOrderModal } from './components/household/VoiceOrderModal';
import { PhotoOrderModal } from './components/household/PhotoOrderModal';
import { CartAndCheckoutModal } from './components/household/CartAndCheckoutModal';
import { KhataLedgerView } from './components/household/KhataLedgerView';
import { SubscriptionsView } from './components/household/SubscriptionsView';
import { StoreDashboard } from './components/storeowner/StoreDashboard';
import { ThermalReceiptModal } from './components/storeowner/ThermalReceiptModal';
import { DeliveryAssignmentModal } from './components/storeowner/DeliveryAssignmentModal';
import { SystemArchitectureView } from './components/architecture/SystemArchitectureView';
import { LiveDeliveryTrackingModal } from './components/household/LiveDeliveryTrackingModal';
import { Order } from './types';
import { Mic, Camera, BookOpen, RefreshCw, Sparkles, Store, ShieldCheck, ArrowRight, HeartHandshake, Navigation } from 'lucide-react';

const MainContent: React.FC = () => {
  const { viewMode, setViewMode, activeStore, khata } = useApp();

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState<boolean>(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState<boolean>(false);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [selectedAssignmentOrder, setSelectedAssignmentOrder] = useState<Order | null>(null);

  const [homemakerSection, setHomemakerSection] = useState<'catalog' | 'khata' | 'subscriptions'>('catalog');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 pb-16">
      {/* Top Navbar */}
      <Navbar
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
        onOpenCartModal={() => setIsCartModalOpen(true)}
        onOpenTrackingModal={() => setIsTrackingModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {viewMode === 'homemaker' && (
          <div className="space-y-6">
            {/* Hero Quick Ordering Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Hyper-Local Mohalla Delivery • Win on Trust & Khata</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  No Need to Type! <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                    Send Voice Note or Photo List
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300">
                  Order daily groceries from your neighborhood store (<span className="text-amber-300 font-bold">{activeStore.name}</span>). Pay at month-end using Digital Khata or instant UPI.
                </p>

                {/* Main Action Shortcuts */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="py-3 px-5 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-rose-900/30 hover:scale-105 transition-all"
                  >
                    <Mic className="w-4 h-4 animate-pulse" />
                    <span>Quick Voice Order ("5kg aata, 1L doodh...")</span>
                  </button>

                  <button
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black rounded-2xl text-xs flex items-center gap-2 border border-slate-700 hover:scale-105 transition-all"
                  >
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>Upload Handwritten List Photo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Homemaker Sub-navigation Bar */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setHomemakerSection('catalog')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  homemakerSection === 'catalog'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                Store Catalog
              </button>

              <button
                onClick={() => setHomemakerSection('khata')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  homemakerSection === 'khata'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Digital Khata Ledger (₹{khata.totalBalance})</span>
              </button>

              <button
                onClick={() => setHomemakerSection('subscriptions')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  homemakerSection === 'subscriptions'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Daily Essentials Subscriptions</span>
              </button>
            </div>

            {/* Render Selected Homemaker Section */}
            {homemakerSection === 'catalog' && <ProductCatalog />}
            {homemakerSection === 'khata' && <KhataLedgerView />}
            {homemakerSection === 'subscriptions' && <SubscriptionsView />}
          </div>
        )}

        {/* Kirana Uncle Dashboard View */}
        {viewMode === 'storeowner' && (
          <StoreDashboard
            onOpenReceipt={(ord) => setSelectedReceiptOrder(ord)}
            onOpenDeliveryAssignment={(ord) => setSelectedAssignmentOrder(ord)}
          />
        )}

        {/* Backend System Architecture & Simulators View */}
        {viewMode === 'architecture' && <SystemArchitectureView />}
      </main>

      {/* Global Modals */}
      <VoiceOrderModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onOpenCartModal={() => setIsCartModalOpen(true)}
      />

      <PhotoOrderModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onOpenCartModal={() => setIsCartModalOpen(true)}
      />

      <CartAndCheckoutModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
      />

      <ThermalReceiptModal
        order={selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
      />

      <DeliveryAssignmentModal
        order={selectedAssignmentOrder}
        onClose={() => setSelectedAssignmentOrder(null)}
      />

      <LiveDeliveryTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
