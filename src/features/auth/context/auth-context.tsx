import { createContext, useCallback, useEffect, useRef, useState } from "react";
// utils
import { AuthStateType, JWTContextType, LoggedUser } from "../types";
import { setSession } from "../utils";
import { LSKeys, LocalStorage } from "@/core/services/localStorage";
import { useLoginMutation } from "../hooks/useAuth";
import { authRepository } from "../repo/auth";

const initialState: AuthStateType = {
  isInitialized: false,
  isAuthenticated: false,
  userId: undefined,
  user: {
    id: "",
    email: "",
  },
};

export const AuthContext = createContext<JWTContextType | null>(null);

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState(initialState);
  const loginMutation = useLoginMutation();
  const initializePromiseRef = useRef<Promise<void> | null>(null);

  const initializeState = useCallback(() => {
    setState((x) => ({
      ...x,
      isAuthenticated: false,
      userId: undefined,
      roles: [],
      isInitialized: true,
    }));
    LocalStorage.remove(LSKeys.ACCESS_TOKEN);
  }, []);

  const setStateFromToken = useCallback(async (): Promise<LoggedUser | null> => {
    try {
      const user = await authRepository.getCurrentUser();
      const loggedUser = {
        id: user.id,
        displayName: user.email,
        photoURL: "",
        email: user.email,
      };

      setState((x) => ({
        ...x,
        isAuthenticated: true,
        userId: loggedUser.id,
        isInitialized: true,
        user: loggedUser,
      }));
      return loggedUser;
    } catch (error) {
      console.error(error);

      initializeState();
      return null;
    }
  }, [initializeState]);

  const logout = useCallback(async () => {
    setSession(null);
    initializeState();
  }, [initializeState]);

  const initialize = useCallback(async () => {
    try {
      const accessToken =
        typeof window !== "undefined"
          ? LocalStorage.get<string>(LSKeys.ACCESS_TOKEN)
          : "";
      if (accessToken) {
        setSession(accessToken);
        await setStateFromToken();
      } else {
        setSession(null);
        initializeState();
      }
    } catch (error) {
      console.error(error);
      initializeState();
    }
  }, [initializeState, setStateFromToken]);

  useEffect(() => {
    if (!initializePromiseRef.current) {
      initializePromiseRef.current = initialize();
    }
  }, [initialize]);

  // LOGIN
  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const data = await loginMutation.mutateAsync({ email, password });
    setSession(data.token);
    return setStateFromToken();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
