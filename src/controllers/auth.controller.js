


const authService = require('../services/auth.service');

async function register(req, res, next) {
  try {
    // If you want to prevent users setting role themselves, remove role from req.body here
    const user = await authService.register(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.json(result); // { token: "..." }
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
