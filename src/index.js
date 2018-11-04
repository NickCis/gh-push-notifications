import app from './server';
import fs from 'fs';
import http from 'http';
import https from 'https';

const server = process.env.NODE_ENV === 'production'
  ? http.createServer(app)
  : https.createServer({
    key: fs.readFileSync('./localhost.key.pem'),
    cert: fs.readFileSync('./localhost.crt'),
  }, app);

let currentApp = app;

server.listen(process.env.PORT || 3000, error => {
  if (error) {
    console.log(error);
  }

  console.log('🚀 started');
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    server.removeListener('request', currentApp);
    const newApp = require('./server').default;
    server.on('request', newApp);
    currentApp = newApp;
  });
}
