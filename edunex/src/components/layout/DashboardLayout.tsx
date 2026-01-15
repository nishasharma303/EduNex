import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div
      className="relative min-h-screen w-full text-white overflow-hidden"
      style={{ background: "var(--gradient-secondary)" }}
    >
      {/* ✨ Floating animated purple blobs for depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-24 left-20 h-96 w-96 rounded-full blur-[120px]"
          style={{ background: "hsl(270 70% 60% / 0.25)" }}
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-24 right-20 h-[28rem] w-[28rem] rounded-full blur-[130px]"
          style={{ background: "hsl(270 60% 50% / 0.2)" }} // shifted to violet instead of pink
          animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* ✨ Main content area */}
      <main className="relative ml-64 min-h-screen p-10 z-10">
        <motion.div
          className="rounded-2xl backdrop-blur-xl border p-8 shadow-xl"
          style={{
            background: "var(--glass-background)",
            borderColor: "var(--glass-border)",
            boxShadow: "var(--shadow-card)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      </main>

      {/* ✨ Subtle bottom purple glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 blur-[100px] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent, hsl(270 70% 50% / 0.4))",
          boxShadow: "0 -10px 60px hsl(270 70% 60% / 0.25)",
        }}
      />
    </div>
  );
};
