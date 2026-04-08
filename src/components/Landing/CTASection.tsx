import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import TransitionAnimation from "@/components/TransitionAnimation";

export default function CTASection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAnimation, setShowAnimation] = useState(false);

  const handleStartBuilding = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      setShowAnimation(true);
    }
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    navigate("/login");
  };

  const handleExplore = () => {
    setShowAnimation(true);
  };

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-xl p-12 md:p-16 text-center overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full filter blur-3xl -z-10" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full filter blur-3xl -z-10" />

          {/* Headline */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Build Impact?
            </span>
          </h2>

          {/* Description */}
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of students building real projects, finding their perfect teams, and launching their careers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {/* Primary CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartBuilding}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 border border-blue-400/50"
            >
              {user ? "Go to Dashboard" : "Start Building"}
            </motion.button>

            {/* Secondary CTA */}
            {!user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExplore}
                className="px-10 py-4 rounded-xl border-2 border-blue-500 text-blue-400 font-bold text-lg hover:bg-blue-500/10 transition-all duration-300"
              >
                Explore All Projects
              </motion.button>
            )}
          </div>

          {/* Secondary text */}
          <p className="text-gray-500 text-sm mt-8">
            ✨ No credit card required. Free to get started.
          </p>
        </motion.div>

        {/* Animation Overlay */}
        <AnimatePresence>
          {showAnimation && <TransitionAnimation onComplete={handleAnimationComplete} />}
        </AnimatePresence>
      </div>
    </section>
  );
}
