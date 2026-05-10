import { z } from "zod";

// Esquema de validacion para el registro
export const registroSchema = z.object({
  // Nombre: minimo 2 caracteres, maximo 50
  nombre: z
    .string({ required_error: "El nombre es obligatorio" })
    .min(2, "El nombre debe tener mínimo 2 caracteres")
    .max(50, "El nombre debe tener máximo 50 caracteres"),

  // Email: debe tener formato valido
  email: z
    .string({ required_error: "El email es obligatorio" })
    .email("El email no tiene un formato válido"),

  // Contraseña: minimo 6 caracteres
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(6, "La contraseña debe tener mínimo 6 caracteres"),
});

// Esquema de validacion para el login
export const loginSchema = z.object({
  // Email: debe tener formato valido
  email: z
    .string({ required_error: "El email es obligatorio" })
    .email("El email no tiene un formato válido"),

  // Contraseña: obligatoria
  password: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(1, "La contraseña es obligatoria"),
});
