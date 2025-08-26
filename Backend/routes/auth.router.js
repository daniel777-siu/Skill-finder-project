const express = require('express')
const router = express.Router();
const authController = require ('../controllers/auth.controller');
const { loginUser } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/authMiddleware");


router.post("/login", authController.loginUser);


router.use(authMiddleware);

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.json({ message: "Sesión cerrada correctamente" });
});


module.exports = router;