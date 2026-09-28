import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  labelFor,
  yearsOfExperienceLabels,
} from "@/features/employees/utils/profile-labels";
import { RecommendationScore } from "@/features/recommendations/components/recommendation-score";

import { EmployeeRecommendation } from "../models/employee-recommendation";

type EmployeeRecommendationCardProps = {
  recommendation: EmployeeRecommendation;
  onViewProfile: () => void;
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-sm">{value}</dd>
  </div>
);

// El resumen del candidato viene embebido en la recomendación, así que la tarjeta no dispara
// ninguna consulta propia: el listado es útil aunque el empleador no abra ningún perfil. La
// consulta del perfil completo ocurre recién al abrir el panel.
//
// `CardTitle` renderiza un `div`: sin el rol explícito la tarjeta no tendría encabezado ni
// nombre accesible, igual que en el listado de puestos del empleador.
export const EmployeeRecommendationCard = ({
  recommendation,
  onViewProfile,
}: EmployeeRecommendationCardProps) => {
  const titleId = `employee-recommendation-${recommendation.recommendationId}-title`;

  return (
    <Card
      className="flex h-full flex-col"
      role="article"
      aria-labelledby={titleId}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle
              id={titleId}
              role="heading"
              aria-level={2}
              className="text-xl"
            >
              {recommendation.position}
            </CardTitle>
            <CardDescription>{recommendation.role}</CardDescription>
          </div>
          <RecommendationScore score={recommendation.score} />
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <dl className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Años de experiencia"
            value={labelFor(
              yearsOfExperienceLabels,
              recommendation.yearsOfExperience,
            )}
          />
          <div className="sm:col-span-2">
            <Field
              label="Certificaciones"
              value={
                recommendation.certifications.length > 0
                  ? recommendation.certifications.join(", ")
                  : "Sin certificaciones"
              }
            />
          </div>
        </dl>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" onClick={onViewProfile}>
          Ver perfil
        </Button>
      </CardFooter>
    </Card>
  );
};
