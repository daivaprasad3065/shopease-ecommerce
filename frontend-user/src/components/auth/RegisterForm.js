// frontend-user/src/components/auth/RegisterForm.js
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { registerUser } from "@/services/authService";

// Same regex logic as backend (UX consistency)
const phoneRegex = /^[6-9]\d{9}$/;
const emailRegex = /^[^\s@]+@gmail\.com$/i;

export default function RegisterForm() {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState(""); // email OR phone
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!name || !identifier || !password || !confirmPassword) {
      setError("Please fill all required fields");
      return;
    }

    if (!phoneRegex.test(identifier) && !emailRegex.test(identifier)) {
      setError("Enter a valid Gmail address or 10-digit phone number");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const normalizedIdentifier = identifier.trim().toLowerCase();

    setLoading(true);

    try {
      const data = await registerUser({
        name,
        identifier: normalizedIdentifier,
        password,
      });

      register(data.data.token, data.data.user);
      
    } catch (err) {
      // Extract error message safely
      const errMsg = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
      {error && (
        <div
          className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full text-gray-900 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Identifier */}
        <div>
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
            Email address or Phone Number
          </label>
          <input
            type="text"
            id="identifier"
            placeholder="example@gmail.com or 9876543210"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="mt-1 block w-full text-gray-900 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full text-gray-900 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full text-gray-900 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center rounded-md bg-blue-600 py-2 px-4 text-white font-semibold shadow-sm hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}