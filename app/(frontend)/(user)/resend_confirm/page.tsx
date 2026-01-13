"use client";
import { useState } from "react";
import { resendVerification } from "../../_services/user";
import Validator from "../../_helpers/validator";
import { useRouter } from "next/navigation";
import { showLoadingError, showLoadingSuccess, showLoadingToast } from "../../_components/utils/toaster/toaster";

const ResendConfirmationPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();


  const handleSubmit = async (e: React.FormEvent) => {
    let toastId;
    try {
      e.preventDefault();
      const valid = Validator.validateEmail(email);
      if (valid.message) {
        setError(valid.message);
        return;
      }
      setLoading(true);
      toastId = showLoadingToast("Sending Confirmation Code...");
      const res = await resendVerification({ email });
      showLoadingSuccess(toastId, "Confirmation Code Sent Successfully, Please Check Your Inbox.");
      setSubmitted(true);
      setLoading(false);
    } catch (err: any) {
      if (toastId) showLoadingError(toastId, err.response.data.error);
      console.log(err);
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
            Confirmation Code Sent
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We've sent a new activation code to <strong>{email}</strong>. Please
            check your inbox and use the code to activate your account.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
          Resend Activation Code
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Enter your email address and we'll send you a new activation code to
          confirm your account.
        </p>

        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Sending..." : "Send Activation Code"}
          </button>
        </form>

        <div className="mt-8">
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResendConfirmationPage;
