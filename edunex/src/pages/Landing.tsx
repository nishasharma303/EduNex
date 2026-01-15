import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { Brain, Users, Target, Trophy, Sparkles, Focus, Star, Zap, BookOpen, ArrowRight, Play, CheckCircle2, MessageSquare, TrendingUp, Clock, Award, ChevronRight, Quote, Shield, MessageCircleQuestion } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SignInButton, SignUpButton, useUser } from "@clerk/clerk-react";

const Landing = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Redirect to dashboard if already signed in
 
  const features = [
    {
      icon: Brain,
      title: "AI Hints",
      description: "Get stepwise guidance, not direct answers. Learn by understanding.",
      gradient: "from-purple-500 to-pink-500",
      size: "large",
      preview: "💡 → 🧠 → ✅"
    },
    {
      icon: MessageCircleQuestion,
      title: "Ask Peers",
      description: "Post your doubts and get help from the community.",
      gradient: "from-blue-500 to-cyan-500",
      size: "medium",
      preview: "Ask • Get Answers • Learn"
    },
    {
      icon: Shield,
      title: "Help & Earn",
      description: "Answer questions with AI verification. Earn rewards for quality help.",
      gradient: "from-green-500 to-emerald-500",
      size: "medium",
      preview: "Answer → AI Checks ✓ → Points",
      highlight: true
    },
    {
      icon: Focus,
      title: "Focus Mode",
      description: "25-min Pomodoro with distraction blocking.",
      gradient: "from-indigo-500 to-purple-500",
      size: "small",
      preview: "⏰ 25:00"
    },
    {
      icon: Trophy,
      title: "Gamification",
      description: "Earn points, badges, and climb leaderboards.",
      gradient: "from-yellow-500 to-orange-500",
      size: "small",
      preview: "🏆 +50pts"
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "IIT Aspirant",
      content: "The AI verification ensures I only get correct answers. This is way better than other doubt platforms!",
      avatar: "PS",
      rating: 5
    },
    {
      name: "Arjun Patel",
      role: "Medical Student",
      content: "I love helping peers and earning points! The AI checks my answers so I know I'm teaching correctly.",
      avatar: "AP",
      rating: 5
    },
    {
      name: "Sneha Reddy",
      role: "Engineering Student",
      content: "Focus mode + AI tutor + verified peer help = perfect combo. My productivity has doubled!",
      avatar: "SR",
      rating: 5
    },
  ];

  const benefits = [
    "AI-verified peer answers",
    "Step-by-step guidance",
    "Real-time collaboration",
    "Earn rewards for helping",
    "Distraction-free focus",
    "24/7 AI availability"
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/50 to-pink-950/30">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Dynamic gradient following mouse */}
        <motion.div
          className="absolute h-96 w-96 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />

        {/* Floating orbs with different animations */}
        <motion.div
          className="absolute top-20 left-20 h-96 w-96 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <motion.div 
            className="flex items-center gap-3 group cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <motion.div 
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Target className="h-6 w-6 text-white" />
              </motion.div>
            </div>
            <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-2xl font-bold text-transparent">
              EduNex
            </span>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              Features
            </Button>
            <Button 
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              Pricing
            </Button>
            
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <Button 
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button 
                    className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Button>
                </SignUpButton>
              </>
            ) : (
              <Button 
                onClick={() => navigate("/dashboard")} 
                className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Unique Split Layout */}
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ opacity, scale }}
            >
              <motion.div
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-2 text-sm font-medium text-purple-300 border border-purple-500/20 backdrop-blur-sm mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Shield className="h-4 w-4" />
                AI-Verified Peer Learning Platform
              </motion.div>

              <motion.h1 
                className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Learn Smarter,
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Not Harder
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-gray-300 mb-8 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Get AI-powered hints, collaborate with peers through <span className="text-green-400 font-semibold">AI-verified answers</span>, and stay focused with our productivity tools.
              </motion.p>

              <motion.div 
                className="flex flex-wrap gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {!isSignedIn ? (
                  <>
                    <SignUpButton mode="modal">
                      <Button
                        size="lg"
                        className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg text-white font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 py-6 rounded-xl overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Start Learning Free
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.5 }}
                        />
                      </Button>
                    </SignUpButton>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-purple-500/40 text-purple-300 text-lg hover:bg-purple-500/10 hover:border-purple-400/60 px-8 py-6 rounded-xl backdrop-blur-sm"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Watch Demo
                    </Button>
                  </>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => navigate("/dashboard")}
                    className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg text-white font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 px-8 py-6 rounded-xl overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Go to Dashboard
                    </span>
                  </Button>
                )}
              </motion.div>

              {/* Benefits List */}
              <motion.div 
                className="grid grid-cols-2 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    className="flex items-center gap-2 text-gray-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Interactive Preview with AI Verification Flow */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Floating Cards Preview */}
              <div className="relative h-[600px]">
                {/* Main Card - AI Verification Flow */}
                <motion.div
                  className="absolute top-0 right-0 w-80 bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-xl border-2 border-green-500/30 rounded-2xl p-6 shadow-2xl"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">AI Verification</h3>
                      <p className="text-xs text-gray-400">Quality assured</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-lg p-3 text-sm text-gray-300 border-l-2 border-blue-500">
                      <div className="text-xs text-blue-400 mb-1">Student's Answer:</div>
                      Use the quadratic formula...
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                      <span className="text-xs text-gray-400">AI checking...</span>
                    </div>
                    <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg p-3 text-sm text-gray-200 border border-green-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span className="text-xs text-green-400 font-semibold">Verified ✓</span>
                      </div>
                      <div className="text-xs text-gray-300">
                        Answer posted • +15 points earned
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Secondary Card - AI Chat */}
                <motion.div
                  className="absolute bottom-20 left-0 w-64 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl"
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-sm">AI Tutor</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white/5 rounded-lg p-2 text-xs text-gray-300">
                      How to solve this?
                    </div>
                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-2 text-xs text-gray-200 border border-purple-500/20">
                      💡 Hint 1: Start by...
                    </div>
                  </div>
                </motion.div>

                {/* Tertiary Card - Achievement */}
                <motion.div
                  className="absolute top-40 left-10 w-56 bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
                  animate={{
                    rotate: [-2, 2, -2],
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Peer Helper!</h3>
                      <p className="text-xs text-gray-400">+15 pts verified answer</p>
                    </div>
                  </div>
                </motion.div>

                {/* Stats Bubble */}
                <motion.div
                  className="absolute bottom-0 right-20 bg-blue-900/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-xl"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="text-white font-semibold text-sm">10K+ Learners</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section - Floating Cards */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {[
              { number: "10K+", label: "Active Learners", icon: Users, gradient: "from-blue-500 to-cyan-500" },
              { number: "98%", label: "Answer Accuracy", icon: Shield, gradient: "from-green-500 to-emerald-500" },
              { number: "50K+", label: "Verified Answers", icon: CheckCircle2, gradient: "from-purple-500 to-pink-500" },
              { number: "24/7", label: "AI Support", icon: Clock, gradient: "from-orange-500 to-red-500" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} mb-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* AI Verification Showcase Section */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <motion.div
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 px-4 py-2 text-sm font-medium text-green-300 border border-green-500/20 backdrop-blur-sm mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <Shield className="h-4 w-4" />
                Our Unique Advantage
              </motion.div>
              <h2 className="text-5xl font-bold text-white mb-4">
                AI-Verified
                <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"> Peer Answers</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Every answer from peers is verified by AI before posting. Get quality help you can trust.
              </p>
            </div>

            {/* Verification Flow Diagram */}
            <div className="grid md:grid-cols-4 gap-4">
              {[
                {
                  step: "1",
                  icon: MessageSquare,
                  title: "Student Answers",
                  desc: "A peer writes an answer to help you",
                  gradient: "from-blue-500 to-blue-600"
                },
                {
                  step: "2",
                  icon: Brain,
                  title: "AI Analyzes",
                  desc: "Our AI checks accuracy & quality",
                  gradient: "from-purple-500 to-purple-600"
                },
                {
                  step: "3",
                  icon: CheckCircle2,
                  title: "Verified & Posted",
                  desc: "Only correct answers get published",
                  gradient: "from-green-500 to-green-600"
                },
                {
                  step: "4",
                  icon: Award,
                  title: "Rewards Earned",
                  desc: "Helper gets points for quality answers",
                  gradient: "from-yellow-500 to-orange-600"
                },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  className="relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.gradient} mb-4`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                      <ChevronRight className="h-6 w-6 text-purple-400/50" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features - Bento Grid Layout */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Excel</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to transform your learning experience
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-7xl mx-auto">
            {/* Large Card - AI Hints */}
            <motion.div
              className="md:col-span-3 md:row-span-2 group relative bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">AI-Powered Hints</h3>
                <p className="text-gray-300 mb-6 text-lg">
                  Get progressive hints that guide you to the solution. Learn by understanding, not memorizing.
                </p>
                <div className="flex items-center gap-2 text-purple-300 text-sm font-medium">
                  <span>Learn more</span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                
                {/* Preview */}
                <div className="mt-6 space-y-2">
                  <div className="bg-white/5 rounded-lg p-3 text-sm text-gray-400">
                    💡 Hint 1: Consider the formula...
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-sm text-gray-400">
                    🧠 Hint 2: Substitute the values...
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-sm text-gray-400">
                    ✅ Final: Here's the solution...
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Medium Card - Ask Peers */}
            <motion.div
              className="md:col-span-3 group relative bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
                  <MessageCircleQuestion className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Ask Peers</h3>
                <p className="text-gray-300 mb-4">
                  Post your doubts and get verified answers from the community.
                </p>
                <div className="flex -space-x-2">
                  {["AC", "PR", "SK", "RJ"].map((initial, i) => (
                    <div key={i} className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold border-2 border-blue-900">
                      {initial}
                    </div>
                  ))}
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-white text-xs font-semibold border-2 border-blue-900">
                    +10K
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Medium Card - Help & Earn */}
            <motion.div
              className="md:col-span-3 group relative bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-xl border-2 border-green-500/30 rounded-3xl p-8 hover:border-green-500/60 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {/* Special badge */}
              <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
                ✨ UNIQUE
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Help & Earn Rewards</h3>
                <p className="text-gray-300 mb-4">
                  Answer questions with AI verification. Earn points for quality help.
                </p>
                <div className="bg-white/5 rounded-lg p-3 border border-green-500/20">
                  <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-xs">AI verifying...</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified • +15 points
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Small Card - Focus Mode */}
            <motion.div
              className="md:col-span-2 group relative bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-indigo-500/50 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 mb-4">
                  <Focus className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Focus Mode</h3>
                <p className="text-gray-300 mb-4">
                  Pomodoro sessions with distraction blocking.
                </p>
                <div className="text-center mt-6">
                  <div className="text-4xl font-bold text-indigo-400">25:00</div>
                  <div className="text-gray-400 text-sm mt-1">Deep Work</div>
                </div>
              </div>
            </motion.div>

            {/* Small Card - Gamification */}
            <motion.div
              className="md:col-span-2 group relative bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-yellow-500/50 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 mb-4">
                  <Trophy className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Gamification</h3>
                <p className="text-gray-300 mb-4">
                  Earn points, badges, and compete.
                </p>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">+50 pts</span>
                </div>
              </div>
            </motion.div>

            {/* Small Card - Analytics */}
            <motion.div
              className="md:col-span-2 group relative bg-gradient-to-br from-pink-900/40 to-rose-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-pink-500/50 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 mb-4">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Analytics</h3>
                <p className="text-gray-300 mb-4">
                  Track your learning progress.
                </p>
                <div className="text-pink-400 font-bold text-3xl">87%</div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-white mb-4">
              Loved by
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Thousands</span>
            </h2>
            <p className="text-xl text-gray-400">See what our learners have to say</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-500"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Quote className="h-8 w-8 text-purple-400/30 mb-4" />
                <p className="text-gray-300 mb-6 leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="relative max-w-5xl mx-auto bg-gradient-to-r from-purple-900/60 via-pink-900/60 to-blue-900/60 backdrop-blur-xl border border-white/20 rounded-3xl p-12 md:p-16 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-50" />
            <motion.div
              className="absolute top-0 right-0 h-64 w-64 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Transform Your Learning?
                </h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join 10,000+ students who are already learning smarter with AI-verified peer help.
                  Start your journey today — completely free!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {!isSignedIn ? (
                    <>
                      <SignUpButton mode="modal">
                        <Button
                          size="lg"
                          className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-10 py-6 rounded-xl text-lg hover:scale-105 transition-all duration-300 shadow-2xl"
                        >
                          <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                          Start Learning Free
                          <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </SignUpButton>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-white/20 text-white hover:bg-white/10 px-10 py-6 rounded-xl text-lg backdrop-blur-sm"
                      >
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Talk to Us
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="lg"
                      onClick={() => navigate("/dashboard")}
                      className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-10 py-6 rounded-xl text-lg hover:scale-105 transition-all duration-300 shadow-2xl"
                    >
                      <Sparkles className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                      Go to Dashboard
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-xl font-bold text-transparent">
                EduNex
              </span>
            </div>
            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">About</a>
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 EduNex. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;