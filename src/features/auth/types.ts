export type Role = "super_admin" | "admin" | "lawyer" | "customer";

export type AuthStateType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  userId: string | number | undefined;
  roles: Role[];
  user: LoggedUser;
};

export type LoggedUser = {
  id: string | number;
  displayName: string;
  roles: Role[];
  photoURL: string;
  email: string;
};

// ----------------------------------------------------------------------

export type JWTContextType = {
  method: "jwt";
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (x: { email: string; password: string }) => Promise<LoggedUser | null>;
  logout: () => void;
  roles: Role[];
  userId: string | number | undefined;
  isSuperAdmin: () => boolean;
  user: LoggedUser;
};

