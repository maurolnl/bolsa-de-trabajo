import { matchPath } from "react-router";
import { httpClient } from "@/core/services/httpClient";
import { Role } from "./types";
import { PATHS_PER_ROLE } from "@/router/paths";
import { LSKeys, LocalStorage } from "@/core/services/localStorage";

// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null) => {
  if (!accessToken) {
    LocalStorage.remove(LSKeys.ACCESS_TOKEN);
    httpClient.defaults.headers.common.Authorization = undefined;
    return;
  }

  httpClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  LocalStorage.set(LSKeys.ACCESS_TOKEN, accessToken);
};

export const isPathAuthorized = (userRoles: Role[], path: string) => {
  const authorizedPaths = PATHS_PER_ROLE.filter((path) =>
    userRoles.some((userRole) => userRole.includes(path.role))
  ).flatMap((route) => route.paths);

  return authorizedPaths.some(
    (authorizedPath) => matchPath(authorizedPath, path) !== null
  );
};
