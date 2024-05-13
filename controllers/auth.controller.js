const { connection } = require("../services/bd");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!email.trim() || !password.trim()) {
      return res.status(400).json({
        message: "Faltan datos",
        auth: false,
        token: null,
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "El correo electrónico no es válido",
        auth: false,
        token: null,
      });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: "El usuario no existe",
        auth: false,
        token: null,
      });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.CONTRASENA);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Contraseña incorrecta",
        auth: false,
        token: null,
      });
    }

    const token = generateToken(user);
    

    res.json({
      message: "Bienvenido",
      auth: true,
      token: token,
      rol: user.ID_ROL,
      
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error interno del servidor",
      auth: false,
      token: null,
    });
  }
};

async function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM USUARIO WHERE CORREO = ?`,
      [email],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0] || null);
        }
      }
    );
  });
}

function generateToken(user) {
  const token = jwt.sign(
    {
      id: user.ID_USUARIO,
      email: user.CORREO,
      nombre: user.NOMBRES,
      rol: user.ID_ROL,
    },
   "secret",
    { expiresIn: "24h" } // Expira en 24 horas
  );
  return token;
}


const authMiddleware = (req, res, next) => {
  const token = req.headers["x-access-token"];




  if (!token) {
    return res.status(401).json({
      message: "No hay token",
      auth: false,
      token: null,
    });
  }

  jwt.verify(token,"secret", (error, decoded) => {
    if (error) {
      return res.status(401).json({
        message: "Token inválido",
        auth: false,
        token: null,
      });
    }

    req.ID_USUARIO = decoded.ID_USUARIO;
    req.CORREO = decoded.CORREO;
    req.NOMBRES = decoded.NOMBRES;
    req.ID_ROL = decoded.ID_ROL;
    

    next();
  });
};

const logout = (req, res) => {
  const { token } = req.body;
  const decoded = jwt.verify(token, process.env.SECRET);

  if (!token) {
    res.status(401).json({
      message: "No hay token",
      auth: false,
      token: null,
    });
  }

  res.json({
    message: "Sesión cerrada",
    auth: false,
    token: null,
  });
};


const createUsers = async (req, res) => {
  const { nombre, apellido, email, id_rol } = req.body;

  const estado = 1;

  const numeros = "0123456789";
  const letrasMayusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const letrasMinusculas = "abcdefghijklmnopqrstuvwxyz";
  const simbolos = "!@#$%^&*()_+";

  let caracteres = "";
  let contraseña = "";
  let longitud = 14;

  caracteres += numeros.charAt(Math.floor(Math.random() * numeros.length));
  caracteres += letrasMayusculas.charAt(
    Math.floor(Math.random() * letrasMayusculas.length)
  );
  caracteres += letrasMinusculas.charAt(
    Math.floor(Math.random() * letrasMinusculas.length)
  );
  caracteres += simbolos.charAt(Math.floor(Math.random() * simbolos.length));

  for (let i = 0; i < longitud - 4; i++) {
    caracteres += numeros + letrasMayusculas + letrasMinusculas + simbolos;
    contraseña += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
  }

  const password = contraseña;
  let passwordHash = await bcryptjs.hash(password, 10);

  const emailregex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  if (
    !email.trim().length ||
    !password.trim().length ||
    !nombre.trim().length
  ) {
    res.json({
      message: "Faltan datos",
      auth: false,
      token: null,
    });
  } else if (!emailregex.test(email)) {
    res.json({
      message: "El correo electronico no es valido",
      auth: false,
      token: null,
    });
  } else {
    connection.query(
      "SELECT * FROM USUARIO WHERE CORREO = ?",
      [email],
      async (error, results) => {
        if (error) {
          console.log(error);
        } else {
          if (results.length > 0) {
            res.json({
              message: "Este usuario ya esta registrado",
              auth: false,
              token: null,
            });
          } else {
            connection.query(
              "INSERT INTO USUARIO SET ?",
              {
                NOMBRES: nombre,
                APELLIDOS: apellido,
                CORREO: email,
                CONTRASENA: passwordHash,
                ESTADO: estado,
                ID_ROL: id_rol,
              },
              async (error, results) => {
                if (error) {
                  console.log(error);
                  res.json({
                    message: "Hay un error en la base de datos, quiza sea un dato, revise por favor.",
                    auth: false,
                    token: null,
                  });
                } else {
                  res.json({
                    message: "Usuario Creado Correctamente",
                    auth: true,
                    password: password,
                    token: jwt.sign({ email: email }, process.env.SECRET || "secret", {
                      expiresIn: 60 * 60 * 24 * 30,
                    }),
                  });
                }
              }
            );
          }
        }
      }
    );
  }
};

module.exports = {
  login,
  logout,
  authMiddleware,
  createUsers,
};
