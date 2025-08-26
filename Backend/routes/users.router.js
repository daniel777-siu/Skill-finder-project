const express = require('express');
const router = express.Router();
const usersController = require ('../controllers/users.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/users', usersController.getUsers);
router.get('/users/:id', usersController.getUser);

module.exports = router;