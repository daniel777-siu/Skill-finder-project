const express = require('express');
const router = express.Router();
const usersController = require ('../controllers/teams.controller');


router.get('/', usersController.getTeams);
router.get('/:id', usersController.getTeam);

module.exports = router;