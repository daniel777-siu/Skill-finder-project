const express = require('express');
const router = express.Router();
const usersController = require ('../controllers/users.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUser);

module.exports = router;