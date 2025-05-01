"use client";

import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PATHS } from "@/router/paths";
import { TypographyH2 } from "@/components/ui/typography/typography-h2";
import {
  NewIngredientForm,
  IngredientFormValues,
} from "../forms/new-ingredient/new-ingredient-form";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { useCreateIngredientMutation } from "@/api/Ingredient/ingredientRepository";
import { WeightType } from "../models/Ingredient";

export default function CreateIngredientPage() {
  const { mutateAsync: createIngredient } = useCreateIngredientMutation();
  const navigate = useNavigate();
  const handleSubmit = async (data: IngredientFormValues) => {
    await createIngredient({
      ...data,
      weight_type: data.weight_type as WeightType,
      buy_price: Number(data.buy_price),
      buy_quantity: Number(data.buy_quantity),
    });
    navigate(PATHS.main.ingredients.list);
    toast({
      title: "Ingrediente creado",
      description: "El ingrediente ha sido creado correctamente",
    });
  };
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to={PATHS.main.ingredients.list}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Atrás</span>
          </Link>
        </Button>
        <TypographyH2 className="text-2xl font-bold tracking-tight">
          Nuevo Ingrediente
        </TypographyH2>
      </div>

      <NewIngredientForm onSubmit={handleSubmit} />
    </div>
  );
}
