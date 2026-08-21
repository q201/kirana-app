import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bike,
  Navigation,
  Clock,
  Phone,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  X,
  MapPin,
  ShieldCheck,
  Zap,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveDeliveryTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Waypoint {
  x: number;
  y: number;
  label: string;
}

const ROUTE_WAYPOINTS: Waypoint[] = [
  { x: 50, y: 160, label: 'Gupta Kirana Store' },
  { x: 130, y: 90, label: 'Gali No. 2 Corner' },
  { x: 220, y: 140, label: 'Mohalla Community Park' },
  { x: 310, y: 70, label: 'Sarita Vihar Main Lane' },
  { x: 410, y: 130, label: 'House #42 (Destination)' }
];

export const LiveDeliveryTrackingModal: React.FC<LiveDeliveryTrackingModalProps> = ({
  isOpen,
  onClose
}) => {
  const { activeStore, deliveryBoys, orders } = useApp();

  const [progress, setProgress] = useState<number>(0.25);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [isDelivered, setIsDelivered] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Active delivery partner or default
  const activeDriver = deliveryBoys[0];
  const activeOrder = orders.find(o => o.status === 'dispatched' || o.status === 'preparing') || orders[0];

  // Route animation loop
  useEffect(() => {
    if (!isOpen || !isPlaying || isDelivered) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 0.005 * simSpeed;
        if (next >= 1) {
          setIsDelivered(true);
          setIsPlaying(false);
          confetti({ particleCount: 80, spread: 80 });
          return 1;
        }
        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, simSpeed, isDelivered]);

  // Canvas Map Renderer
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let step = 0;
    const renderMap = () => {
      step += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Map Grid Background
      ctx.strokeStyle = '#1e293b'; // slate-800
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Draw Mohalla Blocks / Buildings
      ctx.fillStyle = '#0f172a'; // slate-900
      ctx.fillRect(80, 20, 100, 50);
      ctx.fillRect(240, 20, 120, 40);
      ctx.fillRect(100, 170, 110, 40);
      ctx.fillRect(260, 160, 100, 50);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(80, 20, 100, 50);
      ctx.strokeRect(240, 20, 120, 40);
      ctx.strokeRect(100, 170, 110, 40);
      ctx.strokeRect(260, 160, 100, 50);

      // Building text labels
      ctx.fillStyle = '#64748b';
      ctx.font = '9px sans-serif';
      ctx.fillText('Pocket B Colony', 95, 48);
      ctx.fillText('Community Center', 255, 42);

      // 3. Draw Neon Glowing Delivery Route Path
      ctx.beginPath();
      ctx.moveTo(ROUTE_WAYPOINTS[0].x, ROUTE_WAYPOINTS[0].y);
      for (let i = 1; i < ROUTE_WAYPOINTS.length; i++) {
        ctx.lineTo(ROUTE_WAYPOINTS[i].x, ROUTE_WAYPOINTS[i].y);
      }
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'; // glowing emerald
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 4. Draw Waypoint Pins
      ROUTE_WAYPOINTS.forEach((pt, idx) => {
        ctx.fillStyle = idx === 0 ? '#f59e0b' : idx === ROUTE_WAYPOINTS.length - 1 ? '#f43f5e' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Pin Label
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 9px sans-serif';
        if (idx === 0 || idx === ROUTE_WAYPOINTS.length - 1) {
          ctx.fillText(pt.label, pt.x - 35, pt.y + 16);
        }
      });

      // 5. Calculate Current Scooter Marker Position along Path
      const totalSegments = ROUTE_WAYPOINTS.length - 1;
      const segmentIndex = Math.min(
        totalSegments - 1,
        Math.floor(progress * totalSegments)
      );
      const segmentProgress = (progress * totalSegments) - segmentIndex;

      const p1 = ROUTE_WAYPOINTS[segmentIndex];
      const p2 = ROUTE_WAYPOINTS[segmentIndex + 1];

      const currentX = p1.x + (p2.x - p1.x) * segmentProgress;
      const currentY = p1.y + (p2.y - p1.y) * segmentProgress;

      // Draw Radar Pulse Rings around Rider Location
      const ringRadius = 8 + Math.abs(Math.sin(step) * 12);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(currentX, currentY, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw Scooter Marker Circle
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(currentX, currentY, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('🛵', currentX - 6, currentY + 4);

      animationFrameRef.current = requestAnimationFrame(renderMap);
    };

    renderMap();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, progress]);

  if (!isOpen) return null;

  const etaMinutes = Math.max(0, Math.ceil((1 - progress) * 6));
  const etaSeconds = Math.max(0, Math.floor(((1 - progress) * 360) % 60));
  const distanceRemaining = Math.max(0, Math.round((1 - progress) * 650));

  const handleResetRoute = () => {
    setProgress(0.05);
    setIsDelivered(false);
    setIsPlaying(true);
  };

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in cursor-pointer">
      <div onClick={(e) => e.stopPropagation()} className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-slate-100 shadow-2xl relative overflow-hidden cursor-default">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <span>Live Delivery GPS Tracker</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>Real-Time Telemetry</span>
                </span>
              </h2>
              <p className="text-xs text-slate-400">Track delivery partner moving through Mohalla lanes</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Map Canvas Area */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 mb-4 relative overflow-hidden">
          <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-800 text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Route: {activeStore.name} → House #42, Sarita Vihar</span>
            </span>

            {/* Sim Speed Toggles */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-500 mr-1">Sim Speed:</span>
              {[1, 2, 5].map(spd => (
                <button
                  key={spd}
                  onClick={() => setSimSpeed(spd)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    simSpeed === spd ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full h-48 rounded-xl overflow-hidden border border-slate-800">
            <canvas
              ref={canvasRef}
              width={460}
              height={200}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Animation Play/Pause & Reset Controls */}
          <div className="flex items-center justify-between pt-2 px-2 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg border border-slate-800 flex items-center gap-1 text-[11px] font-bold"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-400" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetRoute}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg border border-slate-800 text-[11px] flex items-center gap-1"
                title="Restart route simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-play</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-400 font-medium italic">
              Traffic: Clear Mohalla Lane • Scooter Speed 24 km/h
            </span>
          </div>
        </div>

        {/* Live Telemetry & ETA Stats Bar */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Est. Arrival</span>
            </div>
            <div className="text-xl font-black text-amber-400 mt-1">
              {isDelivered ? 'Arrived!' : `${etaMinutes}m ${etaSeconds}s`}
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <Navigation className="w-3 h-3 text-emerald-400" />
              <span>Distance Left</span>
            </div>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {isDelivered ? '0 meters' : `${distanceRemaining} m`}
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>OTP Verify</span>
            </div>
            <div className="text-xl font-black text-blue-400 mt-1">
              #4291
            </div>
          </div>
        </div>

        {/* Delivery Partner Details & Contact Actions */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={activeDriver.avatar}
              alt={activeDriver.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-700"
            />
            <div>
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span>{activeDriver.name}</span>
                <span className="text-[10px] bg-slate-800 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  {activeDriver.vehicle}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Assigned Neighborhood Delivery Partner</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${activeDriver.phone}`}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Rider</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
