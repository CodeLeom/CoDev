/**
 * Auth controller: handles login and register logic
 */

const authService = require('../services/authService');

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }
  try {
    const token = await authService.authenticate(email, password);
    return res.json({ token, user: { email } });
  } catch (err) {
    return res.status(401).json({ error: err.message || 'Invalid credentials' });
  }
}

async function register(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }
  try {
    const user = await authService.createUser({ email, password, name });
    const token = await authService.issueToken(user);
    return res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Registration failed' });
  }
}

module.exports = { login, register };
