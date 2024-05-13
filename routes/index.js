const express = require("express");
const router = express();

const auth = require("./auth.route");
const productos = require("./productos.route");

router.use("/auth", auth);
router.use("/productos", productos);

module.exports = router;
