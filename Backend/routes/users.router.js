const express = require('express');
const router = express.Router();
const usersController = require ('../controllers/users.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Listar/obtener usuarios: cualquier autenticado puede ver perfiles (sin password)
router.get('/users', usersController.getUsers);
router.get('/users/:id', usersController.getUser);

// Crear usuarios: solo admin
router.post('/', requireRole('admin'), usersController.createUser);

module.exports = router;