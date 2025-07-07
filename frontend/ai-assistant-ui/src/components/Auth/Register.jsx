import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { apiPost } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [strength, setStrength] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const checkStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    switch (score) {
      case 0:
      case 1: return "weak";
      case 2: return "medium";
      case 3:
      case 4: return "strong";
      default: return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await apiPost("/auth/register", { email, password });
      login(res.token);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
    }
  };

  const getStrengthColor = (level) => {
    switch (level) {
      case "weak": return "bg-red-500";
      case "medium": return "bg-yellow-400";
      case "strong": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-900 via-gray-900 to-blue-800 px-4 py-12">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-gray-900/80 shadow-2xl backdrop-blur-xl border border-blue-600 rounded-2xl p-8 w-full max-w-md space-y-6 text-white"
      >
        <h2 className="text-3xl font-bold text-center text-white drop-shadow">Create an Account</h2>

        <div>
          <label className="text-sm mb-1 block text-gray-300">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div className="relative">
          <label className="text-sm mb-1 block text-gray-300">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => {
              setPassword(e.target.value);
              setStrength(checkStrength(e.target.value));
              setError("");
            }}
            className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-[36px] right-3 text-gray-300 hover:text-white transition"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>

          {password && (
            <div className="mt-3">
              <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor(strength)} transition-all duration-500 ease-in-out`}
                  style={{
                    width:
                      strength === "weak"
                        ? "33%"
                        : strength === "medium"
                        ? "66%"
                        : "100%",
                  }}
                />
              </div>
              <p className="text-xs mt-1 text-gray-400 capitalize">{strength} password</p>
            </div>
          )}
        </div>

        {error && (
          <motion.p
            className="text-sm text-red-400 -mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.p>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
