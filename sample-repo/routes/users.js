/**
 * User management routes
 * Protected by auth middleware
 */

const express = require('express');
const usersController = require('../controllers/usersController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// GET /api/users - list users
router.get('/', usersController.list);

// GET /api/users/:id - get user by id
router.get('/:id', usersController.getById);

module.exports = router;
