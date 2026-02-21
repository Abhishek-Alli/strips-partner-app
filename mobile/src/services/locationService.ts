/**
 * Location Service (Mobile)
 *
 * Wraps backend /api/location endpoints:
 *  - geocodeAddress   → POST /location/geocode
 *  - reverseGeocode   → POST /location/reverse-geocode
 *  - getNearbyDealers → GET  /location/nearby-dealers
 */

import { apiClient } from './apiClient';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeocodedLocation extends LatLng {
  formattedAddress: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export interface NearbyDealer {
  id: string;
  userId: string;
  businessName: string;
  name: string;
  address?: string;
  lat: number;
  lng: number;
  distanceKm: number;
  avatar?: string;
  category?: string;
}

class LocationService {
  async geocodeAddress(address: string): Promise<{ location: GeocodedLocation }> {
    return apiClient.post<{ location: GeocodedLocation }>('/location/geocode', { address });
  }

  async reverseGeocode(lat: number, lng: number): Promise<{ location: GeocodedLocation }> {
    return apiClient.post<{ location: GeocodedLocation }>('/location/reverse-geocode', {
      lat,
      lng,
    });
  }

  async getNearbyDealers(
    lat: number,
    lng: number,
    radiusKm = 10,
    limit = 20,
  ): Promise<{ dealers: NearbyDealer[] }> {
    return apiClient.get<{ dealers: NearbyDealer[] }>('/location/nearby-dealers', {
      params: { lat, lng, radius: radiusKm, limit },
    });
  }
}

export const locationService = new LocationService();
