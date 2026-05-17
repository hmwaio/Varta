import { useAuth } from "../../context/Auth.js";
import { Sparkles, MessageCircle } from "lucide-react";

export default function WelcomeScreen() {
  const { user } = useAuth();

  return (
    <div className="flex-1 h-full rounded-2xl flex items-center justify-center relative overflow-hidden bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#020617]">

      {/* 🌌 Background Glow */}
      <div className="absolute w-72 h-72 bg-orange-500/20 blur-3xl rounded-full top-10 left-10" />
      <div className="absolute w-72 h-72 bg-purple-500/20 blur-3xl rounded-full bottom-10 right-10" />

      {/* Content */}
      <div className="relative flex flex-col items-center text-center px-6">

        {/* Icon */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" />
          <div className="relative bg-white/10 backdrop-blur-md p-5 rounded-full border border-white/10">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white">
          Welcome, <span className="text-orange-400">{user?.name}</span>
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-gray-400 max-w-sm">
          Select a conversation to begin your{" "}
          <span className="text-orange-400">Varta</span> —  
          where every message feels alive.
        </p>

        {/* Decorative line */}
        <div className="mt-6 flex items-center gap-2 text-gray-500 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Fast • Private • Elegant</span>
          <Sparkles className="w-4 h-4" />
        </div>

        {/* Optional subtle hint */}
        <div className="mt-8 text-xs text-gray-500">
          Start by selecting a chat from the sidebar →
        </div>
      </div>
    </div>
  );
}