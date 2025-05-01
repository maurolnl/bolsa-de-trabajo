"use client";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PATHS } from "@/router/paths";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { newIngredientSchema } from "./schema";
import { weightTypeOptions } from "../../models/Ingredient";

export type IngredientFormValues = z.infer<typeof newIngredientSchema>;

type NewIngredientFormProps = {
  onSubmit: (data: IngredientFormValues) => Promise<void>;
  defaultValues?: Partial<IngredientFormValues>;
};

export function NewIngredientForm({
  onSubmit,
  defaultValues = {},
}: NewIngredientFormProps) {
  const form = useForm<z.infer<typeof newIngredientSchema>>({
    resolver: zodResolver(newIngredientSchema),
    defaultValues: {
      name: "",
      brand: "",
      description: "",
      weight_type: "KILOGRAM",
      buy_price: "",
      buy_quantity: "",
      ...defaultValues,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles del Ingrediente</CardTitle>
        <CardDescription>
          Ingresa los detalles del nuevo ingrediente para añadir a tu
          inventario.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa nombre del ingrediente"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa nombre de la marca"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingresa una descripción"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Peso/Medida</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de medida" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {weightTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="buy_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad Comprada</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buy_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de Compra</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Precio por la cantidad comprada
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link to={PATHS.main.ingredients.list}>Cancelar</Link>
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Guardando..."
                : "Guardar Ingrediente"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
