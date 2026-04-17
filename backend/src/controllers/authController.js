// Importamos el modelo User para buscar y crear usuarios en MongoDB
import User from "../models/User.js";

// Importamos bcrypt para encriptar y comparar contraseñas
import bcrypt from "bcryptjs";

// Importamos jwt para generar tokens de sesión
import jwt from "jsonwebtoken";

// ==========================================
// FUNCIÓN DE REGISTRO
// ==========================================
// Esta función se ejecuta cuando alguien hace POST /api/auth/registro
export const registro = async (req, res) => {
  try {
    // req.body contiene los datos que mandó el usuario
    // Extraemos nombre, email y password de esos datos
    const { nombre, email, password } = req.body;

    // Buscamos en MongoDB si ya existe un usuario con ese email
    const usuarioExiste = await User.findOne({ email });

    // Si ya existe, devolvemos error 400 (Bad Request)
    if (usuarioExiste) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Encriptamos la contraseña antes de guardarla en MongoDB
    // genSalt(10) genera una cadena aleatoria para hacer la encriptación más segura
    // 10 es el nivel de seguridad - entre más alto, más seguro pero más lento
    const salt = await bcrypt.genSalt(10);

    // hash() mezcla la contraseña con el salt y la encripta
    // Resultado: "123456" → "$2a$10$xyz..." (no se puede revertir)
    const passwordHash = await bcrypt.hash(password, salt);

    // Creamos el usuario en MongoDB con la contraseña ya encriptada
    const usuario = await User.create({
      nombre,
      email,
      password: passwordHash, // guardamos la contraseña encriptada, NUNCA la original
    });

    // Generamos un token JWT para que el usuario pueda
    // hacer peticiones sin tener que loguearse cada vez
    // El token contiene el id y rol del usuario
    // JWT_SECRET es la clave secreta del .env para firmar el token
    // expiresIn: "24h" → el token expira en 24 horas
    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Devolvemos el token y los datos del usuario
    // status(201) significa "creado exitosamente"
    res.status(201).json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    // Si algo salió mal, devolvemos error 500 (error del servidor)
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// FUNCIÓN DE LOGIN
// ==========================================
// Esta función se ejecuta cuando alguien hace POST /api/auth/login
export const login = async (req, res) => {
  try {
    // Extraemos email y password de los datos que mandó el usuario
    const { email, password } = req.body;

    // Buscamos en MongoDB si existe un usuario con ese email
    const usuario = await User.findOne({ email });

    // Si NO existe el usuario, devolvemos error
    // Nota: decimos "Email o contraseña incorrectos" en vez de
    // "Email no existe" por seguridad, para no dar pistas
    if (!usuario) {
      return res.status(400).json({ message: "Email o contraseña incorrectos" });
    }

    // Comparamos la contraseña que escribió el usuario
    // con la contraseña encriptada que está en MongoDB
    // bcrypt.compare() hace la comparación de forma segura
    const passwordValido = await bcrypt.compare(password, usuario.password);

    // Si la contraseña no coincide, devolvemos error
    if (!passwordValido) {
      return res.status(400).json({ message: "Email o contraseña incorrectos" });
    }

    // Si todo está bien, generamos un nuevo token JWT
    const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Devolvemos el token y los datos del usuario
    res.json({
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    // Si algo salió mal, devolvemos error 500
    res.status(500).json({ message: error.message });
  }
};
