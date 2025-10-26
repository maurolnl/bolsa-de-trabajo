import { environment } from "@/core/environment";
import axios from "axios";

export const httpClient = axios.create({
  baseURL: environment.backEnd,
})
