const express = require('express');
const router = express.Router();
const teamsController = require ('../controllers/teams.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// Solo admin puede acceder
router.get('/', requireRole('admin'), teamsController.getTeams);
router.get('/:id', requireRole('admin'), teamsController.getTeam);

module.exports = router;