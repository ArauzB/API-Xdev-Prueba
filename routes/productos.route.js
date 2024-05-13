const express = require("express");
const router = express();

const {
  createProducto,
  editProducto,
  getAllProducto,
  deleteProducto,
  getProducto
} = require("../controllers/productos.controller");

router.post("/createProducto", createProducto);
router.post("/editProducto", editProducto);
router.get("/getAllProducto", getAllProducto);
router.post("/deleteProducto", deleteProducto);
router.post("/getProducto", getProducto);
module.exports = router;
