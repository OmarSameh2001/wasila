"use client";
import { useState } from "react";

export default function LoginPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Login:", { email, password });
    setLoading(false);
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleMicrosoftLogin = () => {
    console.log("Microsoft login clicked");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">
          Sign In To Your Account
        </h1>

        {/* Brand Section */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center mr-3">
            <div className="w-6 h-6 border-4 border-white rounded-full"></div>
          </div>
          <div>
            <div className="font-semibold text-gray-800">مستقل</div>
            <div className="text-sm text-gray-600">mostaql.com</div>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleGoogleLogin}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded flex items-center justify-center transition"
          >
            <span className="mr-2 text-xl">G</span>
            Using Google
          </button>
          <button
            onClick={handleMicrosoftLogin}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded flex items-center justify-center transition"
          >
            <span className="mr-2 text-xl">⊞</span>
            Using Microsoft
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or</span>
          </div>
        </div>

        {/* Login Form */}
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>

        {/* Help Links */}
        <div className="mt-8">
          <h3 className="text-gray-700 font-medium mb-3">Help</h3>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onNavigate("register")}
                className="text-blue-600 hover:underline"
              >
                I don't have an account
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("forgot-password")}
                className="text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("resend-confirmation")}
                className="text-blue-600 hover:underline"
              >
                I didn't receive activation code
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
