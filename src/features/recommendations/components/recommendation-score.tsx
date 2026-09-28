import { Badge } from "@/components/ui/badge";

// El puntaje se muestra únicamente cuando la API lo mandó con un valor. Mientras el
// algoritmo de indicadores no exista, `score` llega nulo en todos los puestos y acá no se
// renderiza nada: ni un cero, ni un "sin puntaje", ni una posición derivada del orden.
// Cualquiera de esas tres cosas sería una afinidad que nadie calculó.
//
// El valor se presenta tal como llegó, sin reescalarlo a porcentaje: el contrato de scoring
// todavía no fija un rango, así que multiplicar por cien sería inventar la escala además
// del número.
export const RecommendationScore = ({ score }: { score: number | null }) => {
  if (score === null) return null;

  return (
    <Badge variant="secondary" className="shrink-0">
      Afinidad {score}
    </Badge>
  );
};
