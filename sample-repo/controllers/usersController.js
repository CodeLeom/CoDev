/**
 * Users controller: list and fetch users
 */

const usersService = require('../services/usersService');

async function list(req, res) {
  try {
    const users = await usersService.list();
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to list users' });
  }
}

async function getById(req, res) {
  const { id } = req.params;
  try {
    const user = await usersService.getById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to fetch user' });
  }
}

module.exports = { list, getById };
