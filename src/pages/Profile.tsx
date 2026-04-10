import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Mail, Phone, Github, Linkedin, BookOpen, GraduationCap, Wrench, Save, RefreshCw, Calendar, Camera, ExternalLink, Star, GitBranch } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const ALL_SKILLS = [
  "React", "Node.js", "Python", "Java", "TypeScript", "MongoDB", "PostgreSQL",
  "Flutter", "ML/AI", "IoT", "DevOps", "UI/UX", "Figma", "Docker", "AWS",
  "TensorFlow", "C++", "Rust", "Go",
];

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [semester, setSemester] = useState(user?.semester?.toString() || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [linkedin, setLinkedin] = useState(user?.linkedin || "");
  const [github, setGithub] = useState(user?.github || "");
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [adopted, setAdopted] = useState<any[]>([]);
  const [photo, setPhoto] = useState(user?.photo || "");
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);

  const toggleSkill = (skill: string) => {
    setSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
  };

  const fetchGitHubRepos = async () => {
    if (!github) {
      toast.error("Please enter your GitHub username first");
      return;
    }

    setLoadingRepos(true);
    try {
      // Extract username from github URL or use directly if it's just a username
      const username = github.split('/').filter(Boolean).pop() || github;
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub repositories");
      }

      const repos = await response.json();
      setGithubRepos(repos);
      
      if (repos.length === 0) {
        toast.info("No public repositories found");
      } else {
        toast.success(`Fetched ${repos.length} repositories! 🎉`);
      }
    } catch (err) {
      console.error("GitHub fetch error:", err);
      toast.error("Failed to fetch GitHub repositories. Check your username and try again.");
    } finally {
      setLoadingRepos(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setPhoto(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({ name, department, semester: parseInt(semester) || undefined, phone, linkedin, github, skills, photo });
    toast.success("Profile updated successfully! ✅");
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("adoptedIdeas");
      const list = raw ? JSON.parse(raw) : [];
      const mine = user?.email ? list.filter((a: any) => a.adoptedBy === user.email) : [];
      setAdopted(mine);
    } catch (e) {
      setAdopted([]);
    }
  }, [user?.email]);

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <Avatar className="h-20 w-20">
              {photo ? (
                <img src={photo} alt="Profile" className="h-full w-full object-cover rounded-full" />
              ) : (
                <AvatarFallback className="gradient-primary text-2xl font-bold text-primary-foreground">{user?.initials}</AvatarFallback>
              )}
            </Avatar>
            <label htmlFor="photo-upload" className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/80 transition-colors">
              <Camera className="h-3 w-3 text-primary-foreground" />
            </label>
              <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} title="Upload profile photo" className="hidden" />
          </motion.div>
          <div>
            <h1 className="font-heading text-2xl font-bold">{user?.name}</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role} · {user?.department}</p>
          </div>
        </div>

        {/* Form */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6 space-y-5">
          <h2 className="font-heading text-lg font-bold">Personal Information</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium"><User className="h-3.5 w-3.5" /> Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} title="Enter your full name" placeholder="Your full name"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium"><Mail className="h-3.5 w-3.5" /> Email</label>
              <input value={email} disabled title="Your email address"
                className="h-10 w-full rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium"><BookOpen className="h-3.5 w-3.5" /> Department</label>
              <select value={department} onChange={(e) => setDepartment(e.target.value)} title="Select your department"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                <option value="">Select</option>
                {["CSE", "IT", "ECE", "ME", "CE", "EE", "Administration"].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            {user?.role === "student" && (
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-sm font-medium"><GraduationCap className="h-3.5 w-3.5" /> Semester</label>
                <select value={semester} onChange={(e) => setSemester(e.target.value)} title="Select your semester"
                  className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                  <option value="">Select</option>
                  {[1,2,3,4,5,6,7,8].map((s) => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
            )}
          </div>

          <h2 className="font-heading text-lg font-bold pt-2">Contact Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium"><Phone className="h-3.5 w-3.5" /> Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium"><Linkedin className="h-3.5 w-3.5" /> LinkedIn</label>
              <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/..."
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium"><Github className="h-3.5 w-3.5" /> GitHub</label>
            <div className="flex gap-2">
              <input value={github} onChange={(e) => setGithub(e.target.value)} placeholder="github.com/..."
                className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              <motion.button
                type="button"
                onClick={fetchGitHubRepos}
                disabled={loadingRepos}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50">
                <RefreshCw className={`h-4 w-4 ${loadingRepos ? 'animate-spin' : ''}`} /> Fetch
              </motion.button>
            </div>
          </div>

          {user?.role === "student" && (
            <>
              <h2 className="font-heading text-lg font-bold pt-2 flex items-center gap-2"><Wrench className="h-5 w-5" /> Skills</h2>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map((s) => (
                  <motion.button 
                    key={s} 
                    type="button" 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSkill(s)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                      skills.includes(s) ? "gradient-primary text-primary-foreground shadow-md" : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                    }`}>{s}</motion.button>
                ))}
              </div>
            </>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg gradient-cta px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
            <Save className="h-4 w-4" /> Save Changes
          </motion.button>
        </motion.div>

        {/* GitHub Repositories */}
        {githubRepos.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-primary" />
              <h2 className="font-heading text-lg font-bold">GitHub Projects</h2>
              <Badge variant="secondary" className="ml-auto">{githubRepos.length} repos</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {githubRepos.map((repo, idx) => (
                <motion.a 
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                  className="rounded-lg border border-border hover:border-primary/50 bg-card p-4 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                        <Github className="h-4 w-4" /> {repo.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{repo.owner?.login}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{repo.description || "No description"}</p>
                  <div className="flex items-center gap-3 text-xs">
                    {repo.language && (
                      <Badge variant="secondary" className="text-[10px]">{repo.language}</Badge>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Star className="h-3 w-3" /> {repo.stargazers_count}
                      </span>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Adopted Ideas */}
        {adopted.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="rounded-xl border-2 border-success/20 bg-gradient-to-br from-success/5 to-success/10 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-success" />
              <h2 className="font-heading text-lg font-bold">Adopted Ideas</h2>
              <Badge variant="secondary" className="ml-auto">{adopted.length} total</Badge>
            </div>
            <div className="grid gap-4">
              {adopted.map((a, idx) => (
                <motion.div 
                  key={a.title + a.adoptedAt} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="rounded-lg border border-border bg-card p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-heading font-semibold">{a.title}</p>
                        <Badge variant="outline" className="text-[10px] text-success">Active</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{a.desc}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(a.tags || []).map((t: string) => (
                          <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground shrink-0">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(a.adoptedAt).toLocaleDateString()}
                      </div>
                      <div className="mt-1 text-[10px]">by {a.author || "unknown"}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Profile;
