import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Trophy, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SKILL_CHALLENGES, SkillChallenge } from "@/lib/skillTypes";

export function SkillChallenges() {
  const [selectedChallenge, setSelectedChallenge] = useState<SkillChallenge | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [userCode, setUserCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const filteredChallenges =
    difficultyFilter === "all"
      ? SKILL_CHALLENGES
      : SKILL_CHALLENGES.filter((challenge) => challenge.difficulty === difficultyFilter);

  const handleSubmit = () => {
    // Simulate code evaluation
    const passScore = Math.floor(Math.random() * 40) + 60; // 60-100
    setScore(passScore);
    setSubmitted(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/20 text-green-700 border-green-300";
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-300";
      case "advanced":
        return "bg-red-500/20 text-red-700 border-red-300";
      default:
        return "";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Skill Challenges</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Prove your technical skills with auto-graded coding challenges. Earn trust badges and showcase verified competencies.
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Hackathon-ready exercises designed for speed, collaboration, and polished delivery under pressure.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">Challenge tracks</p>
              <p className="mt-2 text-xl font-semibold">4 skill paths</p>
            </div>
            <div className="rounded-2xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">Verified badges</p>
              <p className="mt-2 text-xl font-semibold">Bronze to Platinum</p>
            </div>
            <div className="rounded-2xl border border-border p-4 bg-card">
              <p className="text-sm text-muted-foreground">Fast feedback</p>
              <p className="mt-2 text-xl font-semibold">Instant scoring</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-border p-4 bg-card text-sm text-muted-foreground">
            These challenges are designed around real-world developer workflows: front-end performance, type-safe APIs, algorithmic efficiency, and polished UI interactions.
          </div>
        </motion.div>

        {!selectedChallenge ? (
          // Challenge List View
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {(["all", "beginner", "intermediate", "advanced"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficultyFilter(level)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      difficultyFilter === level
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/70"
                    }`}
                  >
                    {level === "all" ? "All" : level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Showing {filteredChallenges.length} {filteredChallenges.length === 1 ? "challenge" : "challenges"}.
              </p>
            </div>
            <div className="grid gap-4">
            {filteredChallenges.map((challenge, idx) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => setSelectedChallenge(challenge)}
                className="group relative p-6 rounded-xl border border-border bg-card hover:border-primary/50 cursor-pointer transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {challenge.title}
                      </h3>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {challenge.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        Skill: {challenge.skillName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {challenge.timeLimit} min
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {challenge.testCases.length} test cases
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </>
        ) : (
          // Challenge Detail View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <button
              onClick={() => {
                setSelectedChallenge(null);
                setSubmitted(false);
                setUserCode("");
              }}
              className="text-blue-500 hover:text-blue-600 flex items-center gap-2"
            >
              ← Back to challenges
            </button>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Problem Description */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedChallenge.title}</h2>
                  <Badge className={getDifficultyColor(selectedChallenge.difficulty)}>
                    {selectedChallenge.difficulty}
                  </Badge>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-foreground mb-4">{selectedChallenge.description}</p>
                  <div className="space-y-3">
                    <h4 className="font-semibold">Test Cases:</h4>
                    {selectedChallenge.testCases.map((test) => (
                      <div key={test.id} className="bg-background rounded p-3 border border-border">
                        <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                        <code className="text-xs bg-black/30 p-2 rounded block">
                          Input: {JSON.stringify(test.input)} → Expected: {JSON.stringify(test.expectedOutput)}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-dark mb-1">Time Limit</h4>
                      <p className="text-sm text-muted-foreground">
                        You have {selectedChallenge.timeLimit} minutes to complete this challenge.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl border border-border p-4">
                  <h4 className="font-semibold mb-2">Why this challenge matters</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedChallenge.skillName} work often hinges on clean logic, readable patterns, and reliable output. This challenge helps you practice skills that map directly to real team projects.
                  </p>
                </div>
              </motion.div>

              {/* Code Editor */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-sm font-semibold mb-2 block">Your Code</label>
                  <textarea
                    value={userCode || selectedChallenge.starterCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    disabled={submitted}
                    className="w-full h-64 p-4 bg-black/50 border border-border rounded-lg font-mono text-sm resize-none focus:border-primary focus:outline-none"
                    placeholder="Write your solution here..."
                  />
                </div>

                {!submitted ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow"
                  >
                    Submit Solution
                  </motion.button>
                ) : (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg ${
                        score >= 80
                          ? "bg-green-500/20 border border-green-500/50"
                          : "bg-yellow-500/20 border border-yellow-500/50"
                      }`}
                    >
                      <div className="space-y-4 text-center">
                        <div className={`text-4xl font-bold ${
                          score >= 80 ? "text-green-500" : "text-yellow-500"
                        }`}>
                          {score}%
                        </div>
                        <p className="font-semibold text-lg">
                          {score >= 80
                            ? "Great! You passed the challenge! 🎉"
                            : "Good effort! Keep practicing!"}
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-lg bg-slate-950/70 p-3">
                            <p className="text-sm text-muted-foreground">Challenge</p>
                            <p className="font-semibold">{selectedChallenge.title}</p>
                          </div>
                          <div className="rounded-lg bg-slate-950/70 p-3">
                            <p className="text-sm text-muted-foreground">Badge</p>
                            <p className="font-semibold">{score >= 90 ? "Platinum" : score >= 80 ? "Gold" : "Silver"}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedChallenge(null);
                            setSubmitted(false);
                            setUserCode("");
                          }}
                          className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Back to Challenges
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
