import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { JobPosition } from "../models/job-position";
import {
  requiredEducationLevelLabels,
  requiredExperienceLabels,
} from "../forms/job-position/options";

type JobPositionPublishedProps = {
  jobPosition: JobPosition;
  onCreateAnother: () => void;
  onGoToJobs: () => void;
};

export const JobPositionPublished = ({
  jobPosition,
  onCreateAnother,
  onGoToJobs,
}: JobPositionPublishedProps) => (
  <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center py-8">
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <Badge variant="success" className="w-fit">
          Publicado
        </Badge>
        <CardTitle className="text-2xl">{jobPosition.position}</CardTitle>
        <CardDescription>
          El puesto quedó publicado y ya es visible para la búsqueda de
          candidatos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Rol</dt>
            <dd>{jobPosition.role}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">
              Experiencia requerida
            </dt>
            <dd>{requiredExperienceLabels[jobPosition.requiredExperience]}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">
              Nivel educativo pretendido
            </dt>
            <dd>
              {requiredEducationLevelLabels[jobPosition.requiredEducationLevel]}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">
              Horas disponibles por día
            </dt>
            <dd>{jobPosition.availableHoursPerDay}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Zona horaria</dt>
            <dd>{jobPosition.timezone}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Recursos técnicos</dt>
            <dd>
              {jobPosition.technicalResources.length > 0
                ? jobPosition.technicalResources.join(", ")
                : "Sin recursos técnicos"}
            </dd>
          </div>
        </dl>
        <Separator />
        <section className="space-y-1">
          <h2 className="text-sm font-medium">Recomendaciones</h2>
          <p className="text-sm text-muted-foreground">
            Todavía no hay candidatos recomendados para este puesto. Las
            recomendaciones se calculan de forma diferida y estarán disponibles
            más adelante.
          </p>
        </section>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" onClick={onCreateAnother}>
          Publicar otro puesto
        </Button>
        <Button onClick={onGoToJobs}>Ir a mis puestos</Button>
      </CardFooter>
    </Card>
  </div>
);
