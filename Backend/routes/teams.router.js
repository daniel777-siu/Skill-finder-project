const express = require('express');
const router = express.Router();
const teamsController = require ('../controllers/teams.controller');
const authMiddleware = require('../middlewares/authMiddleware');


router.use(authMiddleware);

router.get('/teams', teamsController.getTeams);
router.get('/teams/:id', teamsController.getTeam);

module.exports = router;