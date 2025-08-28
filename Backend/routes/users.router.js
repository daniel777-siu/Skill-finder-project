const express = require('express');
const router = express.Router();
const usersController = require ('../controllers/users.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Listar/obtener usuarios: cualquier autenticado puede ver perfiles (sin password)
router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUser);
router.put('/:id', usersController.updateCoders);
router.put('/password/:id', usersController.changePassword);
router.get('/teams/:id', usersController.showUserTeams);
// Crear usuarios: solo admin
router.put('/admin/:id', requireRole('admin'), usersController.updateAdmin);
router.delete('/:id',requireRole('admin'), usersController.deleteUser);


module.exports = router;