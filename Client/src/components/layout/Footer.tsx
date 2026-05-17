import { MessageCircleMore, PhoneCallIcon, Rss, Search } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function ChatFooter() {
  const base =
    "flex flex-col items-center justify-center gap-1 text-xs md:text-sm transition-all duration-200";

  const active =
    "text-green-500 scale-110";

  const inactive = "text-white/60 hover:text-white";

  return (
    <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-[95%] md:w-[60%] z-50">
      <div className="flex justify-between items-center px-4 py-2 rounded-2xl 
        backdrop-blur-lg bg-black/90 border border-white/10 shadow-xl">

        <NavLink
          to="/chats"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <MessageCircleMore className="w-6 h-6" />
          <span>Chats</span>
        </NavLink>

        <NavLink
          to="/updates"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <Rss className="w-6 h-6" />
          <span>Updates</span>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <Search className="w-6 h-6" />
          <span>Search</span>
        </NavLink>

        <NavLink
          to="/calls"
          className={({ isActive }) =>
            `${base} ${isActive ? active : inactive}`
          }
        >
          <PhoneCallIcon className="w-6 h-6" />
          <span>Calls</span>
        </NavLink>

      </div>
    </div>
  );
}