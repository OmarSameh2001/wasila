"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "../../_services/user";

const ResetPasswordPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    const urlEmail = searchParams.get('email');
    
    if (!urlToken || !urlEmail) {
      setError("Invalid reset link");
    } else {
      setToken(urlToken);
      setEmail(urlEmail);
    }
  }, [searchParams]);

  const handleSubmit = async (e?: any) => {
    e?.preventDefault?.();
    
    if (!token || !email) {
      setError("Invalid reset link");
      return;
    }
    
    if (!newPassword) {
      setError("Password is required");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await resetPassword({ token, email, newPassword });
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
          <div className="text-green-600 text-5xl mb-4">✓</div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Password Reset Complete</h1>
          <p className="text-gray-600 mb-8">Your password has been reset successfully. You can now sign in with your new password.</p>
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

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">Invalid Link</h1>
          <p className="text-red-600 mb-8">{error || "This password reset link is invalid or expired."}</p>
          <button onClick={() => onNavigate("forgot-password")} className="text-blue-600 hover:underline">
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Reset Password</h1>
        <p className="text-gray-600 mb-8">Enter your new password for <strong>{email}</strong></p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-8">
          <button onClick={() => onNavigate("login")} className="text-blue-600 hover:underline">← Back to Sign In</button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;