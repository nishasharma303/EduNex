import { NavLink, Link } from "react-router-dom";
import { Home, Brain, MessageCircle, Users, Trophy, User, Target } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { title: "Home", path: "/dashboard", icon: Home },
  { title: "Ask AI", path: "/ask-ai", icon: Brain },
  { title: "Ask Peer", path: "/ask-peer", icon: MessageCircle },
  { title: "Help Peer", path: "/help-peer", icon: Users },
  { title: "Leaderboard", path: "/leaderboard", icon: Trophy },
  { title: "Profile", path: "/profile", icon: User },
];

export const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-sidebar-border bg-sidebar-background backdrop-blur-xl">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <motion.div 
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg group-hover:shadow-xl transition-shadow"
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
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/30 p-3 hover:bg-sidebar-accent/50 transition-colors cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white font-semibold">
              N
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-sidebar-foreground">Nidhi</p>
              <p className="text-xs text-muted-foreground">250 points</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};