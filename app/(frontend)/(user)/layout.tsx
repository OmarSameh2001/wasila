import { Suspense } from "react";
import LoadingPage from "../_components/utils/promise_handler/loading/loading";

export default function ResetPasswordLayout({
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