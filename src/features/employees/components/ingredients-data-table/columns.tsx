import { TypographyP } from "@/components/ui/typography/typography-p";
import { Ingredient, weightTypeOptions } from "../../models/Ingredient";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Ingredient>[] = [
  {
    header: "Nombre",
    accessorKey: "name",
    cell: ({ row }) => {
      return (
        <TypographyP className="font-semibold">{row.original.name}</TypographyP>
      );
    },
  },
  {
    header: "Marca",
    accessorKey: "brand",
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.brand}</Badge>;
    },
  },
  {
    header: "Descripción",
    accessorKey: "description",
    cell: ({ row }) => {
      return (
        <TypographyP variant="muted" className="truncate">
          {row.original.description}
        </TypographyP>
      );
    },
  },
  {
    header: "Cantidad comprada",
    accessorKey: "buy_quantity",
    cell: ({ row }) => {
      return (
        <TypographyP>
          {row.original.buy_quantity.toFixed(2)}{" "}
          {
            weightTypeOptions.find(
              (option) => option.value === row.original.weight_type
            )?.label
          }
        </TypographyP>
      );
    },
  },
  {
    header: "Precio unitario",
    accessorKey: "unit_price",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("unit_price"));
      const formatted = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <TypographyP>${formatted}</TypographyP>;
    },
  },
  {
    header: "Acciones",
    accessorKey: "actions",
    cell: ({ row }) => {
      const ingredient = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem>Editar</DropdownMenuItem>
            <DropdownMenuItem>Eliminar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
