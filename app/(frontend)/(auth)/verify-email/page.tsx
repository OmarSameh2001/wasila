"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmail } from "../../_services/auth";
import { showLoadingError, showLoadingSuccess, showLoadingToast } from "../../_utils/toaster/toaster";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    if (!token || !email) {
      setError("Invalid verification link");
      setLoading(false);
      return;
    }
    const toastId = showLoadingToast("Verifying Email...");
    // Auto-verify on page load
    verifyEmail({ token, email })
      .then(() => setSubmitted(true))
      .then(() => {
        showLoadingSuccess(toastId, "Email Verified Successfully");
      })
      .catch((err: any) => {
        setError(err?.response?.data?.error || "Verification failed");
        showLoadingError(toastId, err?.response?.data?.error);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-200">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-2xl">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Email Verified!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Your email has been verified successfully. You can now sign in.</p>
          <button 
            onClick={() => router.push("/login")} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded cursor-pointer"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <div className="text-red-600 text-5xl mb-4">✗</div>
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">Verification Failed</h1>
        <p className="text-red-600 mb-8">{error}</p>
        <div className="flex gap-6">
          <button onClick={() => router.push("/login")} className="text-blue-600 hover:underline cursor-pointer">
            ← Back to Sign In
          </button>
          <button onClick={() => router.push("resend_confirm")} className="text-blue-600 hover:underline cursor-pointer">
            Resend Verification Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;