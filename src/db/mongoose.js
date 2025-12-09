


// src/db/mongoose.js
const mongoose = require('mongoose');
const config = require('../config');
// db.users.find().pretty()

async function connect() {
  try {
    // connect with default / supported options only
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // optionally exit if DB is critical for your app
    // process.exit(1);
    throw err;
  }
}

async function disconnect() {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (err) {
    console.error('Error during MongoDB disconnect:', err);
  }
}

module.exports = { connect, disconnect };

