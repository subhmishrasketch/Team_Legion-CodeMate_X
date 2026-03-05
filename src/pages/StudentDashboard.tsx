import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Users, Trophy, TrendingUp, Zap, Clock, Mail, Phone, UserPlus, Eye, Star, CheckCircle2, ArrowRight, Github, Linkedin, Award, BookOpen, MessageSquare, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initializeSampleData } from "@/lib/initSampleData";

const stats = [
  { label: "Active Projects", value: "24", sub: "+3 this week", icon: FolderOpen, color: "text-primary" },
  { label: "Team Requests", value: "8", sub: "5 pending", icon: Users, color: "text-warning" },
  { label: "Activity Points", value: "145", sub: "+15 this month", icon: Trophy, color: "text-success" },
  { label: "Skill Matches", value: "12", sub: "3 new today", icon: TrendingUp, color: "text-primary" },
];

// User profiles database
const userProfiles: Record<string, any> = {
  "Priya Sharma": { avatar: "P", email: "priya@college.edu", phone: "+91 99887 11223", department: "CSE", semester: "7", skills: ["React", "Python", "TensorFlow", "AR", "UI/UX Design"], github: "https://github.com/priya", linkedin: "https://linkedin.com/in/priya", activityPoints: 285, pastProjects: 8, connections: 42 },
  "Rahul Mehta": { avatar: "R", email: "rahul@college.edu", phone: "+91 98765 44332", department: "CSE", semester: "6", skills: ["React", "Node.js", "IoT", "D3.js", "System Design"], github: "https://github.com/rahul", linkedin: "https://linkedin.com/in/rahul", activityPoints: 215, pastProjects: 6, connections: 38 },
  "Neha Rao": { avatar: "N", email: "neha@college.edu", phone: "+91 91234 56789", department: "IT", semester: "7", skills: ["Python", "OpenCV", "Flask", "React", "ML"], github: "https://github.com/neha", linkedin: "https://linkedin.com/in/neha", activityPoints: 198, pastProjects: 5, connections: 35 },
  "Vikram Patel": { avatar: "V", email: "vikram@college.edu", phone: "+91 88776 55443", department: "CSE", semester: "5", skills: ["React Native", "Node.js", "MongoDB", "Stripe", "AWS"], github: "https://github.com/vikram", linkedin: "https://linkedin.com/in/vikram", activityPoints: 156, pastProjects: 4, connections: 28 },
  "Ananya Iyer": { avatar: "A", email: "ananya@college.edu", phone: "+91 77665 44332", department: "IT", semester: "8", skills: ["TypeScript", "PostgreSQL", "React", "IoT", "DevOps"], github: "https://github.com/ananya", linkedin: "https://linkedin.com/in/ananya", activityPoints: 312, pastProjects: 9, connections: 51 },
  "Rohan Gupta": { avatar: "R", email: "rohan@college.edu", phone: "+91 66554 33221", department: "CSE", semester: "6", skills: ["React", "Node.js", "Docker", "ML/AI", "System Architecture"], github: "https://github.com/rohan", linkedin: "https://linkedin.com/in/rohan", activityPoints: 241, pastProjects: 7, connections: 44 },
};

