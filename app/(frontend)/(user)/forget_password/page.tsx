"use client";
import { useState } from "react";
import { forgetPassword } from "../../_services/user";
import Validator from "../../_utils/validator/validator";
import { useRouter } from "next/navigation";
import { showLoadingError, showLoadingSuccess, showLoadingToast } from "../../_utils/toaster/toaster";
import { AxiosError } from "axios";

// Forgot Password Page Component
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    let toastId;
    try{
    const valid = Validator.validateEmail(email);
    if (valid.message) {
      setError(valid.message);
      return;
    }
    setLoading(true);
    toastId = showLoadingToast("Creating Password Reset Link...");
    await forgetPassword(email);
    showLoadingSuccess(toastId, "Password Reset Link Sent Successfully");
    setSubmitted(true);
    setLoading(false);
    } catch (err: AxiosError  | any) {
      console.log(err);
      setLoading(false);
      if (toastId) showLoadingError(toastId, err.response.data.error);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Check Your Email</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We've sent password reset instructions to <strong>{email}</strong>. Please check your inbox and follow the link to reset your password.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:underline cursor-pointer"
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
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">Forgot Password?</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        <div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !email}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </button>
        </div>

        <div className="mt-8">
          <button
            onClick={() => router.push('/login')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
