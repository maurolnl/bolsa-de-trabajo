import { httpClient } from "@/core/services/httpClient";
import {
  Ingredient,
  WeightType,
} from "@/features/ingredients/models/Ingredient";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

type CreateIngredientRequest = {
  name: string;
  brand: string;
  description: string | null;
  weight_type: WeightType;
  buy_price: number;
  buy_quantity: number;
};

type IngredientResponse = {
  id: number;
  name: string;
  brand: string;
  description: string | null;
  weight_type: WeightType;
  buy_price: number;
  buy_quantity: number;
};

const getIngredientMapper = (ingredient: IngredientResponse): Ingredient => ({
  ...ingredient,
  unit_price: ingredient.buy_price / ingredient.buy_quantity,
  buy_price: Number(ingredient.buy_price),
  buy_quantity: Number(ingredient.buy_quantity),
  used_quantity: null,
});

export class IngredientRepository {
  keys = {
    ingredient: (id: number) => ["ingredient", id],
    ingredients: () => ["ingredients"],
  };

  async getIngredient(id: number) {
    return await httpClient.get<Ingredient>(`/ingredients/${id}`);
  }

  async getIngredients() {
    const { data } = await httpClient.get<Ingredient[]>("/ingredients");

    return data.map(getIngredientMapper);
  }

  async createIngredient(data: CreateIngredientRequest) {
    return await httpClient.post<Ingredient>("/ingredients", data);
  }
}

const repo = new IngredientRepository();

export const useIngredientQuery = (id: number) =>
  useQuery({
    queryKey: repo.keys.ingredient(id),
    queryFn: () => repo.getIngredient(id),
  });

export const useIngredientsQuery = () =>
  useSuspenseQuery({
    queryKey: repo.keys.ingredients(),
    queryFn: () => repo.getIngredients(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });

export const useCreateIngredientMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIngredientRequest) => repo.createIngredient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: repo.keys.ingredients() });
    },
  });
};
