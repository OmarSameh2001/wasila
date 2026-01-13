"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Validator from "../../_helpers/validator";
import { registerBroker } from "../../_services/user";
import { Eye, EyeOff } from "lucide-react";
import { showLoadingError, showLoadingSuccess, showLoadingToast } from "../../_components/utils/toaster/toaster";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const errors: any = {};
    errors.name = Validator.validateName(formData.name).message;
    errors.email = Validator.validateEmail(formData.email).message;
    errors.username = Validator.validateUsername(formData.username).message;
    errors.password = Validator.validatePassword(formData.password).message;
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setError(errors);
    console.log(errors);
    return Object.entries(errors).some(([key, value]) => value !== "");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    let toastId;
    try {
      e.preventDefault();
      console.log(formData);
      if (validateForm()) return;

      setLoading(true);

      toastId = showLoadingToast("Creating Account...");
      const response = await registerBroker(formData);
      showLoadingSuccess(toastId, "Account Created Successfully");
      setLoading(false);
      router.push("/login");
    } catch (err: any) {
      if (toastId) showLoadingError(toastId, err.response.data.error);
      console.log(err);
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-8">
          Create Your Account
        </h1>

        {/* Brand Section */}
        <div className="flex items-center mb-6">
          <div className="w-11 h-11 bg-blue-500 rounded flex items-center justify-center mr-3">
            <div className="rounded-full text-2xl font-bold">W</div>
          </div>
          <div>
            <div className="font-semibold text-gray-800 dark:text-white">
              وسيله
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              wasila.com
            </div>
          </div>
        </div>

        {/* Social Login Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded flex items-center justify-center transition">
            <span className="mr-2 text-xl">G</span>
            Using Google
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded flex items-center justify-center transition">
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

        {/* Register Form */}
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              required
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error.name && (
              <p className="text-red-500 text-xs mt-1">{error.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              required
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error.email && (
              <p className="text-red-500 text-xs mt-1">{error.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="username"
              value={formData.username}
              required
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error.username && (
              <p className="text-red-500 text-xs mt-1">{error.username}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 dark:text-white text-sm font-medium mb-2 flex gap-2">
              Password{" "}
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="cursor-pointer h-5 w-5"/> : <Eye className="cursor-pointer h-5 w-5"/>}
              </span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              required
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error.password && (
              <p className="text-red-500 text-xs mt-1">{error.password}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 dark:text-white text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              required
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="Confirm your password"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {error.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Help Links */}
        <div className="mt-8">
          {/* <h3 className="text-gray-700 font-medium mb-3">Help</h3> */}
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => router.push("/login")}
                className="text-blue-600 hover:underline cursor-pointer"
              >
                Already have an account? Sign in
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
