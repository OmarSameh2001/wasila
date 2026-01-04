"use client";
import { useState } from "react";
import { login } from "../../_services/user";
import { useRouter } from "next/navigation";
import Validator from "../../_helpers/validator";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const errors: any = {};
    errors.email = Validator.validateEmail(email).message;
    errors.password = Validator.validatePassword(password).message;
    setError(errors);
    console.log(errors);

    // returns true if any error occurs
    return Object.entries(errors).some(([key, value]) => value !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      
      if (validateForm()) return;
      setLoading(true);

      const res = await login({ email, password });

      console.log("Login:", { email, password });
      setLoading(false);
      router.push("/");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-8">
          Sign In To Your Account
        </h1>

        {/* Brand Section */}
        <div className="flex items-center mb-6">
          <div className="w-11 h-11 bg-blue-500 rounded flex items-center justify-center mr-3">
                <div className="rounded-full text-2xl font-bold">W</div>
              </div>
          <div>
            <div className="font-semibold text-gray-800 dark:text-white">وسيله</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">wasila.com</div>
          </div>
        </div>

        {/* Social Login Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
        </div> */}

        {/* Divider */}
        {/* <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or</span>
          </div>
        </div> */}

        {/* Login Form */}
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-4">
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
            {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error.password && (
              <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded transition disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Help Links */}
        <div className="mt-8">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => router.push("/register")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                I don't have an account
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/forget_password")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push("/resend_confirm")}
                className="text-blue-600 hover:underline cursor-pointer"
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
