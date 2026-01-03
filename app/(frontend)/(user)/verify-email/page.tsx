"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "../../_services/user";

const VerifyEmailPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    
    if (!token || !email) {
      setError("Invalid verification link");
      setLoading(false);
      return;
    }

    // Auto-verify on page load
    verifyEmail({ token, email })
      .then(() => setSubmitted(true))
      .catch((err: any) => {
        setError(err?.response?.data?.error || "Verification failed");
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Email Verified!</h1>
          <p className="text-gray-600 mb-8">Your email has been verified successfully. You can now sign in.</p>
          <button 
            onClick={() => onNavigate("login")} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <div className="text-red-600 text-5xl mb-4">✗</div>
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Verification Failed</h1>
        <p className="text-red-600 mb-8">{error}</p>
        <div className="flex gap-4">
          <button onClick={() => onNavigate("login")} className="text-blue-600 hover:underline">
            ← Back to Sign In
          </button>
          <button onClick={() => onNavigate("resend-confirmation")} className="text-blue-600 hover:underline">
            Resend Verification Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;