const { connection } = require("../services/bd");

const createProducto = async (req, res) => {
  const { nombre, descripcion, precio, fecha } = req.body;
  estado = 1;

  if (!nombre.trim().length) {
    res.json({
      message: "Faltan datos",
    });
  } else {
    connection.query(
      "INSERT INTO PRODUCTO SET ?",
      {
        NOMBRE: nombre,
        DESCRIPCION: descripcion,
        PRECIO: precio,
        FECHA: fecha,
        ESTADO: estado,
      },
      async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.json({
            message: "Producto creado correctamente",
          });
        }
      }
    );
  }
};

const getAllProducto = async (req, res) => {
  connection.query("SELECT * FROM PRODUCTO", async (error, results) => {
    if (error) {
      console.log(error);
    } else {
      res.json(results);
    }
  });
};

const deleteProducto = async (req, res) => {
  const { id } = req.body;
  estado = 0;

  connection.query(
    "UPDATE PRODUCTO SET ? WHERE ID_PRODUCTO = ?",
    [
      {
        ESTADO: estado,
      },
      id,
    ],
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.json({
          message: "Producto eliminado correctamente",
        });
      }
    }
  );
};

const getProducto = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res
      .status(400)
      .json({ error: "ID_PRODUCTO no proporcionado en la solicitud" });
  }

  connection.query(
    "SELECT * FROM PRODUCTO WHERE ID_PRODUCTO = ?",
    [id],
    async (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Error al obtener el producto" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      res.json(results);
    }
  );
};

const editProducto = async (req, res) => {
  const { id, nombre, descripcion, precio, fecha } = req.body;

  if (!nombre.trim().length || !descripcion.trim().length) {
    res.json({
      message: "Faltan datos",
    });
  } else {
    connection.query(
      "UPDATE PRODUCTO SET ? WHERE ID_PRODUCTO = ?",
      [
        {
          NOMBRE: nombre,
          DESCRIPCION: descripcion,
          PRECIO: precio,
          FECHA: fecha,
        },
        id,
      ],
      async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          res.json({
            message: "Producto editado correctamente",
          });
        }
      }
    );
  }
};

module.exports = {
  createProducto,
  editProducto,
  getAllProducto,
  deleteProducto,
  getProducto,
};
