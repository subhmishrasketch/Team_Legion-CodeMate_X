import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import TransitionAnimation from "@/components/TransitionAnimation";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, Engine } from "@tsparticles/engine";
import {
  Zap, Users, GitBranch, Trophy, Rocket, Brain,
  Activity, Globe, TrendingUp, Sparkles
} from "lucide-react";
import Navbar from "@/components/Landing/Navbar";
import ActivityTicker from "@/components/Landing/ActivityTicker";
import DashboardMock from "@/components/Landing/Animated3DHero";
import FeatureCard from "@/components/Landing/FeatureCard";
import TestimonialCard from "@/components/Landing/TestimonialCard";
import LeaderboardCard from "@/components/Landing/LeaderboardCard";
import StatsCard from "@/components/Landing/StatsCard";
import HeroSection from "@/components/Landing/HeroSection";
import CTASection from "@/components/Landing/CTASection";

/* ════════════════════════════════════════════════════ */
/*  CONFIGURATION & DATA                               */
/* ════════════════════════════════════════════════════ */

const PARTICLES_CONFIG = {
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "grab" },
      onClick: { enable: true, mode: "push" },
    },
    modes: {
      grab: { distance: 140, links: { opacity: 0.5 } },
      push: { quantity: 2 },
    },
  },
  particles: {
    color: { value: ["#0ea5e9", "#3b82f6", "#6366f1"] },
    links: {
      color: "#3b82f6",
      distance: 130,
      enable: true,
      opacity: 0.18,
      width: 1,
    },
    move: {
      direction: "none" as const,
      enable: true,
      outModes: { default: "bounce" as const },
      random: true,
      speed: 0.6,
      straight: false,
    },
    number: { density: { enable: true }, value: 90 },
    opacity: { value: { min: 0.2, max: 0.7 } },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
};

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Our engine analyzes your skills, interests, and project goals to find teammates with up to 97% compatibility.",
    color: "from-sky-500 to-blue-600",
    glow: "shadow-sky-500/30",
  },
  {
    icon: Users,
    title: "Smart Team Building",
    description: "Auto-assemble balanced teams based on complementary skill sets, timezones, and work styles.",
    color: "from-cyan-500 to-blue-600",
    glow: "shadow-cyan-500/30",
  },
  {
    icon: GitBranch,
    title: "Project Discovery",
    description: "Browse hundreds of student-led projects — from web apps to ML models — and join teams mid-flight.",
    color: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/30",
  },
  {
    icon: Trophy,
    title: "Revival Hub",
    description: "Revive abandoned projects with fresh contributors. Give ideas a second life.",
    color: "from-indigo-500 to-blue-700",
    glow: "shadow-indigo-500/30",
  },
  {
    icon: Activity,
    title: "Real-Time Analytics",
    description: "Track team velocity, contribution graphs, skill evolution, and project health in one dashboard.",
    color: "from-sky-400 to-cyan-500",
    glow: "shadow-sky-500/30",
  },
  {
    icon: Globe,
    title: "Global Network",
    description: "Connect with students across 50+ colleges. Build your dev network before you even graduate.",
    color: "from-blue-600 to-indigo-700",
    glow: "shadow-blue-500/30",
  },
];

const STATS = [
  { value: "2,400+", label: "Students" },
  { value: "380+", label: "Projects" },
  { value: "97%", label: "Match Accuracy" },
  { value: "50+", label: "Colleges" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "3rd Year, CSE",
    message: "CodeMate X helped me find the perfect team for my AI project. We shipped in 8 weeks!",
    avatar: "PS",
    projects: 3
  },
  {
    name: "Arjun Singh",
    role: "2nd Year, IT",
    message: "The AI matching is insanely accurate. Found teammates I click with instantly.",
    avatar: "AS",
    projects: 5
  },
  {
    name: "Rahul Patel",
    role: "Final Year, CSE",
    message: "From idea to reality. CodeMate X made collaboration seamless. Highly recommend!",
    avatar: "RP",
    projects: 7
  }
];

const LEADERBOARD = [
  { rank: 1, name: "Priya Sharma", dept: "CSE", points: 285, medal: "🥇", color: "from-yellow-400 to-yellow-600" },
  { rank: 2, name: "Rahul Mehta", dept: "IT", points: 240, medal: "🥈", color: "from-gray-300 to-gray-500" },
  { rank: 3, name: "Sneha Kulkarni", dept: "ECE", points: 210, medal: "🥉", color: "from-amber-600 to-amber-800" },
];


