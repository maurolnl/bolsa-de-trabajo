import { LSKeys, LocalStorage } from "@/core/services/localStorage";
import { PATHS } from "@/router/paths";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const saveCurrentLocation = () => {
  LocalStorage.set(LSKeys.LOCATION_AFTER_LOGOUT, window.location.pathname);
};

export const getLogoutLocation = () => {
  const redirectPath = LocalStorage.get(LSKeys.LOCATION_AFTER_LOGOUT) as string;
  LocalStorage.remove(LSKeys.LOCATION_AFTER_LOGOUT);
  return redirectPath || PATHS.main.home;
};
