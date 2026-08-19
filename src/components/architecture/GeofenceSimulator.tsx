import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Navigation, Database, ShieldCheck, Store, Compass } from 'lucide-react';

export const GeofenceSimulator: React.FC = () => {
  const { userLat, userLng, setUserLocation, geofenceResults, activeStore, setActiveStore } = useApp();

  const [radiusSlider, setRadiusSlider] = useState<number>(1.5);

  // Preset location options in Sarita Vihar neighborhood
  const sampleLocations = [
    { label: 'Pocket B, Lane 3 (Inside 0.4km)', lat: 28.5292, lng: 77.2910 },
    { label: 'Sector 4 Corner (1.2km away)', lat: 28.5380, lng: 77.3020 },
    { label: 'Outside Boundary (3.2km away)', lat: 28.5600, lng: 77.3300 }
  ];

  return (
    <div className="space-y-6">
      {/* Geofence Controls Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-black text-white">PostGIS Hyper-Local Geofenced Multi-Tenant Router</h3>
        </div>
        <p className="text-xs text-slate-400">
          In a Mohalla delivery model, stores should only serve neighborhood households within their strict 1.5 km PostGIS polygon radius.
        </p>

        {/* Location Presets */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <label className="text-xs text-slate-400 font-bold block">Simulate Household GPS Coordinates:</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sampleLocations.map((loc, idx) => (
              <button
                key={idx}
                onClick={() => setUserLocation(loc.lat, loc.lng)}
                className={`p-3 rounded-xl border text-xs text-left transition-all ${
                  userLat === loc.lat && userLng === loc.lng
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="font-bold text-white mb-0.5">{loc.label}</div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {loc.lat}, {loc.lng}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Store Distance & PostGIS Query Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {geofenceResults.map(({ store, distanceKm, isWithinGeofence, postGISQueryExecuted }) => (
          <div
            key={store.id}
            className={`bg-slate-900 border-2 rounded-2xl p-4 space-y-3 transition-all ${
              store.id === activeStore.id
                ? 'border-blue-500 shadow-xl'
                : isWithinGeofence
                ? 'border-slate-800 hover:border-slate-700'
                : 'border-red-500/30 opacity-70'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-black text-sm text-white">{store.name}</h4>
                <div className="text-xs text-slate-400">{store.address}</div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                  isWithinGeofence
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}
              >
                {isWithinGeofence ? 'IN RANGE' : 'OUT OF BOUNDS'}
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Calculated Distance:</span>
                <span className="font-bold text-amber-400">{distanceKm} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Max Geofence Limit:</span>
                <span className="font-bold text-slate-300">{store.radiusKm} km</span>
              </div>
            </div>

            {/* Simulated PostGIS Spatial SQL */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 overflow-x-auto">
              <div className="text-blue-400 font-bold mb-1">// PostGIS Spatial Query:</div>
              <code className="text-emerald-300">{postGISQueryExecuted}</code>
            </div>

            {isWithinGeofence && (
              <button
                onClick={() => setActiveStore(store)}
                className={`w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs ${
                  store.id === activeStore.id ? 'bg-emerald-600 hover:bg-emerald-500' : ''
                }`}
              >
                {store.id === activeStore.id ? '✓ Selected Active Store' : 'Route Orders to Store'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
