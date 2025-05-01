import axios from "axios";
import { environment } from "@/core/environment";

export const httpClient = axios.create({
  baseURL: environment.backEnd,
});
