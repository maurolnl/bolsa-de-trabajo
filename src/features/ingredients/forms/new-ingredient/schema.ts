import { z } from "zod";
import { weightTypes } from "@/features/ingredients/models/Ingredient";
export const newIngredientSchema = z.object({
  name: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(100, { message: "El nombre debe tener como máximo 100 caracteres" }),
  brand: z
    .string()
    .min(3, { message: "La marca debe tener al menos 3 caracteres" })
    .max(500, { message: "La marca debe tener como máximo 500 caracteres" }),
  description: z
    .string()
    .min(3, { message: "La descripción debe tener al menos 3 caracteres" })
    .max(500, {
      message: "La descripción debe tener como máximo 500 caracteres",
    }),
  weight_type: z.enum(weightTypes),
  buy_price: z
    .string()
    .min(1, { message: "El precio de compra debe ser mayor que 0" }),
  buy_quantity: z
    .string()
    .min(1, { message: "La cantidad de compra debe ser mayor que 0" }),
});
