import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  requiredEducationLevelLabels,
  requiredExperienceLabels,
} from "@/features/job-positions/forms/job-position/options";

import { JobRecommendation } from "../models/job-recommendation";
import { RecommendationScore } from "@/features/recommendations/components/recommendation-score";

type JobRecommendationDetailSheetProps = {
  recommendation: JobRecommendation | null;
  onClose: () => void;
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-sm">{value}</dd>
  </div>
);

const formatPublishedAt = (publishedAt: string) => {
  const date = new Date(publishedAt);
  return Number.isNaN(date.getTime())
    ? publishedAt
    : date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
};

// El detalle se compone con los campos que la recomendación ya trajo: no hay endpoint de
// puesto legible por el empleado, y tampoco hace falta. Abrirlo y cerrarlo no emite ninguna
// petición, y el tramo que la lista está mostrando queda intacto porque el panel vive fuera
// del estado de paginación.
export const JobRecommendationDetailSheet = ({
  recommendation,
  onClose,
}: JobRecommendationDetailSheetProps) => (
  <Sheet
    open={recommendation !== null}
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
  >
    <SheetContent className="overflow-y-auto sm:max-w-lg">
      {recommendation ? (
        <>
          <SheetHeader>
            <SheetTitle>{recommendation.position}</SheetTitle>
            <SheetDescription>{recommendation.role}</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <RecommendationScore score={recommendation.score} />
            <dl className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Experiencia requerida"
                value={
                  requiredExperienceLabels[recommendation.requiredExperience]
                }
              />
              <Field
                label="Nivel educativo pretendido"
                value={
                  requiredEducationLevelLabels[
                    recommendation.requiredEducationLevel
                  ]
                }
              />
              <Field
                label="Horas disponibles por día"
                value={String(recommendation.availableHoursPerDay)}
              />
              <Field label="Zona horaria" value={recommendation.timezone} />
              <div className="sm:col-span-2">
                <Field
                  label="Recursos técnicos"
                  value={
                    recommendation.technicalResources.length > 0
                      ? recommendation.technicalResources.join(", ")
                      : "Sin recursos técnicos"
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Publicado"
                  value={formatPublishedAt(recommendation.publishedAt)}
                />
              </div>
            </dl>
          </div>
        </>
      ) : null}
    </SheetContent>
  </Sheet>
);
