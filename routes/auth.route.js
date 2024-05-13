const express = require("express");
const router = express();

const {
  login,
  logout,
  authMiddleware,
  createUsers,
} = require("../controllers/auth.controller");

router.post("/login", login);
router.get("/verify", authMiddleware, (req, res) => {
  res.json({ message: "Ruta protegida accesible" });
});
router.post("/logout", logout);
router.post("/createUsers", createUsers);

module.exports = router;
