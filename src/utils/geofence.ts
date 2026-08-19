import { KiranaStore } from '../types';

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

export interface GeofenceResult {
  store: KiranaStore;
  distanceKm: number;
  isWithinGeofence: boolean;
  postGISQueryExecuted: string;
}

export function routeUserToStores(
  userLat: number,
  userLng: number,
  stores: KiranaStore[]
): GeofenceResult[] {
  return stores.map(store => {
    const dist = calculateHaversineDistance(userLat, userLng, store.lat, store.lng);
    const isWithin = dist <= store.radiusKm;
    
    // PostGIS Query simulation string
    const query = `SELECT id, name, ST_Distance(store_geom, ST_MakePoint(${userLng}, ${userLat})::geography) / 1000 AS dist_km FROM stores WHERE ST_DWithin(store_geom, ST_MakePoint(${userLng}, ${userLat})::geography, ${store.radiusKm * 1000});`;

    return {
      store,
      distanceKm: dist,
      isWithinGeofence: isWithin,
      postGISQueryExecuted: query
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}
