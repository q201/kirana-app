import React from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { Bike, UserCheck, X, Phone, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DeliveryAssignmentModalProps {
  order: Order | null;
  onClose: () => void;
}

export const DeliveryAssignmentModal: React.FC<DeliveryAssignmentModalProps> = ({
  order,
  onClose
}) => {
  const { deliveryBoys, assignDeliveryBoy } = useApp();

  if (!order) return null;

  const handleAssign = (deliveryBoyId: string) => {
    assignDeliveryBoy(order.id, deliveryBoyId);
    confetti({ particleCount: 50, spread: 70 });
    onClose();
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in cursor-pointer">
      <div onClick={(e) => e.stopPropagation()} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl relative space-y-4 cursor-default">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bike className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-black text-white">Assign Local Helper for {order.id}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Select shop assistant or delivery kid to deliver order to <span className="text-white font-bold">{order.customerName}</span>
        </p>

        <div className="space-y-3">
          {deliveryBoys.map((boy) => (
            <div
              key={boy.id}
              className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs hover:border-amber-500/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={boy.avatar}
                  alt={boy.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-800"
                />
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{boy.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({boy.vehicle})</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>{boy.phone}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleAssign(boy.id)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Assign</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
