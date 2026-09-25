import { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { EmployeeProfile } from "@/features/employees/models/employee-profile";
import {
  educationStatusProfileLabels,
  educationTypeProfileLabels,
  internetConnectionSpeedLabels,
  internetConnectionTypeLabels,
  labelFor,
  yearsOfExperienceLabels,
} from "@/features/employees/utils/profile-labels";

import { useCandidateFileDownload } from "../hooks/use-candidate-file-download";
import {
  isForbiddenCandidateProfileError,
  useCandidateProfile,
} from "../hooks/use-candidate-profile";
import { EmployeeRecommendation } from "../models/employee-recommendation";

type CandidateProfileSheetProps = {
  candidate: EmployeeRecommendation | null;
  onClose: () => void;
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-sm">{value}</dd>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="space-y-3">
    <h3 className="text-sm font-semibold">{title}</h3>
    {children}
  </section>
);

const optionalCount = (count: number | null) =>
  count === null ? "Sin informar" : String(count);

// El panel vive fuera del estado de paginación del listado: abrirlo y cerrarlo no cambia el
// tramo visible ni reinicia el sondeo de candidatos. La consulta del perfil se habilita con
// el candidato seleccionado, así que cerrar el panel tampoco emite ninguna petición.
export const CandidateProfileSheet = ({
  candidate,
  onClose,
}: CandidateProfileSheetProps) => (
  <Sheet
    open={candidate !== null}
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
  >
    <SheetContent className="overflow-y-auto sm:max-w-xl">
      {candidate ? (
        <>
          <SheetHeader>
            <SheetTitle>{candidate.position}</SheetTitle>
            <SheetDescription>{candidate.role}</SheetDescription>
          </SheetHeader>
          <CandidateProfileBody candidate={candidate} />
        </>
      ) : null}
    </SheetContent>
  </Sheet>
);

const CandidateProfileBody = ({
  candidate,
}: {
  candidate: EmployeeRecommendation;
}) => {
  const profile = useCandidateProfile(candidate.employeeId);

  if (profile.isPending) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">Cargando el perfil…</p>
    );
  }

  if (profile.isError) {
    // El backend no distingue el perfil ajeno del empleado inexistente ni del empleador sin
    // vínculo vigente: acá tampoco se afirma cuál de los tres ocurrió.
    return (
      <div className="mt-6 space-y-3">
        <p className="text-sm">
          {isForbiddenCandidateProfileError(profile.error)
            ? "El perfil de este candidato no está disponible."
            : "No pudimos cargar el perfil de este candidato."}
        </p>
        {isForbiddenCandidateProfileError(profile.error) ? null : (
          <Button variant="outline" onClick={() => void profile.refetch()}>
            Reintentar
          </Button>
        )}
      </div>
    );
  }

  return <CandidateProfileDetail profile={profile.data} />;
};

const CandidateProfileDetail = ({ profile }: { profile: EmployeeProfile }) => {
  const downloads = useCandidateFileDownload();

  return (
    <div className="mt-6 space-y-8">
      <Section title="Experiencia">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Años de experiencia"
            value={labelFor(yearsOfExperienceLabels, profile.yearsOfExperience)}
          />
          <Field
            label="Portfolio"
            value={profile.portfolioUrl ?? "Sin portfolio"}
          />
          <div className="sm:col-span-2">
            <Field
              label="Certificaciones"
              value={
                profile.certifications.length > 0
                  ? profile.certifications.join(", ")
                  : "Sin certificaciones"
              }
            />
          </div>
        </dl>
      </Section>

      <Section title="Locación">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field label="Zona horaria" value={profile.timezone} />
          <div className="sm:col-span-2">
            <dt className="text-sm text-muted-foreground">
              Conexiones a internet
            </dt>
            <dd className="text-sm">
              {profile.internetConnections.length > 0 ? (
                <ul className="list-inside list-disc">
                  {profile.internetConnections.map((connection, index) => (
                    <li key={`${connection.type}-${connection.speed}-${index}`}>
                      {labelFor(internetConnectionTypeLabels, connection.type)} ·{" "}
                      {labelFor(internetConnectionSpeedLabels, connection.speed)}
                    </li>
                  ))}
                </ul>
              ) : (
                "Sin conexiones informadas"
              )}
            </dd>
          </div>
        </dl>
      </Section>

      <Section title="Recursos">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Sistema operativo"
            value={profile.os || "Sin informar"}
          />
          <div className="sm:col-span-2">
            <Field
              label="Software pago"
              value={
                profile.paidSoftware.length > 0
                  ? profile.paidSoftware.join(", ")
                  : "Sin software pago"
              }
            />
          </div>
        </dl>
      </Section>

      <Section title="Disponibilidad">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Horas disponibles por día"
            value={String(profile.availableHoursPerDay)}
          />
          <Field
            label="Proyectos compatibles"
            value={optionalCount(profile.compatibleProjects)}
          />
          <Field
            label="Proyectos incompatibles"
            value={optionalCount(profile.incompatibleProjects)}
          />
        </dl>
      </Section>

      <Section title="Educación">
        {profile.education.length > 0 ? (
          <ul className="space-y-3">
            {profile.education.map((education, index) => {
              const target =
                education.certificationDocumentId === null
                  ? null
                  : ({
                      kind: "education-document",
                      employeeId: profile.id,
                      educationId: education.certificationDocumentId,
                    } as const);

              return (
                <li
                  key={`${education.title}-${index}`}
                  className="space-y-1 rounded-md border p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">
                      {education.title}
                    </span>
                    <Badge variant="secondary">
                      {labelFor(
                        educationTypeProfileLabels,
                        education.educationType,
                      )}
                    </Badge>
                    <Badge variant="outline">
                      {labelFor(educationStatusProfileLabels, education.status)}
                    </Badge>
                  </div>
                  {/* Un título sin documento no ofrece descarga: la ausencia de documento y
                      un documento con identificador cero son cosas distintas. */}
                  {target ? (
                    <div className="space-y-1">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={downloads.isDownloading(target)}
                        onClick={() => void downloads.download(target)}
                      >
                        {downloads.isDownloading(target)
                          ? "Abriendo…"
                          : "Descargar documento"}
                      </Button>
                      {downloads.hasFailed(target) ? (
                        <p className="text-sm text-destructive">
                          No pudimos abrir este documento.
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sin títulos informados
          </p>
        )}
      </Section>

      <Section title="Archivos">
        {/* Cada archivo se identifica por título e identificador. La clave de objeto y el
            bucket no llegan al frontend: el backend no los envía. */}
        {profile.files.length > 0 ? (
          <ul className="space-y-3">
            {profile.files.map((file) => {
              const target = {
                kind: "certificate",
                employeeId: profile.id,
                fileId: file.id,
              } as const;

              return (
                <li
                  key={file.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3"
                >
                  <div className="space-y-1">
                    <span className="text-sm">{file.title}</span>
                    {downloads.hasFailed(target) ? (
                      <p className="text-sm text-destructive">
                        No pudimos abrir este archivo.
                      </p>
                    ) : null}
                  </div>
                  {/* Botón y nunca `<a href>`: un enlace dejaría la URL prefirmada en el DOM,
                      en el menú contextual y en el historial. */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={downloads.isDownloading(target)}
                    onClick={() => void downloads.download(target)}
                  >
                    {downloads.isDownloading(target)
                      ? "Abriendo…"
                      : "Descargar"}
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Sin archivos disponibles
          </p>
        )}
      </Section>
    </div>
  );
};
