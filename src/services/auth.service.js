
///


const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

async function register({ name, email, password, role }) {
  const exists = await User.findOne({ email });
  if (exists) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, 10);
  // NOTE: role is accepted if provided; in production, enforce assignment server-side
  const user = await User.create({
    name,
    email,
    password: hashed,
    role: role || 'user'
  });

  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const err = new Error('Invalid email or password');
    err.status = 401;
    throw err;
  }

  const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role });
  return { token };
}

module.exports = { register, login };
