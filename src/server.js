


// src/server.js
const http = require('http');
const app = require('./app');
const config = require('./config');
const db = require('./db/mongoose');

const server = http.createServer(app);

async function start() {
  try {
    await db.connect();
    server.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}


start();

process.on('SIGINT', async () => {
  console.log('SIGINT received — shutting down...');
  server.close(async () => {
    await db.disconnect();
    process.exit(0);
  });
});
