import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Navbar from "@/components/Landing/Navbar";
import ParticleBackground from "@/components/Landing/ParticleBackground";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password");
      return;
    }
    setIsLoading(true);
    try {
      await login(role, { email, password });
      toast.success("Logged in successfully! 🎉");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col">
      {/* Particle background */}
      <ParticleBackground />

      {/* Navbar - Logo only, no nav links */}
      <Navbar hideNavLinks={true} showLogoOnly={true} />

      {/* Hero section */}
      <section className="flex-1 relative flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full z-10"
        >
          {/* Back to landing */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm mb-8"
          >
            ← Back to home
          </Link>

          {/* Card Container */}
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 backdrop-blur-xl p-8 md:p-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome</h1>
              <p className="text-gray-400 text-sm md:text-base">
                Sign in to your CodeMate X account
              </p>
            </motion.div>

            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 flex gap-3"
            >
              {(["student", "admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    role === r
                      ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white shadow-lg shadow-cyan-500/20"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {r === "student" ? "Student" : "Admin"}
                </button>
              ))}
            </motion.div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    className="w-full pl-11 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 focus:bg-white/10 text-white placeholder-gray-500 transition-all outline-none text-sm"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 focus:border-cyan-500 focus:bg-white/10 text-white placeholder-gray-500 transition-all outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Signup link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-gray-400 text-sm mt-6"
            >
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Sign up now
              </Link>
            </motion.p>

            {/* Demo hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 pt-6 border-t border-white/10 space-y-2"
            >
              <p className="text-xs text-gray-500 text-center font-semibold">
                💡 Demo Credentials:
              </p>
              <div className="text-xs text-gray-400 text-center space-y-1">
                <p><span className="text-cyan-400">Student:</span> subhkumar.a.mishra24@slrtce.in / password</p>
                <p><span className="text-cyan-400">Admin:</span> admin@college.edu / password</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Login;
