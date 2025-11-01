import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card } from "../components/ui/card";
import { Trophy, Medal, Award, Crown, Star, Zap, Target, Users, TrendingUp, Lock } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { motion } from "framer-motion";
import { Progress } from "../components/ui/progress";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<"week" | "month" | "all">("week");

  const topUsers = [
    { rank: 1, name: "Nidhi Ranjan", points: 1250, badge: "Legend", streak: 15, avatar: "AC", change: "+5" },
    { rank: 2, name: "Rishabh Reddy", points: 1100, badge: "Master", streak: 12, avatar: "SJ", change: "+2" },
    { rank: 3, name: "Aditya Reddy", points: 980, badge: "Expert", streak: 10, avatar: "MW", change: "-1" },
    { rank: 4, name: "Sai Sidhartha", points: 850, badge: "Pro", streak: 8, avatar: "ED", change: "+1" },
    { rank: 5, name: "You (Nisha)", points: 250, badge: "Rising Star", streak: 7, avatar: "N", change: "+3" },
    { rank: 6, name: "Sai Lekha", points: 220, badge: "Learner", streak: 5, avatar: "JS", change: "0" },
    { rank: 7, name: "Keeranmaye", points: 190, badge: "Learner", streak: 4, avatar: "LB", change: "-2" },
  ];

  const achievements = [
    { 
      name: "Focus Master", 
      description: "Complete 50 focus sessions", 
      earned: false, 
      progress: 32,
      total: 50,
      icon: Target,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
    },
    { 
      name: "AI Explorer", 
      description: "Use AI hints 100 times", 
      earned: true, 
      progress: 100,
      total: 100,
      icon: Zap,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
    },
    { 
      name: "Peer Mentor", 
      description: "Help 20 peers", 
      earned: true, 
      progress: 20,
      total: 20,
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
    },
    { 
      name: "Problem Solver", 
      description: "Solve 100 problems", 
      earned: false, 
      progress: 42,
      total: 100,
      icon: Star,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
    },
  ];

  const stats = [
    {
      label: "Your Rank",
      value: "#5",
      icon: Trophy,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Total Points",
      value: "250",
      icon: Star,
      color: "from-primary to-purple-600",
      bgColor: "bg-primary/10",
    },
    {
      label: "Current Streak",
      value: "7",
      unit: "days",
      icon: Award,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-primary/60 to-purple-600/60";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return Crown;
    if (rank === 2) return Trophy;
    if (rank === 3) return Medal;
    return null;
  };

  return (
    <DashboardLayout>
      <motion.div
        className="mx-auto max-w-6xl space-y-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-accent/10 p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                  <Trophy className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-purple-600 bg-clip-text text-transparent">
                  Leaderboard
                </h1>
                <p className="text-muted-foreground">
                  Compete with peers and climb the ranks 🏆
                </p>
              </div>
            </div>

            {/* Time Filter */}
            <div className="hidden md:flex gap-2 p-1 bg-card rounded-lg border-2">
              {(["week", "month", "all"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-primary to-purple-600 text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Your Stats */}
        <div className="grid gap-4 md:grid-cols-3">
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

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 items-end">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="order-1"
          >
            <Card className="border-2 border-gray-400/30 bg-gradient-to-b from-gray-100/10 to-transparent">
              <div className="p-4 text-center">
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {topUsers[1].avatar}
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-md">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-foreground mb-1">{topUsers[1].name}</h3>
                <p className="text-2xl font-bold bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent mb-2">
                  {topUsers[1].points}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {topUsers[1].badge}
                </Badge>
              </div>
            </Card>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-2"
          >
            <Card className="border-2 border-yellow-400/50 bg-gradient-to-b from-yellow-100/10 to-transparent">
              <div className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl ring-4 ring-yellow-400/30">
                      {topUsers[0].avatar}
                    </div>
                    <div className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg animate-pulse">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-foreground mb-1 text-lg">{topUsers[0].name}</h3>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-3">
                  {topUsers[0].points}
                </p>
                <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
                  {topUsers[0].badge}
                </Badge>
              </div>
            </Card>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="order-3"
          >
            <Card className="border-2 border-orange-400/30 bg-gradient-to-b from-orange-100/10 to-transparent">
              <div className="p-4 text-center">
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {topUsers[2].avatar}
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                      <Medal className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-foreground mb-1">{topUsers[2].name}</h3>
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2">
                  {topUsers[2].points}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {topUsers[2].badge}
                </Badge>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            All Learners
          </h2>
          {topUsers.slice(3).map((user, index) => {
            const isCurrentUser = user.name.includes("You");
            const RankIcon = getRankIcon(user.rank);
            return (
              <motion.div
                key={user.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.08 }}
              >
                <Card
                  className={`border-2 transition-all hover:border-primary/40 ${
                    isCurrentUser ? "bg-gradient-to-r from-primary/5 to-purple-600/5 border-primary/30" : ""
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${getRankColor(user.rank)} text-white font-bold text-lg shadow-md`}>
                          {RankIcon ? <RankIcon className="h-6 w-6" /> : user.rank}
                        </div>

                        {/* Avatar */}
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                          {user.avatar}
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{user.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {user.badge}
                          </Badge>
                          {isCurrentUser && (
                            <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            🔥 {user.streak} day streak
                          </span>
                          <span className={`flex items-center gap-1 font-medium ${
                            user.change.startsWith('+') ? 'text-green-500' : 
                            user.change.startsWith('-') ? 'text-red-500' : 
                            'text-muted-foreground'
                          }`}>
                            {user.change !== '0' && (user.change.startsWith('+') ? '↑' : '↓')}
                            {user.change !== '0' ? user.change.replace(/[+-]/, '') : '—'}
                          </span>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-600 bg-clip-text text-transparent">
                          {user.points}
                        </p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Achievements Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Your Achievements
            </h2>
            <span className="text-sm text-muted-foreground">
              {achievements.filter(a => a.earned).length} of {achievements.length} earned
            </span>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card className={`border-2 transition-all ${
                  achievement.earned 
                    ? "border-primary/30 bg-gradient-to-br from-primary/5 to-purple-600/5" 
                    : "border-border opacity-70"
                }`}>
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`relative flex-shrink-0 p-3 rounded-xl ${
                        achievement.earned 
                          ? `${achievement.bgColor}` 
                          : "bg-muted"
                      }`}>
                        {achievement.earned ? (
                          <achievement.icon className={`h-6 w-6 bg-gradient-to-br ${achievement.color} bg-clip-text text-transparent`} style={{ fill: 'currentColor' }} />
                        ) : (
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {achievement.name}
                          </h3>
                          {achievement.earned && (
                            <Badge className={`bg-gradient-to-r ${achievement.color} text-white border-0 text-xs`}>
                              Earned
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {achievement.description}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span className="font-medium">{achievement.progress}/{achievement.total}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-muted/30">
                            <motion.div
                              className={`h-full rounded-full bg-gradient-to-r ${achievement.color}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                              transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Leaderboard;