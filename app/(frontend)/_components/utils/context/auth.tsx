"use client";
import { UserContext } from "@/app/(frontend)/_dto/user";
import { axiosAuth } from "../../../_services/axios";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext<{
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  user?: UserContext | null;
//   setUser?: React.Dispatch<React.SetStateAction<UserContext | null>>;
}>({
  isLoading: true,
  setIsLoading: () => {},
  user: null,
//   setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserContext | null>(null);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //     setIsLoading(false);
  //   } else {
  //     axiosAuth
  //       .post("/user/refresh", {}, { withCredentials: true })
  //       .then((res) => {
  //         setUser(res.data.user);
  //         localStorage.setItem("user", JSON.stringify(res.data.user));
  //       })
  //       .catch(() => {
  //         setUser(null);
  //         localStorage.removeItem("user");
  //       })
  //       .finally(() => {
  //         setIsLoading(false);
  //       });
  //   }
  // }, []);
  return (
    <AuthContext.Provider
      value={{
        isLoading,
        setIsLoading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
