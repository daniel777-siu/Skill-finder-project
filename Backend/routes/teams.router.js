const express = require('express');
const router = express.Router();
const teamsController = require ('../controllers/teams.controller');
const authMiddleware = require('../middlewares/authMiddleware');


router.use(authMiddleware);

router.get('/', teamsController.getTeams);
router.get('/:id', teamsController.getTeam);
router.post('/join', teamsController.joinTeam);
router.post('/', teamsController.createTeam);
router.put('/:id', teamsController.updateTeam);
router.delete('/:id', teamsController.deleteTeam);
router.get('/users/:id', teamsController.showTeamUsers);


module.exports = router;