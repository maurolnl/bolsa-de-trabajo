import { Plus, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useIngredientsQuery } from "@/api/Ingredient/ingredientRepository";
import { TypographyH1 } from "@/components/ui/typography/typography-h1";
import { TypographyP } from "@/components/ui/typography/typography-p";
import { PATHS } from "@/router/paths";
import {
  getTotalValue,
  getAveragePrice,
  getMostCommonBrand,
} from "@/features/ingredients/utils/metrics";
import { weightTypeOptions } from "../models/Ingredient";

export default function IngredientsPage() {
  const { data: ingredients } = useIngredientsQuery();

  const totalIngredients = ingredients?.length || 0;
  const totalValue = getTotalValue(ingredients);
  const averagePrice = getAveragePrice(ingredients);
  const mostCommonBrand = getMostCommonBrand(ingredients);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <TypographyH1>Ingredientes</TypographyH1>
        <TypographyP variant="muted">
          Administra tus ingredientes, rastrea cantidades y monitorea costos.
        </TypographyP>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Ingredientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIngredients}</div>
            <TypographyP variant="muted" className="text-xs">
              Ingredientes en inventario
            </TypographyP>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Valor total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <TypographyP variant="muted" className="text-xs">
              Costo del inventario
            </TypographyP>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Promedio de precio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averagePrice.toFixed(2)}</div>
            <TypographyP variant="muted" className="text-xs">
              por unidad
            </TypographyP>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Marca más común
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostCommonBrand}</div>
            <TypographyP variant="muted" className="text-xs">
              proveedor más común
            </TypographyP>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Lista de ingredientes</h2>
          <p className="text-sm text-muted-foreground">
            Ver y gestionar todos tus ingredientes
          </p>
        </div>
        <Button asChild>
          <Link to={PATHS.main.ingredients.create}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar ingrediente
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
          <div className="col-span-3">Nombre</div>
          <div className="col-span-2">Marca</div>
          <div className="col-span-3">Descripción</div>
          <div className="col-span-2">Cantidad</div>
          <div className="col-span-1">Precio por unidad</div>
          <div className="col-span-1"></div>
        </div>
        <div className="divide-y">
          {ingredients.map((ingredient) => (
            <div
              key={ingredient.id}
              className="grid grid-cols-12 gap-4 p-4 items-center"
            >
              <div className="col-span-3 font-medium">{ingredient.name}</div>
              <div className="col-span-2">
                <Badge variant="outline">{ingredient.brand}</Badge>
              </div>
              <div className="col-span-3 text-sm text-muted-foreground truncate">
                {ingredient.description}
              </div>
              <div className="col-span-2">
                {ingredient.buy_quantity.toFixed(2)}{" "}
                {
                  weightTypeOptions.find(
                    (option) => option.value === ingredient.weight_type
                  )?.label
                }
              </div>
              <div className="col-span-1">
                ${ingredient.unit_price?.toFixed(2)}
              </div>
              <div className="col-span-1 flex justify-end">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/ingredients/${ingredient.id}`}>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">View details</span>
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
