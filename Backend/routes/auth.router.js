const express = require('express')
const router = express.Router();
const authController = require ('../controllers/auth.controller');
const { loginUser } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/authMiddleware");


router.post("/login", authController.loginUser);


router.use(authMiddleware);

router.get('/me', (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;