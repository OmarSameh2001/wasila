import { Suspense } from "react";
import LoadingPage from "../_utils/promise_handler/loading/loading";
import { ProtectedBrokerRoute } from "../_utils/protected/protected";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ProtectedBrokerRoute>{children}</ProtectedBrokerRoute>
    </Suspense>
  );
}
