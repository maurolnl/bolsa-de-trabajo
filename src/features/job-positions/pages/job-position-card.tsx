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
} from "../forms/job-position/options";
import { JobPosition } from "../models/job-position";

type JobPositionCardProps = {
  jobPosition: JobPosition;
  onEdit: () => void;
  onDelete: () => void;
  onViewCandidates: () => void;
  isDeleting: boolean;
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-sm">{value}</dd>
  </div>
);

// `CardTitle` renderiza un `div`: sin el rol explícito la card no tendría ni encabezado
// ni nombre accesible, y el listado quedaría como un bloque plano de texto.
export const JobPositionCard = ({
  jobPosition,
  onEdit,
  onDelete,
  onViewCandidates,
  isDeleting,
}: JobPositionCardProps) => {
  const titleId = `job-position-${jobPosition.id}-title`;

  return (
  <Card
    className="flex h-full flex-col"
    role="article"
    aria-labelledby={titleId}
  >
    <CardHeader>
      <CardTitle id={titleId} role="heading" aria-level={2} className="text-xl">
        {jobPosition.position}
      </CardTitle>
      <CardDescription>{jobPosition.role}</CardDescription>
    </CardHeader>
    <CardContent className="flex-1">
      <dl className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Experiencia requerida"
          value={requiredExperienceLabels[jobPosition.requiredExperience]}
        />
        <Field
          label="Nivel educativo pretendido"
          value={
            requiredEducationLevelLabels[jobPosition.requiredEducationLevel]
          }
        />
        <Field
          label="Horas disponibles por día"
          value={String(jobPosition.availableHoursPerDay)}
        />
        <Field label="Zona horaria" value={jobPosition.timezone} />
        <div className="sm:col-span-2">
          <Field
            label="Recursos técnicos"
            value={
              jobPosition.technicalResources.length > 0
                ? jobPosition.technicalResources.join(", ")
                : "Sin recursos técnicos"
            }
          />
        </div>
      </dl>
    </CardContent>
    <CardFooter className="flex flex-wrap justify-end gap-2">
      <Button variant="ghost" onClick={onViewCandidates}>
        Ver candidatos
      </Button>
      <Button variant="outline" onClick={onEdit}>
        Editar
      </Button>
      <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
        {isDeleting ? "Eliminando..." : "Eliminar"}
      </Button>
    </CardFooter>
  </Card>
  );
};
