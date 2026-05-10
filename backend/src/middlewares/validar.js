// Middleware genérico para validar datos con Zod
export const validar = (schema) => (req, res, next) => {
  try {
    // Validamos el body de la peticion con el esquema Zod
    schema.parse(req.body);
    // Si pasa la validacion, continuamos
    next();
  } catch (error) {
    // Si falla, devolvemos los errores de validacion
    res.status(400).json({
      message: "Error de validación",
      errores: error.errors.map((e) => e.message),
    });
  }
};
