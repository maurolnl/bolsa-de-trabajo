export type WeightType = "KILOGRAM" | "GRAM" | "MILLILITER" | "LITER" | "UNIT";

export const weightTypes = [
  "KILOGRAM",
  "GRAM",
  "LITER",
  "MILLILITER",
  "UNIT",
] as const;

export type WeightTypeLabel =
  | "Kilogramo (kg)"
  | "Gramo (g)"
  | "Mililitro (ml)"
  | "Litro (l)"
  | "Unidad (uds)";

export const weightTypeOptions: {
  value: WeightType;
  label: WeightTypeLabel;
}[] = [
  { value: "KILOGRAM", label: "Kilogramo (kg)" },
  { value: "GRAM", label: "Gramo (g)" },
  { value: "LITER", label: "Litro (l)" },
  { value: "MILLILITER", label: "Mililitro (ml)" },
  { value: "UNIT", label: "Unidad (uds)" },
];
export type Ingredient = {
  id: number;
  name: string;
  brand: string;
  description: string | null;
  weight_type: WeightType;
  buy_quantity: number;
  buy_price: number;
  unit_price: number;
  used_quantity: number | null;
};
