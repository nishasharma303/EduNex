import { useState } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { User, Calendar, Flame, Clock, Target, Users, Edit, Award, TrendingUp, BookOpen, Mail, MapPin, Trophy } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { motion } from "framer-motion";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const stats = [
    { 
      label: "Focus Sessions", 
      value: "48", 
      icon: Clock, 
      color: "from-blue-500 to-purple-500",
      bgColor: "bg-blue-500/10",
    },
    { 
      label: "Peer Contributions", 
      value: "15", 
      icon: Users, 
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
    },
    { 
      label: "Problems Solved", 
      value: "42", 
      icon: Target, 
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
    },
    { 
      label: "Current Streak", 
      value: "7", 
      unit: "days",
      icon: Flame, 
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-500/10",
    },
  ];

  const weeklyActivity = [
    { day: "Mon", hours: 2.5, sessions: 3 },
    { day: "Tue", hours: 3.0, sessions: 4 },
    { day: "Wed", hours: 1.5, sessions: 2 },
    { day: "Thu", hours: 4.0, sessions: 5 },
    { day: "Fri", hours: 2.0, sessions: 3 },
    { day: "Sat", hours: 3.5, sessions: 4 },
    { day: "Sun", hours: 2.5, sessions: 3 },
  ];

  const learningGoals = [
    { name: "Master Calculus", progress: 75, color: "from-blue-500 to-blue-600" },
    { name: "Physics Fundamentals", progress: 60, color: "from-purple-500 to-purple-600" },
    { name: "Data Structures", progress: 40, color: "from-green-500 to-green-600" },
  ];

  const recentBadges = [
    { name: "AI Explorer", icon: Trophy, color: "from-purple-500 to-purple-600" },
    { name: "Peer Mentor", icon: Users, color: "from-green-500 to-green-600" },
    { name: "7-Day Streak", icon: Flame, color: "from-orange-500 to-red-500" },
  ];

  const maxHours = Math.max(...weeklyActivity.map(d => d.hours));

  return (
    <DashboardLayout>
      <motion.div
        className="mx-auto max-w-6xl space-y-6"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Profile Header */}
        <Card className="border-2 overflow-hidden">
          <div className="relative">
            {/* Cover Background */}
            <div className="h-32 bg-gradient-to-r from-primary/20 via-purple-500/20 to-accent/20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/50" />
            </div>

            {/* Profile Content */}
            <div className="relative px-8 pb-8">
              {/* Avatar */}
              <div className="flex items-start justify-between -mt-16 mb-4">
                <div className="relative">
                  <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-5xl font-bold text-white shadow-xl ring-4 ring-card">
                    N
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg ring-4 ring-card">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="mt-16 border-2 hover:border-primary/50"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>

              {/* User Info */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-purple-600 bg-clip-text text-transparent">
                      Nidhi
                    </h1>
                    <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0">
                      Rising Star
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    Computer Science Student • Mathematics Enthusiast
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>Joined Oct 2025</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-orange-500">7 day streak 🔥</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>Chennai, India</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    <span>nidhiranjan2005@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

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
          {/* Weekly Activity Chart */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Weekly Focus Time</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total: {weeklyActivity.reduce((sum, d) => sum + d.hours, 0).toFixed(1)} hours this week
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="flex items-end justify-between gap-3 h-56">
                  {weeklyActivity.map((day, index) => (
                    <motion.div
                      key={day.day}
                      className="flex flex-1 flex-col items-center gap-3 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      {/* Bar */}
                      <div className="relative w-full flex items-end justify-center">
                        <div className="relative w-full max-w-[40px]">
                          <motion.div
                            className="w-full rounded-t-lg bg-gradient-to-t from-primary to-purple-600 transition-all hover:opacity-80 cursor-pointer relative group"
                            style={{ height: `${(day.hours / maxHours) * 180}px` }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-card border-2 border-primary/20 rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                              <p className="text-xs font-medium text-foreground">{day.hours}h</p>
                              <p className="text-xs text-muted-foreground">{day.sessions} sessions</p>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Label */}
                      <div className="text-center">
                        <p className="text-xs font-medium text-foreground">{day.day}</p>
                        <p className="text-xs text-muted-foreground">{day.hours}h</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-2 h-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">Recent Badges</h2>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 text-xs">
                    View All
                  </Button>
                </div>

                <div className="space-y-3">
                  {recentBadges.map((badge, index) => (
                    <motion.div
                      key={badge.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg border-2 hover:border-primary/40 transition-all bg-gradient-to-r from-muted/30 to-transparent"
                    >
                      <div className={`p-2.5 rounded-lg bg-gradient-to-br ${badge.color} shadow-md`}>
                        <badge.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground text-sm">{badge.name}</h3>
                        <p className="text-xs text-muted-foreground">Earned recently</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-primary/5 to-purple-600/5 border border-primary/20">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Total Badges</span>
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      12
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Learning Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Learning Goals</h2>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  Add Goal
                </Button>
              </div>

              <div className="space-y-6">
                {learningGoals.map((goal, index) => (
                  <motion.div
                    key={goal.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="mb-3 flex justify-between items-center">
                      <span className="font-medium text-foreground">{goal.name}</span>
                      <span className={`font-bold text-lg bg-gradient-to-r ${goal.color} bg-clip-text text-transparent`}>
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted/30 relative">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${goal.color} shadow-sm`}
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {goal.progress >= 75 ? "Almost there! Keep going! 🚀" : 
                       goal.progress >= 50 ? "Great progress! 💪" : 
                       "Just getting started 📚"}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Activity Summary */}
        <motion.div
          className="grid gap-4 md:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="border-2">
            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Focus Time Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Average per day</span>
                  <span className="font-semibold text-foreground">2.7 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Longest session</span>
                  <span className="font-semibold text-foreground">4.0 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total this month</span>
                  <span className="font-semibold text-primary">45 hours</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-2">
            <div className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Performance Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Accuracy rate</span>
                  <span className="font-semibold text-green-500">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Questions answered</span>
                  <span className="font-semibold text-foreground">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Rank this week</span>
                  <span className="font-semibold text-primary">#5</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Profile;