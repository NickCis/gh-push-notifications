import React from 'react';
import express from 'express';
import firebase from './firebase';
import { Tokens } from './firebase/collections';
import './poller';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR));

if (process.env.NODE_ENV !== 'production') {
  const devServer = 'http://localhost:3001';
  const proxy = require('express-http-proxy');

  server
    .use('/dev-proxy', proxy(devServer))
    .get('/firebase-messaging-sw.js', (req, res) => {
      require('http')
        .get(`${devServer}/firebase-messaging-sw.js`, resp => {
          res
            .status(resp.statusCode)
            .set(resp.headers);

          resp.on('data', chunk => res.send(chunk));
          resp.on('end', () => res.end());
        });
    });
}

server
  .post('/token', express.json(), (req, res) => {
    if (!req.body.device || !req.body.gh)
      return res
        .status(400)
        .json({ error: 'Invalid data' });

    firebase
      .firestore()
      .collection(Tokens)
      .doc(req.body.device)
      .set({
        device: req.body.device,
        gh: req.body.gh,
      })
      .then(() => res.json({ ok: true }))
      .catch(e => {
        console.error('Unexpected error', e);
        res
          .status(500)
          .json({ error: 'Unexpected error' });
      });
  })
  .get('/*', (req, res) => {
    res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        }
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>`
    );
  });

export default server;
