"use client";
import { useState } from "react";
import { resendVerification } from "../../_services/user";

const ResendConfirmationPage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }
    setLoading(true);
    const res = await resendVerification({ email });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Confirmation Code Sent</h1>
          <p className="text-gray-600 mb-8">
            We've sent a new activation code to <strong>{email}</strong>. Please check your inbox and use the code to activate your account.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="text-blue-600 hover:underline"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Resend Activation Code</h1>
        <p className="text-gray-600 mb-8">
          Enter your email address and we'll send you a new activation code to confirm your account.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
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
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Activation Code'}
          </button>
        </form>

        <div className="mt-8">
          <button
            onClick={() => onNavigate('login')}
            className="text-blue-600 hover:underline"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResendConfirmationPage;