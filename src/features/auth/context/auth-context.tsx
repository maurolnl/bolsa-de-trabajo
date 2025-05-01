import moment from "moment";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
// utils
import { AuthStateType, JWTContextType, LoggedUser } from "../types";
import { jwtDecode } from "jwt-decode";
import { setSession } from "../utils";
import { LSKeys, LocalStorage } from "@/core/services/localStorage";
import { AuthRepository, useLoginMutation } from "@/api/AuthRepository";

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  userId: undefined,
  roles: [],
  user: {
    id: "",
    displayName: "",
    roles: [],
    photoURL: "",
    email: "",
  },
};

export const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

const userRepo = new AuthRepository();

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState(initialState);
  const loginMutation = useLoginMutation();
  const tokenExpirationTimeoutRef = useRef<NodeJS.Timeout>();

  const setStateFromToken = async (): Promise<LoggedUser | null> => {
    try {
      const { data: user } = await userRepo.getLoggedUser();
      const loggedUser = {
        id: user.id,
        displayName: user.email,
        photoURL: "",
        email: user.email,
        roles: user.roles,
      };

      setState((x) => ({
        ...x,
        isAuthenticated: true,
        userId: loggedUser.id,
        roles: loggedUser.roles,
        isInitialized: true,
        user: loggedUser,
      }));
      return loggedUser;
    } catch (error) {
      console.error(error);

      initializeState();
      return null;
    }
  };

  const initializeState = () => {
    setState((x) => ({
      ...x,
      isAuthenticated: false,
      userId: undefined,
      roles: [],
      isInitialized: true,
    }));
    LocalStorage.remove(LSKeys.ACCESS_TOKEN);
  };

  const logout = useCallback(async () => {
    setSession(null);
    initializeState();
  }, []);

  const setTokenExpirationCallback = useCallback(
    (accessToken: string) => {
      const { exp } = jwtDecode<{ exp: string }>(accessToken);
      const expirationDate = moment.unix(Number(exp));
      const expiration = expirationDate.diff(moment(), "milliseconds");
      if (expiration < 0) {
        logout();
      }
      tokenExpirationTimeoutRef.current = setTimeout(() => {
        logout();
      }, expiration);
    },
    [logout]
  );

  const initialize = useCallback(async () => {
    try {
      const accessToken =
        typeof window !== "undefined"
          ? LocalStorage.get<string>(LSKeys.ACCESS_TOKEN)
          : "";
      if (accessToken) {
        // TODO: definir duracion del token
        // setTokenExpirationCallback(accessToken);
        setStateFromToken();
        setSession(accessToken);
      } else {
        initializeState();
        setSession(null);
      }
    } catch (error) {
      console.error(error);
      initializeState();
    }
    return () =>
      tokenExpirationTimeoutRef.current &&
      clearTimeout(tokenExpirationTimeoutRef.current);
  }, [setTokenExpirationCallback]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { data } = await loginMutation.mutateAsync({ email, password });
    setSession(data);
    return setStateFromToken();
  };

  const isSuperAdmin = () => (state.roles ?? []).includes("super_admin");

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        login,
        logout,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
