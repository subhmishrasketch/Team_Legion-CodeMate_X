import { createContext, useContext, useState, ReactNode } from "react";

type Role = "student" | "admin";

interface User {
  name: string;
  email: string;
  role: Role;
  initials: string;
  department: string;
  semester?: number;
  skills?: string[];
  phone?: string;
  linkedin?: string;
  github?: string;
}

interface AuthContextType {
  user: User | null;
  /** whether the app is currently running in demo mode */
  demoMode: boolean;
  /** toggle demo mode; affects how login behaves */
  setDemoMode: (value: boolean) => void;
  /**
   * perform authentication; when demoMode is true this simply sets a
   * predefined user, otherwise it should call a real backend service.
   *
   * The credentials parameter is only used when demoMode is false.
   */
  login: (
    role: Role,
    credentials?: { email: string; password: string }
  ) => Promise<void>;
  /**
   * register a new user.  Demo mode will ignore the password and create a
   * fake user record; in production you would POST to your API.
   */
  register: (
    data: Partial<User> & { password: string }
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: Record<Role, User> = {
  student: {
    name: "Subh Mishra", email: "subhkumar.a.mishra24@slrtce.in", role: "student", initials: "SM",
    department: "IT", semester: 4, skills: ["React", "Python", "TypeScript", "ML/AI"],
    phone: "+91 8879298015", linkedin: "https://www.linkedin.com/in/subh-mishra-76a635374/", github: "https://github.com/subhmishrasketch?tab=repositories",
  },
  admin: {
    name: "Dr. Mehra", email: "admin@college.edu", role: "admin", initials: "DM",
    department: "Administration", phone: "+91 99887 76655",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  const login = async (
    role: Role,
    credentials?: { email: string; password: string }
  ) => {
    if (demoMode) {
      // pick one of the canned demo users
      setUser(DEMO_USERS[role]);
    } else {
      // real authentication would go here; for now just stub it out.
      // e.g. const resp = await fetch('/api/login', { method: 'POST', body: JSON.stringify(credentials) });
      // const data = await resp.json();
      // setUser(data.user);
      console.warn("Real login not implemented – received", { role, credentials });
      // simulate a user for demo purposes so app doesn't break
      setUser({
        name: credentials?.email ?? "",
        email: credentials?.email ?? "",
        role,
        initials: "",
        department: "",
      });
    }
  };
  const logout = () => setUser(null);

  const register = async (data: Partial<User> & { password: string }) => {
    if (demoMode) {
      // create a user from the supplied fields, ignoring password
      const initials = data.name
        ? data.name
            .split(" ")
            .map((s) => s[0].toUpperCase())
            .join("")
        : "";
      setUser({
        name: data.name || "",
        email: data.email || "",
        role: data.role || "student",
        initials,
        department: data.department || "",
        semester: data.semester,
        skills: data.skills,
        phone: data.phone,
        linkedin: data.linkedin,
        github: data.github,
      });
    } else {
      // real registration API would go here
      console.warn("Real register not implemented", data);
      setUser({
        name: data.name || "",
        email: data.email || "",
        role: data.role || "student",
        initials: data.name ? data.name.split(" ").map((s) => s[0]).join("") : "",
        department: data.department || "",
      });
    }
  };

  const updateProfile = (data: Partial<User>) =>
    setUser((prev) => (prev ? { ...prev, ...data } : null));

  return (
    <AuthContext.Provider
      value={{
        user,
        demoMode,
        setDemoMode,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
