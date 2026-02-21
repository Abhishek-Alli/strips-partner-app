/**
 * Location Controller
 *
 * Geocoding, reverse-geocoding, and nearby dealer search
 */

import { query } from '../config/database.js';
import { geocodeAddress, reverseGeocode, haversineDistance } from '../services/geocoding.service.js';

const logger = {
  error: (msg, e) => console.error(`[location] ${msg}`, e),
};

/**
 * POST /api/location/geocode
 * Body: { address }
 */
export const geocode = async (req, res) => {
  try {
    const { address } = req.body;
    if (!address?.trim()) return res.status(400).json({ error: 'address is required' });

    const result = await geocodeAddress(address);
    res.json(result);
  } catch (error) {
    logger.error('Geocode error:', error);
    res.status(500).json({ error: error.message || 'Geocoding failed' });
  }
};

/**
 * POST /api/location/reverse-geocode
 * Body: { lat, lng }
 */
export const reverseGeocodeHandler = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ error: 'lat and lng are required' });
    }
    const result = await reverseGeocode(parseFloat(lat), parseFloat(lng));
    res.json(result);
  } catch (error) {
    logger.error('Reverse geocode error:', error);
    res.status(500).json({ error: error.message || 'Reverse geocoding failed' });
  }
};

/**
 * GET /api/location/nearby-dealers?lat=&lng=&radius=&limit=
 * Returns dealers within radius km, ordered by distance
 */
export const nearbyDealers = async (req, res) => {
  try {
    const { lat, lng, radius = 20, limit = 50 } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng are required' });

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const radiusKm = parseFloat(radius);

    // Use Haversine formula in SQL (PostgreSQL)
    const sql = `
      SELECT
        p.id, p.user_id, p.business_name, p.location_name,
        p.latitude, p.longitude, p.phone, p.avatar_url,
        u.name, u.email,
        (
          6371 * acos(
            LEAST(1.0,
              cos(radians($1)) * cos(radians(p.latitude))
              * cos(radians(p.longitude) - radians($2))
              + sin(radians($1)) * sin(radians(p.latitude))
            )
          )
        ) AS distance_km
      FROM profiles p
      JOIN users u ON u.id = p.user_id
      WHERE
        u.role = 'DEALER'
        AND p.latitude IS NOT NULL
        AND p.longitude IS NOT NULL
        AND p.is_active = true
      HAVING (
          6371 * acos(
            LEAST(1.0,
              cos(radians($1)) * cos(radians(p.latitude))
              * cos(radians(p.longitude) - radians($2))
              + sin(radians($1)) * sin(radians(p.latitude))
            )
          )
        ) <= $3
      ORDER BY distance_km ASC
      LIMIT $4
    `;

    const result = await query(sql, [userLat, userLng, radiusKm, parseInt(limit)]);

    const dealers = result.rows.map(row => ({
      id:           row.id,
      userId:       row.user_id,
      name:         row.business_name || row.name,
      location:     row.location_name,
      latitude:     parseFloat(row.latitude),
      longitude:    parseFloat(row.longitude),
      phone:        row.phone,
      avatarUrl:    row.avatar_url,
      distanceKm:   Math.round(parseFloat(row.distance_km) * 10) / 10,
    }));

    res.json({ dealers, count: dealers.length });
  } catch (error) {
    logger.error('Nearby dealers error:', error);
    res.status(500).json({ error: 'Failed to find nearby dealers' });
  }
};
