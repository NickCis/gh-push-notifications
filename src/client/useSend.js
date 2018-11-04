import { useState, useMemo } from 'react';

function useSend({ device, gh }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const send = useMemo(() =>
    () => {
      if (loading)
        return;

      setLoading(true);
      fetch('/token', {
        method: 'POST',
        body: JSON.stringify({
          device,
          gh,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(json => setResponse(json))
        .catch(e => setError(e))
        .then(() => setLoading(false));
    },
    [device, gh]
  );

  return [send, loading, response, error];
}

export default useSend;
