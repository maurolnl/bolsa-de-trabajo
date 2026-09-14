export type Role = "super_admin" | "admin" | "lawyer" | "customer";

export type UserRole = "employee" | "employer";

export type AuthStateType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  userId: string | number | undefined;
  user: LoggedUser;
};

export type LoggedUser = {
  id: string | number;
  email: string;
  role: UserRole | null;
};

// ----------------------------------------------------------------------

export type JWTContextType = {
  method: "jwt";
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (x: { email: string; password: string }) => Promise<LoggedUser | null>;
  logout: () => void;
  userId: string | number | undefined;
  user: LoggedUser;
};
