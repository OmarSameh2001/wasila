import { Suspense } from "react";
import LoadingPage from "../_utils/promise_handler/loading/loading";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingPage />}>
      {children}
    </Suspense>
  );
}