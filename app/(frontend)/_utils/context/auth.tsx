"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getSession } from "@/app/(frontend)/_services/auth";
import { AuthContextType, UserType } from "@/app/(frontend)/_dto/user";

export const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  id: 0,
  type: "",
  refetchAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(0);
  const [type, setType] = useState<UserType>("");

  const fetchSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getSession();
      setId(res.data.id);
      setType(res.data.type);
    } catch (error) {
      console.error("Session fetch failed:", error);
      setId(0);
      setType("");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        id,
        type,
        refetchAuth: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
