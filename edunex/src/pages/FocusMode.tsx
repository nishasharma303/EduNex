import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Play, Pause, RotateCcw, Volume2, TrendingUp, Eye, EyeOff, Award, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeFocusSession } from "../services/gemini";

interface FocusSession {
  duration: number;
  distractions: number;
  timeAway: number;
  completed: boolean;
  score: number;
  time: string;
  date: string;
}

interface FocusAnalysis {
  success: boolean;
  score: number;
  grade: string;
  strengths: string[];
  weaknesses: string[];
  tips: string[];
  pattern: string;
  encouragement: string;
}

const FocusMode = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [quote] = useState("The secret of getting ahead is getting started.");

  // Focus tracking
  const [distractions, setDistractions] = useState(0);
  const [timeAway, setTimeAway] = useState(0);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [focusAnalysis, setFocusAnalysis] = useState<FocusAnalysis | null>(null);
  const [sessionHistory, setSessionHistory] = useState<FocusSession[]>([]);

  const tabLeftTime = useRef<number>(0);
  const startTime = useRef<number>(Date.now());

  // Load session history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("focusHistory");
    if (saved) {
      setSessionHistory(JSON.parse(saved));
    }
  }, []);

  // Track visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabVisible(isVisible);

      if (!isVisible && isActive) {
        // User left the tab
        tabLeftTime.current = Date.now();
        setDistractions((prev) => prev + 1);
      } else if (isVisible && tabLeftTime.current > 0) {
        // User came back
        const awayDuration = (Date.now() - tabLeftTime.current) / 1000;
        setTimeAway((prev) => prev + awayDuration);
        tabLeftTime.current = 0;
      }
    };

    const handleBlur = () => {
      if (isActive && !tabLeftTime.current) {
        tabLeftTime.current = Date.now();
        setDistractions((prev) => prev + 1);
      }
    };

    const handleFocus = () => {
      if (tabLeftTime.current > 0) {
        const awayDuration = (Date.now() - tabLeftTime.current) / 1000;
        setTimeAway((prev) => prev + awayDuration);
        tabLeftTime.current = 0;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isActive]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // Session completed!
      handleSessionEnd(true);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleSessionEnd = async (completed: boolean) => {
    setIsActive(false);
    const duration = 25 * 60 - timeLeft;

    const sessionData: FocusSession = {
      duration,
      distractions,
      timeAway,
      completed,
      score: 0, // Will be calculated by backend
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
    };

    // Get AI analysis
    setIsAnalyzing(true);
    setShowResults(true);

    try {
      const analysis = await analyzeFocusSession(sessionData, sessionHistory);
      
      if (analysis.success) {
        sessionData.score = analysis.score;
        setFocusAnalysis(analysis);

        // Save to history
        const updatedHistory = [sessionData, ...sessionHistory].slice(0, 10); // Keep last 10
        setSessionHistory(updatedHistory);
        localStorage.setItem("focusHistory", JSON.stringify(updatedHistory));
      }
    } catch (error) {
      console.error("Failed to analyze session:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleTimer = () => {
    if (!isActive) {
      startTime.current = Date.now();
      setDistractions(0);
      setTimeAway(0);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setDistractions(0);
    setTimeAway(0);
    setShowResults(false);
    setFocusAnalysis(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  const getGradeColor = (grade: string) => {
    if (grade === "A") return "text-green-500";
    if (grade === "B") return "text-blue-500";
    if (grade === "C") return "text-yellow-500";
    if (grade === "D") return "text-orange-500";
    return "text-red-500";
  };

  return (
    <DashboardLayout>
      <motion.div
        className="flex min-h-[calc(100vh-8rem)] items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="w-full max-w-2xl space-y-10 text-center">
          {/* Quote */}
          <motion.div
            className="text-xl italic text-muted-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            "{quote}"
          </motion.div>

          {/* Timer Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="relative border border-border/40 bg-[var(--gradient-card)] backdrop-blur-2xl p-12 rounded-2xl shadow-[0_0_40px_hsl(270_70%_60%_/_0.2)]">
              {/* Pulsing Glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl -z-10 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle at center, hsl(270 70% 60% / 0.2), transparent 70%)",
                }}
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Timer SVG */}
              <div className="relative mb-8 flex items-center justify-center">
                <motion.div
                  className="relative h-64 w-64 flex items-center justify-center"
                  animate={{
                    scale: isActive ? [1, 1.02, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg className="h-full w-full -rotate-90 transform">
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="hsl(270 20% 20%)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 120}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 120 * (1 - progress / 100)
                      }`}
                      strokeLinecap="round"
                      transition={{ duration: 1 }}
                    />
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="hsl(270 70% 60%)" />
                        <stop offset="100%" stopColor="hsl(320 70% 60%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{
                      textShadow: [
                        "0 0 10px hsl(270 70% 60% / 0.4)",
                        "0 0 25px hsl(270 70% 60% / 0.6)",
                        "0 0 10px hsl(270 70% 60% / 0.4)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <span className="text-6xl font-bold text-white">
                      {formatTime(timeLeft)}
                    </span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-5 mt-6">
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={toggleTimer}
                    size="lg"
                    className="h-16 w-16 rounded-full bg-gradient-to-r from-[hsl(270,70%,60%)] to-[hsl(320,70%,60%)] shadow-[0_0_20px_hsl(270_70%_60%_/_0.5)] transition-all hover:shadow-[0_0_40px_hsl(270_70%_60%_/_0.7)]"
                  >
                    {isActive ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-1" />
                    )}
                  </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={resetTimer}
                    size="lg"
                    variant="outline"
                    className="h-16 w-16 rounded-full border border-[hsl(270,70%,60%)]/40 text-white hover:bg-[hsl(270,70%,60%/0.1)]"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    onClick={() => handleSessionEnd(false)}
                    size="lg"
                    variant="outline"
                    className="h-16 w-16 rounded-full border border-[hsl(270,70%,60%)]/40 text-white hover:bg-[hsl(270,70%,60%/0.1)]"
                    disabled={!isActive && timeLeft === 25 * 60}
                  >
                    <TrendingUp className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Status with Focus Tracking */}
              <div className="mt-8 space-y-2">
                <motion.p
                  className="text-sm text-muted-foreground"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {isActive
                    ? "Focus in progress... Stay strong 💪"
                    : "Click play to start your focus session"}
                </motion.p>

                {/* Live Focus Indicator */}
                {isActive && (
                  <motion.div
                    className="flex items-center justify-center gap-4 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-1">
                      {isTabVisible ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-muted-foreground">
                        {isTabVisible ? "Focused" : "Away"}
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      Distractions: {distractions}
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            className="grid grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { label: "Session Length", value: "25 min" },
              { label: "Today's Sessions", value: sessionHistory.filter(s => s.date === new Date().toLocaleDateString()).length.toString() },
              {
                label: "Avg Focus Score",
                value: sessionHistory.length > 0 ? Math.round(sessionHistory.reduce((sum, s) => sum + s.score, 0) / sessionHistory.length) + "/100" : "N/A",
                color: "text-[hsl(270,70%,60%)]",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Card className="border border-border/40 bg-[var(--gradient-card)] backdrop-blur-xl p-4">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p
                    className={`mt-1 text-2xl font-bold ${
                      item.color || "text-white"
                    }`}
                  >
                    {item.value}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* AI Analysis Results Modal */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <Card className="border-2 border-primary/30 bg-card p-8 shadow-2xl">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4"
                  onClick={() => setShowResults(false)}
                >
                  <X className="h-4 w-4" />
                </Button>

                {isAnalyzing ? (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="inline-block mb-4"
                    >
                      <Sparkles className="h-12 w-12 text-primary" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">
                      AI Analyzing Your Focus Session...
                    </h3>
                    <p className="text-muted-foreground">
                      Crunching the numbers and patterns 🧠
                    </p>
                  </div>
                ) : focusAnalysis ? (
                  <div className="space-y-6">
                    {/* Score Header */}
                    <div className="text-center">
                      <motion.div
                        className="inline-flex items-center justify-center h-32 w-32 rounded-full bg-gradient-to-br from-primary to-purple-600 mb-4 shadow-lg"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.8 }}
                      >
                        <div className="text-center">
                          <div className="text-4xl font-bold text-white">
                            {focusAnalysis.score}
                          </div>
                          <div className={`text-2xl font-bold ${getGradeColor(focusAnalysis.grade)}`}>
                            {focusAnalysis.grade}
                          </div>
                        </div>
                      </motion.div>
                      <h2 className="text-2xl font-bold mb-2">
                        Focus Score
                      </h2>
                      <p className="text-muted-foreground">
                        {focusAnalysis.encouragement}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="p-4 bg-muted/30">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-lg font-bold">{formatTime((25 * 60 - timeLeft))}</p>
                      </Card>
                      <Card className="p-4 bg-muted/30">
                        <p className="text-xs text-muted-foreground">Distractions</p>
                        <p className="text-lg font-bold">{distractions}</p>
                      </Card>
                      <Card className="p-4 bg-muted/30">
                        <p className="text-xs text-muted-foreground">Time Away</p>
                        <p className="text-lg font-bold">{Math.round(timeAway / 60)}m</p>
                      </Card>
                    </div>

                    {/* Strengths */}
                    {focusAnalysis.strengths && focusAnalysis.strengths.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-green-500 mb-2 flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Strengths
                        </h3>
                        <ul className="space-y-1">
                          {focusAnalysis.strengths.map((strength, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-green-500">✓</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Weaknesses */}
                    {focusAnalysis.weaknesses && focusAnalysis.weaknesses.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-orange-500 mb-2">
                          Areas to Improve
                        </h3>
                        <ul className="space-y-1">
                          {focusAnalysis.weaknesses.map((weakness, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-orange-500">⚠</span>
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* AI Tips */}
                    {focusAnalysis.tips && focusAnalysis.tips.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          AI Personalized Tips
                        </h3>
                        <ul className="space-y-2">
                          {focusAnalysis.tips.map((tip, i) => (
                            <li key={i} className="text-sm bg-primary/10 border border-primary/20 rounded-lg p-3">
                              <span className="font-medium text-primary">Tip {i + 1}:</span> {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Pattern Detection */}
                    {focusAnalysis.pattern && focusAnalysis.pattern !== "No clear pattern yet" && (
                      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
                        <h3 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Pattern Detected
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {focusAnalysis.pattern}
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={() => setShowResults(false)}
                      className="w-full bg-gradient-to-r from-primary to-purple-600"
                    >
                      Continue
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      Failed to get AI insights. Please try again.
                    </p>
                    <Button
                      onClick={() => setShowResults(false)}
                      className="mt-4"
                    >
                      Close
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default FocusMode;