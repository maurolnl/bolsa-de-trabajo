import { Employee } from "../models/Employee";

export const getUserMapper = (x: unknown): Employee => ({
  ...(x as Employee),
});
