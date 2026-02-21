/**
 * Geocoding Service
 *
 * Wraps Google Geocoding API via Node https module.
 * Falls back to a stub when GOOGLE_MAPS_API_KEY is not set.
 */

import https from 'https';

const MAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

/**
 * Convert an address string to lat/lng
 * @returns {{ lat: number, lng: number, formattedAddress: string }}
 */
export async function geocodeAddress(address) {
  if (!MAPS_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY is not configured');
  }
  const encoded = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encoded}&key=${MAPS_KEY}`;
  const data = await httpsGet(url);

  if (data.status !== 'OK' || !data.results?.length) {
    throw new Error(`Geocoding failed: ${data.status}`);
  }
  const result = data.results[0];
  return {
    lat:              result.geometry.location.lat,
    lng:              result.geometry.location.lng,
    formattedAddress: result.formatted_address,
  };
}

/**
 * Convert lat/lng to a human-readable address
 * @returns {{ address: string }}
 */
export async function reverseGeocode(lat, lng) {
  if (!MAPS_KEY) {
    throw new Error('GOOGLE_MAPS_API_KEY is not configured');
  }
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_KEY}`;
  const data = await httpsGet(url);

  if (data.status !== 'OK' || !data.results?.length) {
    throw new Error(`Reverse geocoding failed: ${data.status}`);
  }
  return { address: data.results[0].formatted_address };
}

/**
 * Haversine distance in km between two coordinates
 */
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
