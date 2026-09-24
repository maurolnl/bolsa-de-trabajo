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
  requiredEducationLevelLabels,
  requiredExperienceLabels,
} from "@/features/job-positions/forms/job-position/options";

import { JobRecommendation } from "../models/job-recommendation";
import { RecommendationScore } from "./recommendation-score";

type JobRecommendationCardProps = {
  recommendation: JobRecommendation;
  onViewDetail: () => void;
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-sm">{value}</dd>
  </div>
);

// Todos los datos del puesto vienen embebidos en la recomendación, así que la tarjeta no
// dispara ninguna consulta propia. El detalle tampoco: la lectura de un puesto individual
// está reservada a su empleador y una sesión `employee` recibiría 403.
//
// `CardTitle` renderiza un `div`: sin el rol explícito la tarjeta no tendría encabezado ni
// nombre accesible, igual que en el listado de puestos del empleador.
export const JobRecommendationCard = ({
  recommendation,
  onViewDetail,
}: JobRecommendationCardProps) => {
  const titleId = `job-recommendation-${recommendation.recommendationId}-title`;

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
            label="Experiencia requerida"
            value={requiredExperienceLabels[recommendation.requiredExperience]}
          />
          <Field
            label="Nivel educativo pretendido"
            value={
              requiredEducationLevelLabels[
                recommendation.requiredEducationLevel
              ]
            }
          />
        </dl>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" onClick={onViewDetail}>
          Ver detalle
        </Button>
      </CardFooter>
    </Card>
  );
};
