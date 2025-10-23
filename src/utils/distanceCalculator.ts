import { getDistance } from 'geolib';
import type { LocationCoords } from './geolocation';

export const calculateDistance = (from: LocationCoords, to: LocationCoords): number => {
  return getDistance(
    { latitude: from.lat, longitude: from.lng },
    { latitude: to.lat, longitude: to.lng }
  );
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m away`;
  }
  return `${(meters / 1000).toFixed(1)}km away`;
};
