import { z } from "zod";

export const MAX_PDF_FILE_SIZE = 5 * 1024 * 1024;

export const pdfFileValidation = z
  .instanceof(File, { message: "Por favor suba un archivo válido" })
  .refine((file) => file.type === "application/pdf", {
    message: "El archivo debe ser un PDF",
  })
  .refine((file) => file.size <= MAX_PDF_FILE_SIZE, {
    message: "El archivo no puede superar los 5 MB",
  });

export const multipleFileValidation = z.any().refine(
  (file) => {
    if (!file) return true;
    const files = Object.values(file) as File[];
    return files.every((file) => file instanceof File);
  },
  { message: "Por favor suba un archivo válido" },
);

export const singleFileValidation = z.any().refine(
  (file) => {
    if (!file) return true;
    return file instanceof File;
  },
  { message: "Por favor suba un archivo válido" },
);

export const urlValidation = z.string().refine(
  (val) => {
    if (!val) return true;
    // Divide por comas y valida que cada URL sea válida
    const urls = val.split(",").map((url) => url.trim());
    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return urls.every((url) => !url || urlRegex.test(url));
  },
  { message: "Por favor ingrese URLs válidas separadas por comas" },
);
