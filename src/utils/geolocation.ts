export interface LocationCoords {
  lat: number;
  lng: number;
}

export const getCurrentPosition = (): Promise<LocationCoords> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const watchPosition = (
  onSuccess: (coords: LocationCoords) => void,
  onError: (error: GeolocationPositionError) => void
): number | null => {
  if (!navigator.geolocation) {
    onError({
      code: 0,
      message: 'Geolocation not supported',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    } as GeolocationPositionError);
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    onError,
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};

export const clearWatch = (watchId: number | null): void => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }
};
