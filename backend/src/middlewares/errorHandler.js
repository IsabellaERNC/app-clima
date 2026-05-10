// Middleware global para manejar errores
// Se ejecuta cuando algo falla en cualquier parte del backend
const errorHandler = (err, req, res, next) => {
  // Mostramos el error en consola para debugging
  console.error("Error:", err.message);

  // Error de validacion de Mongoose (datos incorrectos)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Error de validación",
      errores: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Error de duplicado en MongoDB (email ya existe)
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Este email ya está registrado",
    });
  }

  // Error de token JWT invalido
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Token inválido",
    });
  }

  // Error de token JWT expirado
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token expirado, inicia sesión de nuevo",
    });
  }

  // Error generico del servidor
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
  });
};

export default errorHandler;
