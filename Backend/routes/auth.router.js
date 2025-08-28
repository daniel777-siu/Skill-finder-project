const express = require('express')
const router = express.Router();
const authController = require ('../controllers/auth.controller');
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require('../middlewares/roleMiddleware');


router.post("/login", authController.loginUser);


router.use(authMiddleware);
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role
  });
});

router.post("/register", requireRole('admin'), authController.registerUser);

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.json({ message: "Sesión cerrada correctamente" });
});


module.exports = router;