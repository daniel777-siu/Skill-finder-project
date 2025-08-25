const express = require('express');
const router = express.Router();
const teamsController = require ('../controllers/teams.controller');


router.get('/', teamsController.getTeams);
router.get('/:id', teamsController.getTeam);

module.exports = router;