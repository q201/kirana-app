import React, { useState } from 'react';
import { Server, Database, Zap, Cpu, Layers, ShieldCheck, Globe, MapPin, Radio, Bell } from 'lucide-react';
import { IdempotencySimulator } from './IdempotencySimulator';
import { GeofenceSimulator } from './GeofenceSimulator';

export const SystemArchitectureView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'blueprint' | 'idempotency' | 'geofence'>('blueprint');

  return (
    <div className="space-y-6">
      {/* Blueprint Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Server className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-white">System Architecture & Technical Highlights</h2>
          </div>
          <p className="text-xs text-slate-400">
            Production-grade backend patterns designed for low network connectivity, high trust, and hyper-local multi-tenant routing.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('blueprint')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'blueprint'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Backend Blueprint
          </button>
          <button
            onClick={() => setActiveSubTab('idempotency')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'idempotency'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Idempotency Simulator
          </button>
          <button
            onClick={() => setActiveSubTab('geofence')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'geofence'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            PostGIS Geofence Router
          </button>
        </div>
      </div>

      {activeSubTab === 'blueprint' ? (
        <div className="space-y-6">
          {/* Tech Stack Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-blue-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-white">NestJS Core Backend</h3>
              <p className="text-xs text-slate-400">
                Modular TypeScript framework with dependency injection, guards, interceptors, and robust DTO validation.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-blue-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-white">PostgreSQL + PostGIS</h3>
              <p className="text-xs text-slate-400">
                Spatial polygon boundaries (`ST_DWithin`) for 1.5km store geofencing and instant multi-tenant routing.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-blue-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-black text-sm text-white">Redis & BullMQ Queues</h3>
              <p className="text-xs text-slate-400">
                Async background processing for voice STT transcription, push notifications, and daily 6:30 AM subscriptions.
              </p>
            </div>
          </div>

          {/* Architecture Visual Diagram */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>End-to-End Microservice Flow & Data Architecture</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-xs font-mono">
              {/* Layer 1: Client Inputs */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  <span>CLIENT LAYER</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  🎙️ Voice Note Audio (.mp3)
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  📸 Handwritten Photo (.jpg)
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  🔑 X-Idempotency-Key Header
                </div>
              </div>

              {/* Layer 2: API Gateway & Guards */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="font-bold text-blue-400 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>NESTJS GATEWAY</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  ⚡ IdempotencyGuard (Redis)
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  📍 PostGIS Spatial Router
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  🌐 WebSocket Order Gateway
                </div>
              </div>

              {/* Layer 3: Async Queue & AI Services */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                  <Radio className="w-4 h-4" />
                  <span>BULLMQ QUEUE</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  🤖 STT Audio Transcriber
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  🖼️ OCR Neural Vision Parser
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  ⏰ 6:30 AM Subscription Cron
                </div>
              </div>

              {/* Layer 4: Storage & Ledger */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                  <Database className="w-4 h-4" />
                  <span>PERSISTENCE LAYER</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  🗄️ PostgreSQL (Khata Books)
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  🗺️ PostGIS (Geofence Polygons)
                </div>
                <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  ☁️ S3 / Supabase Media Store
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeSubTab === 'idempotency' ? (
        <IdempotencySimulator />
      ) : (
        <GeofenceSimulator />
      )}
    </div>
  );
};
