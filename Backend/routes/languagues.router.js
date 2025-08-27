const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const languaguesController = require('../controllers/languagues.controller')

router.use(authMiddleware);

router.get('/languagues', languaguesController.showLanguagues);
router.get('languagues/:id', languaguesController.userLanguagues);
router.post('/languagues', languaguesController.enrollLanguague);

module.exports = router;