import { useState } from "react";

import { employeeRepository } from "@/api";

// La descarga de un archivo del candidato es una acción, no un dato: se pide la URL
// prefirmada en el clic y se consume en el acto.
//
// No es un `useQuery` ni pasa por `queryClient.fetchQuery` a propósito. Cualquiera de los dos
// dejaría la URL en la caché de React Query, sobreviviendo al clic que la justificó, y el
// criterio de LAB-38 es que no se persista en ningún lado. Acá la URL vive dentro de este
// handler: no entra en ningún `useState`, no se devuelve al componente y no se escribe en el
// DOM —por eso la interfaz expone un botón y nunca un `<a href>`—.
//
// `expiresAt` no se usa para programar nada: la URL se usa una vez, inmediatamente.
type DownloadTarget =
  | { kind: "certificate"; employeeId: number; fileId: number }
  | { kind: "education-document"; employeeId: number; educationId: number };

const requestUrl = (target: DownloadTarget) =>
  target.kind === "certificate"
    ? employeeRepository.getCertificateDownloadUrl(
        target.employeeId,
        target.fileId,
      )
    : employeeRepository.getEducationDocumentDownloadUrl(
        target.employeeId,
        target.educationId,
      );

// La clave identifica qué archivo está en curso para deshabilitar solo ese botón. Es el
// identificador del archivo, nunca su URL.
const targetKey = (target: DownloadTarget) =>
  target.kind === "certificate"
    ? `certificate-${target.fileId}`
    : `education-document-${target.educationId}`;

export const useCandidateFileDownload = () => {
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [failedKey, setFailedKey] = useState<string | null>(null);

  const download = async (target: DownloadTarget) => {
    const key = targetKey(target);
    setPendingKey(key);
    setFailedKey(null);

    try {
      const { url } = await requestUrl(target);
      // La URL se consume en la misma expresión en la que se recibe. No hay variable que la
      // conserve más allá de esta línea.
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      // El error se informa en el panel: una descarga rechazada no debe quedar ofrecida como
      // si estuviera disponible.
      setFailedKey(key);
    } finally {
      setPendingKey(null);
    }
  };

  return {
    download,
    isDownloading: (target: DownloadTarget) => pendingKey === targetKey(target),
    hasFailed: (target: DownloadTarget) => failedKey === targetKey(target),
  };
};