const projects = [
  {
    title: "AI-Powered Campus Navigator",
    desc: "An intelligent campus navigation system using computer vision and AR to help new students find classrooms, labs, and facilities. Features real-time routing, indoor mapping, and AR-based wayfinding.",
    tags: ["React", "Python", "TensorFlow", "AR"],
    members: "3/5", deadline: "Mar 15, 2026", match: 92,
    author: "Priya Sharma", authorEmail: "priya@college.edu", authorPhone: "+91 99887 11223",
    urgent: true,
    details: {
      technologies: "React, Python, TensorFlow, AR",
      difficulty: "Hard",
      description: "Build a comprehensive campus navigation system with AR visualization and AI-powered route optimization."
    }
  },
  {
    title: "Green Energy Dashboard",
    desc: "Real-time monitoring dashboard for campus solar panels and energy consumption with predictive analytics and alerts.",
    tags: ["React", "Node.js", "IoT", "D3.js"],
    members: "2/4", deadline: "Apr 01, 2026", match: 78,
    author: "Rahul Mehta", authorEmail: "rahul@college.edu", authorPhone: "+91 98765 44332",
    urgent: false,
    details: {
      technologies: "React, Node.js, IoT, D3.js",
      difficulty: "Medium",
      description: "Create a real-time energy monitoring and analytics platform for global campus sustainability."
    }
  },
  {
    title: "Smart Attendance System",
    desc: "Face recognition based attendance system for lecture halls with real-time analytics and automatic report generation.",
    tags: ["Python", "OpenCV", "Flask", "React"],
    members: "1/3", deadline: "Mar 28, 2026", match: 85,
    author: "Neha Rao", authorEmail: "neha@college.edu", authorPhone: "+91 91234 56789",
    urgent: false,
    details: {
      technologies: "Python, OpenCV, Flask, React",
      difficulty: "Medium",
      description: "Develop an automated attendance system using facial recognition technology for educational institutions."
    }
  },
  {
    title: "Campus Food Ordering App",
    desc: "Mobile-first food ordering platform for campus canteens with pre-order, QR payments, and live order tracking.",
    tags: ["React Native", "Node.js", "MongoDB", "Stripe"],
    members: "2/4", deadline: "Apr 15, 2026", match: 72,
    author: "Vikram Patel", authorEmail: "vikram@college.edu", authorPhone: "+91 88776 55443",
    urgent: false,
    details: {
      technologies: "React Native, Node.js, MongoDB, Stripe",
      difficulty: "Medium",
      description: "Create a seamless mobile app for campus food ordering with payment integration and real-time tracking."
    }
  },
  {
    title: "Library Seat Booking System",
    desc: "Web app to check real-time seat availability in the library and book seats with QR-based check-in.",
    tags: ["TypeScript", "PostgreSQL", "React", "IoT"],
    members: "1/3", deadline: "Apr 20, 2026", match: 88,
    author: "Ananya Iyer", authorEmail: "ananya@college.edu", authorPhone: "+91 77665 44332",
    urgent: true,
    details: {
      technologies: "TypeScript, PostgreSQL, React, IoT",
      difficulty: "Easy",
      description: "Build a real-time seat reservation system for library management with QR-based verification."
    }
  },
  {
    title: "Peer Code Review Platform",
    desc: "Platform for students to submit code and get peer reviews with automated quality scoring and gamification.",
    tags: ["React", "Node.js", "Docker", "ML/AI"],
    members: "3/5", deadline: "May 01, 2026", match: 68,
    author: "Rohan Gupta", authorEmail: "rohan@college.edu", authorPhone: "+91 66554 33221",
    urgent: false,
    details: {
      technologies: "React, Node.js, Docker, ML/AI",
      difficulty: "Hard",
      description: "Develop a collaborative code review platform with automated quality analysis and gamification elements."
    }
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [realStats, setRealStats] = useState(stats);
  const [teamRequests, setTeamRequests] = useState<any[]>([]);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);

  useEffect(() => {
    // Initialize sample data for first-time users
    if (user?.email && user?.name) {
      initializeSampleData(user.email, user.name);
    }

    // Calculate real stats from localStorage data
    try {
      const postedKey = "postedProjects";
      const posted = localStorage.getItem(postedKey);
      const postedProjects = posted ? JSON.parse(posted) : [];

      // Get projects owned by current user
      const myProjects = postedProjects.filter((p: any) => p.owner?.email === user?.email);
      setActiveProjects(myProjects);

      // Calculate team requests
      const requests: any[] = [];
      myProjects.forEach((project: any) => {
        if (project.joinRequests && project.joinRequests.length > 0) {
          project.joinRequests.forEach((request: any) => {
            requests.push({
              ...request,
              projectTitle: project.title,
              projectMembers: (project.acceptedMembers?.length || 0) + 1 // +1 for owner
            });
          });
        }
      });
      setTeamRequests(requests);

      // Update stats with real data
      const updatedStats = [
        { 
          label: "Active Projects", 
          value: myProjects.length.toString(), 
          sub: `${requests.length} pending requests`, 
          icon: FolderOpen, 
          color: "text-primary" 
        },
        { 
          label: "Team Requests", 
          value: requests.length.toString(), 
          sub: `${requests.length > 0 ? requests.length : 'No'} pending`, 
          icon: Users, 
          color: "text-warning" 
        },
        { 
          label: "Activity Points", 
          value: "145", 
          sub: "+15 this month", 
          icon: Trophy, 
          color: "text-success" 
        },
        { 
          label: "Skill Matches", 
          value: projects.length.toString(), 
          sub: "projects available", 
          icon: TrendingUp, 
          color: "text-primary" 
        },
      ];
      setRealStats(updatedStats);
    } catch (err) {
      console.error("Error calculating stats:", err);
    }
  }, [user]);

  const handleJoin = (projectTitle: string) => {
    toast.success(`Request sent to join "${projectTitle}"! 🎉`);
    setSelectedProject(null);
  };

  const openProfile = (author: string) => {
    setSelectedProfile(userProfiles[author] ? { name: author, ...userProfiles[author] } : null);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item}>
        <h1 className="font-heading text-3xl font-bold">
          Welcome back, <span className="text-gradient">{user?.name?.split(" ")[0]}</span> 👋
        </h1>
        <p className="mt-1 text-muted-foreground">Find your next team or discover innovative projects to join.</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {realStats.map((s, idx) => (
          <motion.div 
            key={s.label} 
            onClick={() => setSelectedStat(s.label)}
            whileHover={{ y: -4, boxShadow: "0 8px 16px rgba(0,0,0,0.1)" }}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all cursor-pointer">
            <div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="mt-1 font-heading text-3xl font-bold">{s.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recommended Projects */}
      <motion.div variants={item}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold">Recommended Projects</h2>
          <span className="text-sm text-muted-foreground">{projects.length} projects available</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p, idx) => (
            <motion.div 
              key={p.title} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.15)" }}
              onClick={() => setSelectedProject(p)}
              className="rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md flex flex-col cursor-pointer group">
              <div className="mb-3 flex items-center gap-2">
                {p.urgent && (
                  <Badge variant="destructive" className="text-[10px]">
                    <Zap className="mr-1 h-3 w-3" /> Urgent
                  </Badge>
                )}
                <Badge variant="secondary" className="text-[10px] bg-success/10 text-success border-0">Open</Badge>
                <Badge variant="secondary" className="text-[10px] ml-auto">
                  {p.match >= 90 ? "⭐ Perfect" : p.match >= 80 ? "⭐ Great" : "Good match"}
                </Badge>
              </div>
              <h3 className="font-heading text-base font-semibold group-hover:text-primary transition-colors">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.slice(0, 3).map((t) => (
                  <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                ))}
                {p.tags.length > 3 && <Badge variant="outline" className="text-[10px]">+{p.tags.length - 3}</Badge>}
              </div>
              <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {p.members}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {p.deadline}</span>
              </div>

              {/* Author */}
              <motion.div whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }} className="mt-3 rounded-lg bg-muted/50 p-2.5 transition-colors">
                <p className="text-xs font-medium mb-1 flex items-center gap-1">
                  <Star className="h-3 w-3 text-warning" /> {p.author}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Mail className="h-3 w-3" /> {p.authorEmail}</span>
                </div>
              </motion.div>

              {/* Match */}
              <div className="mt-3 flex-1" />
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Skill Match</span>
                  <span className={`font-semibold ${p.match >= 90 ? "text-success" : p.match >= 80 ? "text-primary" : "text-warning"}`}>{p.match}%</span>
                </div>
                <Progress value={p.match} className="mt-1 h-2" />
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex gap-2">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(p);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-border py-2 text-sm font-medium hover:bg-muted/50 transition-colors">
                  <Eye className="h-4 w-4" /> Details
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoin(p.title);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 rounded-lg gradient-primary py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                  <UserPlus className="h-4 w-4" /> Join
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl">
              
              {/* Header with gradient */}
              <div className="sticky top-0 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5 p-6 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {selectedProject.urgent && (
                        <Badge variant="destructive" className="text-[10px]">
                          <Zap className="mr-1 h-3 w-3" /> Urgent
                        </Badge>
                      )}
                      <Badge className="text-[10px]">
                        {selectedProject.match >= 90 ? "⭐⭐⭐ Perfect" : selectedProject.match >= 80 ? "⭐⭐ Great" : "⭐ Good"}
                      </Badge>
                    </div>
                    <h2 className="font-heading text-2xl font-bold">{selectedProject.title}</h2>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedProject(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors">
                    ✕
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Overview */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" /> Project Overview
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{selectedProject.desc}</p>
                  <p className="text-sm text-foreground">{selectedProject.details.description}</p>
                </div>

                {/* Project Details Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Difficulty</p>
                    <p className="text-sm font-semibold">{selectedProject.details.difficulty}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Team Slots</p>
                    <p className="text-sm font-semibold">{selectedProject.members}</p>
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="font-semibold mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((t) => (
                      <Badge key={t} className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>

                {/* Timeline & Contact */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground mb-2">DEADLINE</h3>
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4 text-warning" /> {selectedProject.deadline}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground mb-2">SKILL MATCH</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Progress value={selectedProject.match} className="h-2" />
                      </div>
                      <span className={`text-sm font-semibold ${selectedProject.match >= 90 ? "text-success" : selectedProject.match >= 80 ? "text-primary" : "text-warning"}`}>
                        {selectedProject.match}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Project Lead */}
                <motion.div whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }} className="rounded-lg bg-muted/30 p-4 border border-border transition-colors cursor-pointer group" onClick={() => openProfile(selectedProject.author)}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" /> Project Lead
                  </h3>
                  <div className="space-y-2">
                    <motion.p whileHover={{ color: "var(--color-primary)" }} className="font-semibold text-sm group-hover:text-primary transition-colors">{selectedProject.author}</motion.p>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> {selectedProject.authorEmail}</span>
                      <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> {selectedProject.authorPhone}</span>
                    </div>
                  </div>
                  <motion.p className="text-xs text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <eye className="h-3 w-3" /> View Profile
                  </motion.p>
                </motion.div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 border-t border-border bg-card p-6 flex gap-3">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedProject(null)}
                  className="flex-1 rounded-lg border border-border py-2.5 text-sm font-semibold hover:bg-muted/50 transition-colors">
                  Cancel
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleJoin(selectedProject.title)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg gradient-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                  <UserPlus className="h-4 w-4" /> Ask to Join Project
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Modal */}
      <AnimatePresence>
        {selectedProfile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProfile(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-2xl border border-border/50 bg-card backdrop-blur-xl overflow-hidden shadow-2xl">
              
              {/* Header with gradient background */}
              <div className="h-32 bg-gradient-to-r from-teal-500/20 via-indigo-500/20 to-blue-500/20 relative">
                <motion.button
                  onClick={() => setSelectedProfile(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-muted rounded-lg transition-colors z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="px-6 pb-6">
                {/* Avatar */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-end gap-4 -mt-16 mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-card shadow-lg">
                    {selectedProfile.avatar}
                  </div>
                  <div className="flex-1 pb-2">
                    <h1 className="text-2xl font-bold">{selectedProfile.name}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Badge variant="outline">{selectedProfile.department}</Badge>
                      <span>Sem {selectedProfile.semester}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Stats */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="grid grid-cols-3 gap-4 mb-6">
                  <div className="rounded-lg bg-primary/10 border border-primary/30 p-4 text-center">
                    <p className="text-3xl font-bold text-primary">{selectedProfile.activityPoints}</p>
                    <p className="text-xs text-muted-foreground mt-1">Activity Points</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 border border-primary/30 p-4 text-center">
                    <p className="text-3xl font-bold text-primary">{selectedProfile.pastProjects}</p>
                    <p className="text-xs text-muted-foreground mt-1">Past Projects</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 border border-primary/30 p-4 text-center">
                    <p className="text-3xl font-bold text-primary">{selectedProfile.connections}</p>
                    <p className="text-xs text-muted-foreground mt-1">Connections</p>
                  </div>
                </motion.div>

                {/* Skills */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" /> Skills & Expertise
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProfile.skills.map((skill: string) => (
                      <motion.span
                        key={skill}
                        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-500/10 to-indigo-500/10 text-primary text-sm font-medium border border-primary/30"
                        whileHover={{ scale: 1.1, y: -2 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" /> Get in Touch
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3 mb-6">
                    <motion.a
                      href={`mailto:${selectedProfile.email}`}
                      className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted hover:border-primary/50 transition-all"
                      whileHover={{ x: 4 }}
                    >
                      <Mail className="h-5 w-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium truncate">{selectedProfile.email}</p>
                      </div>
                    </motion.a>
                    <motion.a
                      href={`tel:${selectedProfile.phone}`}
                      className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted hover:border-primary/50 transition-all"
                      whileHover={{ x: 4 }}
                    >
                      <Phone className="h-5 w-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium truncate">{selectedProfile.phone}</p>
                      </div>
                    </motion.a>
                  </div>
                </motion.div>

                {/* Social Links */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Profiles
                  </h3>
                  <div className="flex gap-3">
                    <motion.a
                      href={selectedProfile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg gradient-primary text-white font-semibold transition-opacity hover:opacity-90"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="h-5 w-5" /> GitHub
                    </motion.a>
                    <motion.a
                      href={selectedProfile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-primary/50 text-primary font-semibold hover:bg-primary/10 transition-all"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Linkedin className="h-5 w-5" /> LinkedIn
                    </motion.a>
                  </div>
                </motion.div>

                {/* Action Button */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mt-6 flex gap-3">
                  <motion.button
                    onClick={() => {
                      toast.success(`Connection request sent to ${selectedProfile.name}! 🤝`);
                      setSelectedProfile(null);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg gradient-primary text-white font-semibold transition-opacity hover:opacity-90"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <UserPlus className="h-5 w-5" /> Send Connection Request
                  </motion.button>
                  <motion.button
                    onClick={() => setSelectedProfile(null)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border/50 font-semibold hover:bg-muted transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stat Details Modal */}
      <AnimatePresence>
        {selectedStat && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStat(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full ${selectedStat === "Active Projects" || selectedStat === "Team Requests" ? "max-w-2xl" : "max-w-md"} rounded-2xl border border-border bg-card shadow-2xl max-h-[80vh] overflow-y-auto`}>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-bold">{selectedStat}</h2>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setSelectedStat(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors">
                    ✕
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {selectedStat === "Active Projects" && (
                    <div className="space-y-4">
                      {activeProjects.length > 0 ? (
                        <>
                          <p className="text-sm text-muted-foreground mb-4">You have {activeProjects.length} active projects. {realStats[0].sub}</p>
                          <div className="space-y-3">
                            {activeProjects.map((proj, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-4 rounded-lg border border-border bg-muted/30">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm">{proj.title}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">You're the Lead</p>
                                  </div>
                                  <Badge className="text-xs">In Progress</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{proj.desc}</p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {(proj.acceptedMembers?.length || 0) + 1}/5 members</span>
                                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {proj.deadline}</span>
                                </div>
                                <div className="flex gap-2">
                                  <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => {
                                      setSelectedStat(null);
                                      navigate(`/my-projects/${encodeURIComponent(proj.title)}`);
                                    }}
                                    className="flex-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                                    View Project
                                  </motion.button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <FolderOpen className="h-16 w-16 text-primary mx-auto mb-4" />
                          <p className="text-muted-foreground">No active projects yet. Join a project to get started!</p>
                        </div>
                      )}
                    </div>
                  )}
                  {selectedStat === "Team Requests" && (
                    <div className="space-y-4">
                      {teamRequests.length > 0 ? (
                        <>
                          <p className="text-sm text-muted-foreground mb-4">You have {teamRequests.length} pending join requests. Accept to add them to your project team.</p>
                          <div className="space-y-3 max-h-96">
                            {teamRequests.map((request, idx) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-4 rounded-lg border border-border bg-muted/30">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <p className="font-semibold text-sm">{request.name}</p>
                                    <p className="text-xs text-muted-foreground">{request.email} • {request.department}</p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">{request.skills?.slice(0, 2).join(", ")}</Badge>
                                </div>
                                <div className="bg-muted/50 p-3 rounded-lg my-3 border border-border/50">
                                  <p className="text-xs font-semibold text-primary mb-1">📁 {request.projectTitle}</p>
                                  <p className="text-xs text-muted-foreground">👥 Current team: {request.projectMembers} members</p>
                                </div>
                                <div className="flex gap-2">
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      toast.success(`${request.name} has been added to ${request.projectTitle}! 🎉`);
                                    }}
                                    className="flex-1 px-3 py-1.5 text-xs bg-success text-white rounded-lg hover:bg-success/90 transition-colors font-medium">
                                    ✓ Accept
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      toast.success(`Request from ${request.name} declined.`);
                                    }}
                                    className="flex-1 px-3 py-1.5 text-xs bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium border border-border">
                                    ✕ Decline
                                  </motion.button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="h-16 w-16 text-warning mx-auto mb-4" />
                          <p className="text-muted-foreground">No pending team requests at the moment.</p>
                        </div>
                      )}
                    </div>
                  )}
                  {selectedStat === "Activity Points" && (
                    <div className="text-center py-8">
                      <Trophy className="h-16 w-16 text-success mx-auto mb-4" />
                      <p className="text-muted-foreground">You've earned 145 activity points this month.</p>
                      <p className="text-sm text-muted-foreground mt-2">+15 points from recent projects!</p>
                    </div>
                  )}
                  {selectedStat === "Skill Matches" && (
                    <div className="text-center py-8">
                      <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground">{realStats[3].value} projects match your skills perfectly.</p>
                      <p className="text-sm text-muted-foreground mt-2">{realStats[3].sub}</p>
                    </div>
                  )}
                </div>

                <motion.button 
                  onClick={() => setSelectedStat(null)}
                  className="w-full mt-6 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted transition-colors"
                  whileHover={{ scale: 1.02 }}>
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default StudentDashboard;
