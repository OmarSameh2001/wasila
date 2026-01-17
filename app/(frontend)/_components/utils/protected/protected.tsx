"use client";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth";
import { useRouter } from "next/navigation";
import LoadingPage from "../promise_handler/loading/loading";

type UserType = "USER" | "ADMIN" | "BROKER";

export function Redirect({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [to, router]);

  return null;
}
function createProtectedRoute(allowedType?: UserType) {
  return function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { id, type, isLoading } = useContext(AuthContext);

    if (isLoading) return <LoadingPage />;

    // Not authenticated
    if (!id || !type) return <Redirect to={"/login"} />;

    if (allowedType && type !== allowedType) return <Redirect to={"/"} />;

    return children;
  };
}

// Export all variants
export const ProtectedRoute = createProtectedRoute();
export const ProtectedAdminRoute = createProtectedRoute("ADMIN");
export const ProtectedBrokerRoute = createProtectedRoute("BROKER");
export const ProtectedUserRoute = createProtectedRoute("USER");

export function NonProtectedRoute({ children }: { children: React.ReactNode }) {
  const { id, type, isLoading } = useContext(AuthContext);

  if (isLoading) return <LoadingPage />;
  if (id && type) return <Redirect to={"/"} />;

  return children;
}

export default ProtectedRoute;
