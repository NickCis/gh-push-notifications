import { useState, useEffect } from 'react';
import { messaging } from './firebase';

export function useToken() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let canceled = false;

    messaging.requestPermission()
      .then(() => messaging.getToken())
      .then(token => canceled || setToken(token))
      .catch(error => canceled || setError(error))

    return () => (canceled = true);
  }, []);

  return [token, error];
}
