import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import { Flame, Target, Trophy, Clock, Play, TrendingUp, Award, Zap, CheckCircle2, Quote, Edit2, Save, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();

  const defaultQuotes = [
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      author: "Winston Churchill"
    },
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs"
    },
    {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt"
    },
    {
      text: "Don't watch the clock; do what it does. Keep going.",
      author: "Sam Levenson"
    },
    {
      text: "The future depends on what you do today.",
      author: "Mahatma Gandhi"
    },
    {
      text: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela"
    },
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [customQuote, setCustomQuote] = useState("");
  const [customAuthor, setCustomAuthor] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [tempQuote, setTempQuote] = useState("");
  const [tempAuthor, setTempAuthor] = useState("");

  const displayQuote = customQuote || defaultQuotes[currentQuoteIndex].text;
  const displayAuthor = customAuthor || defaultQuotes[currentQuoteIndex].author;

  const handleEdit = () => {
    setTempQuote(displayQuote);
    setTempAuthor(displayAuthor);
    setIsEditing(true);
  };

  const handleSave = () => {
    setCustomQuote(tempQuote);
    setCustomAuthor(tempAuthor);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempQuote("");
    setTempAuthor("");
    setIsEditing(false);
  };

  const handleNewQuote = () => {
    if (!customQuote) {
      setCurrentQuoteIndex((prev) => (prev + 1) % defaultQuotes.length);
    }
  };

  const stats = [
    { 
      label: "Focus Streak", 
      value: "7", 
      unit: "days",
      icon: Flame, 
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
    },
    { 
      label: "Total Points", 
      value: "250", 
      unit: "pts",
      icon: Trophy, 
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-500/10",
    },
    { 
      label: "Focus Time", 
      value: "12.5", 
      unit: "hrs",
      icon: Clock, 
      color: "from-blue-500 to-purple-500",
      bgColor: "bg-blue-500/10",
    },
    { 
      label: "Problems Solved", 
      value: "42", 
      unit: "",
      icon: Target, 
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
    },
  ];

  const recentActivity = [
    { 
      task: "Solved calculus problem", 
      points: "+15", 
      time: "2h ago",
      icon: CheckCircle2,
      color: "text-green-500",
    },
    { 
      task: "Helped peer with physics", 
      points: "+10", 
      time: "5h ago",
      icon: Award,
      color: "text-blue-500",
    },
    { 
      task: "Completed focus session", 
      points: "+5", 
      time: "Yesterday",
      icon: Zap,
      color: "text-purple-500",
    },
  ];

  return (
    <DashboardLayout>
      <motion.div
        className="mx-auto max-w-7xl space-y-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-accent/10 p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-300 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome back, Nidhi 👋
              </h1>
              <p className="text-muted-foreground">
                Ready to continue your learning journey?
              </p>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote - Subtle & Elegant */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative border-2 border-primary/20 overflow-hidden hover:border-primary/30 transition-colors">
            {/* Simple gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5" />

            <div className="relative p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-lg bg-primary/10">
                      <Quote className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Daily Inspiration
                    </h3>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {!isEditing ? (
                      <motion.div
                        key={displayQuote}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Quote Text */}
                        <p className="text-lg md:text-xl lg:text-2xl font-serif italic text-foreground/90 leading-relaxed">
                          "{displayQuote}"
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-2">
                          <div className="h-px w-8 bg-gradient-to-r from-primary/50 to-transparent" />
                          <p className="text-sm md:text-base font-medium text-primary/80">
                            — {displayAuthor}
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Your Quote
                          </label>
                          <textarea
                            value={tempQuote}
                            onChange={(e) => setTempQuote(e.target.value)}
                            className="w-full min-h-[100px] p-3 rounded-lg border-2 border-primary/20 bg-background/50 text-foreground resize-none focus:outline-none focus:border-primary/40 transition-colors text-lg italic"
                            placeholder="Write your motivational quote here..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Author
                          </label>
                          <input
                            type="text"
                            value={tempAuthor}
                            onChange={(e) => setTempAuthor(e.target.value)}
                            className="w-full p-3 rounded-lg border-2 border-primary/20 bg-background/50 text-foreground focus:outline-none focus:border-primary/40 transition-colors"
                            placeholder="Author name (optional)"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={handleSave}
                            size="sm"
                            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                          >
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            onClick={handleCancel}
                            size="sm"
                            variant="outline"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                {!isEditing && (
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleEdit}
                      size="sm"
                      variant="outline"
                      className="border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {!customQuote && (
                      <Button
                        onClick={handleNewQuote}
                        size="sm"
                        variant="outline"
                        className="border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                        title="New Quote"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-1 w-full bg-gradient-to-r from-primary/50 via-purple-500/50 to-pink-500/50" />
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-2 hover:border-primary/40 transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className="h-5 w-5 text-current" />
                    </div>
                    <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${stat.color} opacity-10 absolute -top-6 -right-6`} />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                    {stat.unit && <span className="text-lg ml-1">{stat.unit}</span>}
                  </p>
                </div>
                <div className={`h-1 w-full bg-gradient-to-r ${stat.color}`} />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Focus Mode */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 overflow-hidden">
              <div className="relative">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-accent/5" />
                
                <div className="relative p-8">
                  <div className="flex items-center justify-between flex-col lg:flex-row gap-6">
                    <div className="flex-1 text-center lg:text-left">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <Zap className="h-4 w-4" />
                        <span>Boost Your Productivity</span>
                      </div>
                      <h2 className="mb-2 text-2xl md:text-3xl font-bold text-foreground">
                        Ready to Focus?
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        Start a 25-minute Pomodoro session and maximize your learning efficiency.
                      </p>
                      <Button
                        onClick={() => navigate("/focus-mode")}
                        size="lg"
                        className="bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all"
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Start Focus Mode
                      </Button>
                    </div>
                    
                    {/* Animated Clock */}
                    <motion.div
                      className="relative"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="relative h-32 w-32">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-purple-600/20 blur-xl" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-purple-600 opacity-10" />
                        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-card border-4 border-primary/20">
                          <Clock className="h-12 w-12 text-primary" />
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Goal Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 h-full">
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Daily Goals</h3>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Focus Time</span>
                      <span className="font-semibold text-foreground">2/3 hours</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted/30 relative">
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-primary to-purple-600 shadow-sm"
                        initial={{ width: 0 }}
                        animate={{ width: "66.6%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">1 hour remaining</p>
                  </div>
                  
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Problems Solved</span>
                      <span className="font-semibold text-foreground">4/5</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted/30 relative">
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm"
                        initial={{ width: 0 }}
                        animate={{ width: "80%" }}
                        transition={{ duration: 1, delay: 0.7 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">1 more to go!</p>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-primary/5 to-purple-600/5 border border-primary/20">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">Daily Streak</span>
                      </div>
                      <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        7 🔥
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">
                  Recent Activity
                </h3>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between rounded-xl p-4 border-2 hover:border-primary/40 transition-all bg-gradient-to-r from-muted/30 to-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${activity.color} bg-current/10`}>
                        <activity.icon className={`h-5 w-5 ${activity.color}`} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground block">
                          {activity.task}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-primary">
                        {activity.points} pts
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid gap-4 md:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-2 hover:border-primary/40 transition-all cursor-pointer group"
            onClick={() => navigate("/ask-ai")}
          >
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <Zap className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Ask AI Tutor</h4>
                  <p className="text-xs text-muted-foreground">Get instant help</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-2 hover:border-primary/40 transition-all cursor-pointer group"
            onClick={() => navigate("/ask-peer")}
          >
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                  <Award className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Ask Peers</h4>
                  <p className="text-xs text-muted-foreground">Learn together</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-2 hover:border-primary/40 transition-all cursor-pointer group"
            onClick={() => navigate("/help-peer")}
          >
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                  <Target className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Help Peers</h4>
                  <p className="text-xs text-muted-foreground">Earn rewards</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;