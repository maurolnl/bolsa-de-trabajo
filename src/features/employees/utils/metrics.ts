import { Ingredient } from "../models/Ingredient";

export const getTotalValue = (ingredients: Ingredient[]) =>
  ingredients.reduce(
    (sum, item) => sum + item.buy_quantity * item.unit_price,
    0
  );
export const getAveragePrice = (ingredients: Ingredient[]) =>
  getTotalValue(ingredients) / ingredients.length;

export const getBrandCounts = (ingredients: Ingredient[]) =>
  ingredients.reduce((acc, item) => {
    acc[item.brand] = (acc[item.brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

export const getMostCommonBrand = (ingredients: Ingredient[]) =>
  Object.entries(getBrandCounts(ingredients)).sort((a, b) => b[1] - a[1])[0][0];
