import React, { useMemo, useState } from 'react';
import { useToken } from './firebase';
import useSend from './useSend';

function App() {
  const [device, errorDevice] = useToken();
  const [gh, setGh] = useState('');
  const [send, loading, response, errorSend] = useSend({
    device,
    gh,
  });
  const handleSubmit = useMemo(() =>
    ev => {
      ev.preventDefault();
      send();
    },
    [device, gh]
  );
  const handleChange = useMemo(() =>
    ev => setGh(ev.target.value),
    [setGh]
  );

  if (errorDevice) {
    return (
      <div>
        Error: {errorDevice.toString()}
      </div>
    );
  }

  if (!device) {
    return (
      <div>
        Please accept permissions!
      </div>
    );

  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        onChange={handleChange}
        value={gh}
        placeholder="Github Application Token"
      />
      <button>Send</button>
    </form>
  );
}

export default App;
