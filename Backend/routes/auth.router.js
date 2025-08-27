const express = require('express')
const router = express.Router();
const authController = require ('../controllers/auth.controller');
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require('../middlewares/roleMiddleware');


router.post("/login", authController.loginUser);


router.use(authMiddleware);

router.post("/register", requireRole('admin'),authController.registerUser);

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.json({ message: "Sesión cerrada correctamente" });
});


module.exports = router;