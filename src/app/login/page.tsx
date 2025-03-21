"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { EyeIcon, EyeOffIcon } from "lucide-react"; // Importing icons

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // ✅ Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      {/* Left Side Image with Animation */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="hidden lg:flex justify-center items-center overflow-hidden"
      >
        <Image
          src="https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/creta-electric/highlights/modelcretaevhome.png"
          alt="Login Illustration"
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Right Side Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center"
      >
        <div className="bg-white/30 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-300">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image src="/Hyundai-logo.png" alt="Logo" width={200} height={50} priority />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="text-white font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
                required
              />
            </div>

            {/* Password Input with Toggle */}
            <div className="relative">
              <label className="text-white font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mt-1 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10  mt-3 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-red-500 text-white p-3 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              LOG IN
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
