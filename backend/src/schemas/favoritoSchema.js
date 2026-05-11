import { z } from "zod";

// Esquema de validacion para agregar un favorito
export const favoritoSchema = z.object({
  // Ciudad: obligatoria, minimo 2 caracteres
  ciudad: z
    .string({ required_error: "La ciudad es obligatoria" })
    .min(2, "El nombre de la ciudad debe tener mínimo 2 caracteres")
    .max(100, "El nombre de la ciudad es demasiado largo"),
});
