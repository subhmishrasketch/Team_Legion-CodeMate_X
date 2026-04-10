import { DashboardLayout } from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { THEME_COLORS, ANIMATION_CONFIG } from "@/lib/designTheme";

const ALL_SKILLS = [
  "React", "Node.js", "Python", "Java", "TypeScript", "MongoDB", "PostgreSQL",
  "Flutter", "ML/AI", "IoT", "DevOps", "UI/UX", "Figma", "Docker", "AWS",
  "TensorFlow", "C++", "Rust", "Go", "Kotlin", "Swift",
];

const TEAM_SIZES = ["2 members", "3 members", "4 members", "5 members", "6+ members"];

const PostProject = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState("");
  const [deadline, setDeadline] = useState("");
  const [pitchVideo, setPitchVideo] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [status, setStatus] = useState("Planning");

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || selectedSkills.length === 0 || !teamSize) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const newProject = {
        title,
        desc: description,
        tags: selectedSkills,
        members: "1/" + teamSize.split(" ")[0],
        deadline,
        match: 100,
        author: user?.name || "Anonymous",
        authorEmail: user?.email || "",
        authorPhone: user?.phone || "",
        urgent: false,
        details: {
          technologies: selectedSkills.join(", "),
          difficulty: difficulty,
          description,
        },
        owner: {
          name: user?.name || "Anonymous",
          email: user?.email || ""
        },
        joinRequests: [],
        acceptedMembers: [],
        postedBy: user?.email,
        postedAt: new Date().toISOString(),
        github: githubLink,
        status: status,
        role: "Project Owner",
        teamMembers: [],
      };

      const key = "postedProjects";
      const existing = localStorage.getItem(key);
      const projects = existing ? JSON.parse(existing) : [];
      projects.push(newProject);
      localStorage.setItem(key, JSON.stringify(projects));

      toast.success("Project posted successfully! 🎉");
      navigate("/my-projects");
    } catch (err) {
      toast.error("Failed to post project");
    }
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl blur-xl" />
          <div className="relative rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 to-transparent p-8">
            <h1 className="font-heading text-4xl font-bold mb-2">
              ✨ Launch Your <span className="text-gradient">Next Big Project</span>
            </h1>
            <p className="text-lg text-muted-foreground">Post an innovative project and find talented teammates who share your vision.</p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Project Basics */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-border/50 bg-card p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <span className="text-2xl">📝</span> Project Basics
              </h2>
              <p className="text-sm text-muted-foreground">Tell us about your project idea</p>
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-semibold">Project Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., AI-Powered Campus Navigator"
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30" />
              <p className="text-xs text-muted-foreground mt-1">Make it catchy and descriptive</p>
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block text-sm font-semibold">Project Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5}
                placeholder="Describe your project idea, goals, problem you're solving, and expected outcome..."
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 resize-none" />
              <p className="text-xs text-muted-foreground mt-1">The more detailed, the better team matches you'll get</p>
            </div>
          </motion.div>

          {/* Section 2: Technical Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border/50 bg-card p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <span className="text-2xl">🛠️</span> Technical Details
              </h2>
              <p className="text-sm text-muted-foreground">Specify technology stack and requirements</p>
            </div>

            {/* Skills */}
            <div>
              <label className="mb-3 block text-sm font-semibold">Required Technologies</label>
              <p className="text-xs text-muted-foreground mb-3">Select all relevant technologies</p>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((s) => (
                  <motion.button key={s} type="button" onClick={() => toggleSkill(s)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      selectedSkills.includes(s)
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30"
                        : "border border-border text-muted-foreground hover:border-primary hover:text-primary dark:hover:bg-primary/10"
                    }`}>
                    {s}
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Selected: {selectedSkills.length > 0 ? selectedSkills.join(", ") : "None"}</p>
            </div>

            {/* Difficulty & Status */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Difficulty Level</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} title="Select difficulty level"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30">
                  <option value="Easy">🟢 Easy - Beginner friendly</option>
                  <option value="Medium">🟡 Medium - Some experience needed</option>
                  <option value="Hard">🔴 Hard - Expert level</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Project Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} title="Select project status"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30">
                  <option value="Planning">🎯 Planning - Forming team</option>
                  <option value="Active">⚡ Active - In development</option>
                  <option value="On Hold">⏸️ On Hold - Paused</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Section 3: Team & Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border/50 bg-card p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <span className="text-2xl">👥</span> Team & Timeline
              </h2>
              <p className="text-sm text-muted-foreground">Define team size and project deadline</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Team Size</label>
                <select value={teamSize} onChange={(e) => setTeamSize(e.target.value)} title="Select team size"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30">
                  <option value="">Select team size</option>
                  {TEAM_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Target Deadline</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} title="Select deadline date"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
          </motion.div>

          {/* Section 4: Repository & Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-2xl border border-border/50 bg-card p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                <span className="text-2xl">🔗</span> Links & Resources
              </h2>
              <p className="text-sm text-muted-foreground">Add GitHub repo and other helpful links</p>
            </div>

            {/* GitHub */}
            <div>
              <label className="mb-2 block text-sm font-semibold">GitHub Repository Link</label>
              <input type="url" value={githubLink} onChange={(e) => setGithubLink(e.target.value)}
                placeholder="https://github.com/yourusername/project-name"
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30" />
              <p className="text-xs text-muted-foreground mt-1">🔓 Make sure the repo is public so team members can contribute</p>
            </div>

            {/* Pitch Video */}
            <div>
              <label className="mb-2 block text-sm font-semibold">Pitch Video Link (optional)</label>
              <input value={pitchVideo} onChange={(e) => setPitchVideo(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or any video link"
                className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30" />
              <p className="text-xs text-muted-foreground mt-1">🎬 A 1-2 min video can help attract better team members</p>
            </div>
          </motion.div>

          {/* Submit Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3">
            <motion.button type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-8 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30">
              🚀 Post Project
            </motion.button>
            <motion.button type="button" onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="h-12 rounded-xl border border-border px-6 font-medium text-muted-foreground hover:bg-muted transition-colors">
              Cancel
            </motion.button>
          </motion.div>
        </form>

        {/* Tips Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">💡 Tips for Success</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Write a detailed description - it helps in team matching</li>
            <li>✓ Set realistic deadlines - teams appreciate achievable goals</li>
            <li>✓ Include a GitHub repo - shows you're serious about the project</li>
            <li>✓ Be specific about skills - helps find the right people</li>
          </ul>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default PostProject;
