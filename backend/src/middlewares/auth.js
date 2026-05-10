// Importamos jwt para verificar los tokens
import jwt from "jsonwebtoken";

// MIDDLEWARE PARA VERIFICAR EL TOKEN

// Este middleware se ejecuta ANTES de entrar a rutas privadas
// Es como un guardia que pide el carnet antes de dejar entrar
export const verificarToken = (req, res, next) => {
  // Leemos el token del header "Authorization"
  // El header llega asi: "Bearer eyJhbGci..."
  // .split(" ")[1] separa por espacio y toma la segunda parte
  // que es el token sin la palabra "Bearer"
  // El "?" significa que si no existe el header, no da error
  const token = req.headers.authorization?.split(" ")[1];

  // Si no hay token, bloqueamos la peticion
  // status(401) significa "No autorizado"
  if (!token) {
    return res.status(401).json({ message: "No hay token" });
  }

  try {
    // Verificamos que el token sea valido y no haya expirado
    // jwt.verify() usa el JWT_SECRET del .env para verificarlo
    // Si el token es valido, devuelve los datos que guardamos
    // cuando lo creamos: id , rol
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos los datos del usuario en req.usuario
    // Asi los controladores pueden saber quien esta logueado
    // Ejemplo: req.usuario.id, req.usuario.rol
    req.usuario = decoded;

    // next() le dice a Express que puede continuar
    // a la siguiente función (el controlador)
    next();
  } catch (error) {
    // Si el token es invalido o expiro, bloqueamos la peticion
    res.status(401).json({ message: "Token inválido" });
  }
};

// MIDDLEWARE PARA VERIFICAR SI ES ADMIN

// Este middleware se usa DESPUES de verificarToken
// Solo deja pasar a usuarios con rol "admin"
export const verificarAdmin = (req, res, next) => {
  // Revisamos el rol del usuario que viene en req.usuario
  // (lo pusimos ahi en verificarToken)
  if (req.usuario.rol !== "admin") {
    // Si NO es admin, bloqueamos con error el 403 que es prhibido
    return res.status(403).json({ message: "No tienes permisos" });
  }

  // Si ES admin, dejamos continuar
  next();
};
