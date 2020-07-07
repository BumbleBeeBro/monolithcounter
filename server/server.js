/* eslint-env node */
'use strict';
const express = require('express');
const fetch = require('node-fetch');
const {parse} = require('./node_modules/node-html-parser')
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;

const API_KEY =
  'eyJhbGciOiJIUzI1NiIsICJ0eXAiOiJKV1QifQ.eyJjdXN0b21lciI6Ik1vbm9saXRoTVMifQ.3zbHqLVUFKrq3fNRA86IYgV-Qg4h1XdauH_-_Z__h3o';
const BASE_URL = `https://www.boulderado.de/boulderadoweb/gym-clientcounter/index.php`;

/**
 * Gets the coutner from boulderado.
 *
 * @param {Request} req request object from Express.
 * @param {Response} resp response object from Express.
 */
function getCounter(req, resp) {
  const url = `${BASE_URL}?mode=get&token=${API_KEY}`;
  console.log('URL to fetch: ' + url);

  fetch(url)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      
      return res.text();
    }).then(text => {
      const root = parse(text)
      const free = root.querySelector('.freecounter-content').text;
      const occupied = root.querySelector('.actcounter-content').text;
      console.log();
      
      resp.json({free, occupied})
    })
    .catch((err) => {
      console.error('Dark Sky API Error:', err.message);
    });
}

/**
 * Starts the Express server.
 *
 * @return {ExpressServer} instance of the Express server.
 */
function startServer() {
  const app = express();

  // Redirect HTTP to HTTPS,
  app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

  // Logging for each request
  app.use((req, resp, next) => {
    const now = new Date();
    const time = `${now.toLocaleDateString()} - ${now.toLocaleTimeString()}`;
    const path = `"${req.method} ${req.path}"`;
    const m = `${req.ip} - ${time} - ${path}`;
    // eslint-disable-next-line no-console
    console.log(m);
    next();
  });

  // Handle requests for the data
  app.get('/counter', getCounter);
  app.get('/counter/', getCounter);


  // Handle requests for static files
  app.use(express.static('static'));

  // Start the server
  return app.listen('8080', () => {
    // eslint-disable-next-line no-console
    console.log('Local DevServer Started on port 8080...');
  });
}

startServer();
