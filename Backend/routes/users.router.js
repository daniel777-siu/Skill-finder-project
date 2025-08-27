const express = require('express');
const router = express.Router();
const usersController = require ('../controllers/users.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Listar/obtener usuarios: cualquier autenticado puede ver perfiles (sin password)
router.get('/users', usersController.getUsers);
router.get('/users/:id', usersController.getUser);
router.put('/users/:id', usersController.updateCoders);
router.put('/users/password/:id', usersController.changePassword)
// Crear usuarios: solo admin
router.put('/user/:id', requireRole('admin'), usersController.updateAdmin);

module.exports = router;