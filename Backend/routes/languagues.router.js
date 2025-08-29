const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const languaguesController = require('../controllers/languagues.controller')

router.use(authMiddleware);

router.get('/', languaguesController.showLanguagues);
router.get('/:id', languaguesController.userLanguagues);
router.post('/', languaguesController.enrollLanguague);
router.delete("/delete", languaguesController.quitLanguague);

module.exports = router;