/* ─────────────────────────────────────────────────────── */
/*  FLOATING MINI-CARD COMPONENT                           */
/* ─────────────────────────────────────────────────────── */
function MiniCard({
  children,
  className = "",
  delay = 0,
  floatOffset = 8,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  floatOffset?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1, y: [0, -floatOffset, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, duration: 0.5 },
        y: { delay: delay + 0.5, duration: 3 + delay * 0.5, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`glass-card rounded-2xl px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-xl border border-white/10 bg-white/5 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  HERO DASHBOARD MOCK UI                                 */
/* ─────────────────────────────────────────────────────── */
function DashboardMock({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const rotateX = (mouseY - 0.5) * -12;
  const rotateY = (mouseX - 0.5) * 14;

  const [matchPct] = useState(92);

  // Animated skill bars
  const skills = [
    { name: "React", pct: 88, color: "from-cyan-400 to-blue-500" },
    { name: "Python", pct: 74, color: "from-indigo-400 to-purple-500" },
    { name: "TypeScript", pct: 81, color: "from-sky-400 to-blue-500" },
    { name: "ML/AI", pct: 65, color: "from-cyan-400 to-indigo-500" },
  ];

  const teamCards = [
    { name: "Subh M.", role: "Frontend", avatar: "SM", color: "from-cyan-500 to-blue-600" },
    { name: "Shivam M.", role: "ML Eng.", avatar: "ShM", color: "from-sky-500 to-blue-600" },
    { name: "Harsh M.", role: "Backend", avatar: "HM", color: "from-indigo-500 to-blue-600" },
  ];

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      transition={{ type: "spring", stiffness: 80, damping: 20 }}
      className="relative w-full max-w-[520px] mx-auto"
    >
      {/* Main dashboard card */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5 bg-white/[0.03]">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <div className="w-3 h-3 rounded-full bg-cyan-400/80" />
          <span className="ml-3 text-xs text-white/30 font-mono">codemate.x / dashboard</span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] text-cyan-400">live</span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* AI Match Score */}
          <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-sky-600/20 to-cyan-600/20 border border-sky-500/20 p-4">
            <div>
              <p className="text-xs text-white/50 mb-1">AI Team Match Score</p>
              <motion.p
                className="text-3xl font-bold bg-gradient-to-r from-sky-300 to-cyan-300 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {matchPct}%
              </motion.p>
            </div>
            <motion.div
              className="w-16 h-16 rounded-full border-4 border-violet-500/30 flex items-center justify-center relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-violet-400 border-r-cyan-400" style={{ margin: "-4px" }} />
              <Brain className="w-6 h-6 text-violet-300" />
            </motion.div>
          </div>

          {/* Skill Bars */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Skill Radar</p>
            {skills.map((s, i) => (
              <div key={s.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">{s.name}</span>
                  <span className="text-white/40">{s.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${s.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ delay: 0.6 + i * 0.15, duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Team Cards */}
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2.5">Your Team</p>
            <div className="flex gap-2">
              {teamCards.map((tc, i) => (
                <motion.div
                  key={tc.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="flex-1 rounded-xl bg-white/5 border border-white/5 p-2.5 text-center"
                  whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.15)" }}
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${tc.color} flex items-center justify-center text-xs font-bold text-white mx-auto mb-1.5`}>
                    {tc.avatar}
                  </div>
                  <p className="text-[10px] font-semibold text-white/80">{tc.name}</p>
                  <p className="text-[9px] text-white/40">{tc.role}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Project card */}
          <motion.div
            className="rounded-xl bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/20 p-3 flex items-center gap-3 cursor-pointer"
            whileHover={{ borderColor: "rgba(34,211,238,0.4)", backgroundColor: "rgba(34,211,238,0.08)" }}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">AI Study Buddy — v2</p>
              <p className="text-[10px] text-white/40">3 contributors · 82% complete</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  ACTIVITY TICKER                                        */
/* ─────────────────────────────────────────────────────── */
function ActivityTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % ACTIVITY_ITEMS.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden">
      <span className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="text-sm text-white/70 whitespace-nowrap"
        >
          {ACTIVITY_ITEMS[index].icon} {ACTIVITY_ITEMS[index].text}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  NAVBAR                                                 */
/* ─────────────────────────────────────────────────────── */
function Navbar({ scrolled }: { scrolled: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/30"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-shadow">
              <img src="/logo.svg" alt="CodeMate X" className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-white text-lg tracking-tight">
              CodeMate <span className="text-cyan-400">X</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {["Home", "Features", "Leaderboard"].map((item) => (
              <a
                key={item}
                href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                {item}
              </a>
            ))}
          </div>

          {/* CTA links */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-b border-white/5 px-5 py-4 flex flex-col gap-2 md:hidden"
          >
            {["Home", "Features", "Leaderboard"].map((item) => (
              <a
                key={item}
                href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                {item}
              </a>
            ))}
            <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-white text-center bg-gradient-to-r from-cyan-500 to-violet-600"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  MAIN LANDING PAGE                                      */
/* ─────────────────────────────────────────────────────── */
export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [particlesInit, setParticlesInit] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const [rawMouseX, setRawMouseX] = useState(0.5);
  const [rawMouseY, setRawMouseY] = useState(0.5);

  // Redirect if logged in
  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleStartBuilding = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    navigate("/login");
  };

  // Particles init
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesInit(true));
  }, []);

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mouse tracking
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const mx = e.clientX / window.innerWidth;
    const my = e.clientY / window.innerHeight;
    mouseX.set(mx);
    mouseY.set(my);
    setRawMouseX(mx);
    setRawMouseY(my);
  }, [mouseX, mouseY]);

  const particlesLoaded = useCallback(async (_container: Container | undefined) => {}, []);

  return (
    <div
      className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* ── BACKGROUND GRADIENT BLOBS ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{
            x: useTransform(springX, [0, 1], [-40, 40]),
            y: useTransform(springY, [0, 1], [-40, 40]),
          }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[120px]"
        />
        <motion.div
          style={{
            x: useTransform(springX, [0, 1], [40, -40]),
            y: useTransform(springY, [0, 1], [40, -40]),
          }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-[120px]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-indigo-600/8 blur-[140px]" />
      </div>

      {/* ── PARTICLES ── */}
      {particlesInit && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={PARTICLES_CONFIG}
          className="fixed inset-0 pointer-events-none"
        />
      )}

      {/* ── GRID OVERLAY ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Animation Overlay */}
      {showAnimation && <TransitionAnimation onComplete={handleAnimationComplete} />}

      {/* ── NAVBAR ── */}
      <Navbar scrolled={scrolled} />

      {/* ════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ── LEFT: Text + CTAs ── */}
          <div className="relative z-10 flex flex-col items-start">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-300 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Powered by 2,400+ Student Builders
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="font-heading text-5xl sm:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
            >
              Build Teams.{" "}
              <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                Create Impact.
              </span>{" "}
              Get Discovered.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg sm:text-xl text-white/55 leading-relaxed max-w-xl mb-10"
            >
              Join 2,400+ students building real-world projects. Find your perfect team, collaborate with peers, and turn your ideas into reality.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <button
                onClick={handleStartBuilding}
                className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-xl shadow-sky-500/25 hover:shadow-sky-500/45 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Join Community
                <Users className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 hover:scale-105 active:scale-95 transition-all"
              >
                Browse Teammates
                <Users className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-6 mb-8"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                    {s.value}
                  </p>
                  <p className="text-xs text-white/40">{s.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Activity ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <ActivityTicker />
            </motion.div>
          </div>

          {/* ── RIGHT: Dashboard Mock + Floating Cards ── */}
          <div className="relative flex justify-center items-center">
            {/* Floating background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-sky-500/10 rounded-3xl blur-3xl" />

            {/* Main dashboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
              className="relative w-full"
            >
              <DashboardMock mouseX={rawMouseX} mouseY={rawMouseY} />
            </motion.div>

            {/* Floating Mini Cards */}
            <MiniCard
              delay={1.1}
              floatOffset={10}
              className="absolute -top-4 -left-4 sm:-left-8 flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                <Brain className="w-3 h-3 text-white" />
              </div>
              <span className="text-white/80">AI Match: <span className="text-sky-300 font-bold">92%</span></span>
            </MiniCard>

            <MiniCard
              delay={1.25}
              floatOffset={7}
              className="absolute -bottom-4 -left-2 sm:-left-6 flex items-center gap-2"
            >
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span className="text-white/80">Projects: <span className="text-cyan-300 font-bold">120+</span></span>
            </MiniCard>

            <MiniCard
              delay={1.4}
              floatOffset={12}
              className="absolute top-1/2 -right-4 sm:-right-8 -translate-y-1/2 flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-sky-400" />
              <span className="text-white/80 text-xs">Top Contributors</span>
            </MiniCard>

            <MiniCard
              delay={1.55}
              floatOffset={6}
              className="absolute top-6 right-0 sm:-right-4 flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="text-white/80 text-xs">+38% this week</span>
            </MiniCard>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/30"
        >
          <span className="text-xs">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════════════════
          FEATURES SECTION
      ════════════════════════════════════════════════════ */}
      <section id="features" className="relative py-28 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-3"
            >
              Everything you need
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4"
            >
              Built for student{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                builders
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/50 text-lg max-w-2xl mx-auto"
            >
              From idea to shipped product — CodeMate X gives your team every tool to collaborate, ship, and grow.
            </motion.p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`group rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 p-6 transition-all hover:shadow-xl hover:${f.glow} cursor-pointer`}
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SOCIAL PROOF / CTA STRIP
      ════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-sky-600/20 via-cyan-600/10 to-blue-600/20 border border-sky-500/20 p-10 sm:p-14 text-center relative overflow-hidden"
          >
            {/* Inner decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-sky-500/5 rounded-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Join 2,400+ Students
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-bold text-white mb-5">
                Your next great project{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  starts here.
                </span>
              </h2>
              <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto">
                Stop searching for teammates on Discord. Let AI find your perfect match in seconds.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/signup"
                  className="group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 active:scale-95 transition-all"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 rounded-2xl font-semibold text-white/70 border border-white/10 hover:bg-white/5 hover:text-white transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          LEADERBOARD PREVIEW SECTION
      ════════════════════════════════════════════════════ */}
      <section id="leaderboard" className="relative py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
              Top Performers on{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                CodeMate X
              </span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Meet the top contributors and builders in our community
            </p>
          </motion.div>

          {/* Top 3 Leaderboard */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { rank: 1, name: "Priya Sharma", dept: "CSE", points: 285, medal: "🥇", color: "from-yellow-400 to-yellow-600" },
              { rank: 2, name: "Rahul Mehta", dept: "IT", points: 240, medal: "🥈", color: "from-gray-300 to-gray-500" },
              { rank: 3, name: "Sneha Kulkarni", dept: "ECE", points: 210, medal: "🥉", color: "from-amber-600 to-amber-800" },
            ].map((student, idx) => (
              <motion.div
                key={student.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative rounded-2xl bg-gradient-to-br ${student.color} p-0.5 overflow-hidden`}
              >
                <div className="relative rounded-2xl bg-slate-950 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{student.medal}</span>
                    <Badge className="bg-gradient-to-r from-cyan-500 to-violet-600">#{student.rank}</Badge>
                  </div>
                  <div>
                    <p className="font-bold text-lg text-white">{student.name}</p>
                    <p className="text-sm text-white/60">{student.dept}</p>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-3xl font-bold text-white">{student.points}</p>
                    <p className="text-xs text-white/50">Activity Points</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View Full Leaderboard CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/45 hover:scale-105 active:scale-95 transition-all"
            >
              View Full Leaderboard
              <Trophy className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          COMMUNITY SUCCESS STORIES
      ════════════════════════════════════════════════════ */}
      <section className="relative py-28 px-5 sm:px-8 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sky-400 text-sm font-semibold tracking-widest uppercase mb-3"
            >
              Community Impact
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4"
            >
              What Our{" "}
              <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">
                Users Say
              </span>
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya Sharma",
                role: "3rd Year, CSE",
                message: "CodeMate X helped me find the perfect team for my AI project. We shipped in 8 weeks!",
                avatar: "PS",
                projects: 3
              },
              {
                name: "Arjun Singh",
                role: "2nd Year, IT",
                message: "The AI matching is insanely accurate. Found teammates I click with instantly.",
                avatar: "AS",
                projects: 5
              },
              {
                name: "Rahul Patel",
                role: "Final Year, CSE",
                message: "From idea to reality. CodeMate X made collaboration seamless. Highly recommend!",
                avatar: "RP",
                projects: 7
              }
            ].map((story, i) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <div className="w-full h-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold rounded-full">
                      {story.avatar}
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{story.name}</p>
                    <p className="text-sm text-white/50">{story.role}</p>
                  </div>
                </div>
                <p className="text-white/70 mb-4 text-sm leading-relaxed">"{story.message}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-blue-500/10">
                  <p className="text-xs text-white/40">{story.projects} Projects Led</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-sky-400">★</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-20 grid sm:grid-cols-4 gap-6 text-center"
          >
            {[
              { value: "2.4K+", label: "Active Students" },
              { value: "380+", label: "Projects Built" },
              { value: "97%", label: "Match Accuracy" },
              { value: "50+", label: "Colleges" }
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-sky-500/30 transition-colors">
                <p className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </p>
                <p className="text-white/50 text-sm">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════ */}
      <footer className="relative border-t border-white/5 py-12 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-heading font-bold text-white/80">
              CodeMate <span className="text-cyan-400">X</span>
            </span>
          </div>
          <p className="text-white/30 text-sm">
            © 2026 CodeMate X · Built by{" "}
            <a
              href="https://github.com/subhmishrasketch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Team Legion
            </a>
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/subhmishrasketch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/subh-kumar-mishra-76a635374/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
