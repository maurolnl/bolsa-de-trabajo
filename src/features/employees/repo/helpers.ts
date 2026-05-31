import { User } from "./types";

export const getUserMapper = (x: any): User => ({
  ...x,
});
