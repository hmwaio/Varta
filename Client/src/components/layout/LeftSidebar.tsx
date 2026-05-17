import { Apps, Settings } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CallsList from "../../pages/app/calls/CallsList";
import DMChatList from "../../pages/app/DMChatList";
import GroupChatList from "../../pages/app/GroupChatList";
import NewGroup from "../ui/Buttons/NewGroup";
import Signout from "../ui/Buttons/Signout";
import Searching from "./Searching";
import SearchPage from "../../pages/app/SearchPage";
type LeftSidebarProps = {
  localSearch?: string;
  onLocalSearch?: (query: string) => void;
};

export default function LeftSidebar({
  localSearch,
  onLocalSearch,
}: LeftSidebarProps) {
  const location = useLocation();
  const isChat = location.pathname.startsWith("/chat");
  const isUpdates = location.pathname.startsWith("/updates");
  const isCalls = location.pathname.startsWith("/calls");
  // const isSearch = location.pathname.startsWith("/Search");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".close-dropdown")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <div className="close-dropdown h-full w-full flex flex-col bg-slate-800 rounded-2xl border border-white/10 overflow-hidden">
        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-slate-800 px-4 py-3 flex flex-col gap-4 border-b border-white/5">
          {/* Top Row */}
          <div className="flex justify-between items-center">
            <div className="text-white text-xl font-semibold tracking-tight">
              {isChat
                ? "Chats"
                : isUpdates
                  ? "Updates"
                  : isCalls
                    ? "Calls"
                    : ""}
            </div>

            {/* Dropdown */}
            <div className="relative close-dropdown">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 flex items-center justify-center rounded-full 
          text-white hover:bg-white/10 transition"
              >
                <Apps fontSize="medium" />
              </button>

              {showDropdown && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-xl 
            bg-slate-900 border border-white/10 shadow-xl z-30 overflow-hidden"
                >
                  <div className="flex flex-col py-2">
                    <button className="w-full px-4 py-2 hover:bg-white/10 text-left text-sm text-white">
                      <NewGroup key={1} />
                    </button>

                    <Link
                      to="/settings"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/10"
                    >
                      <Settings fontSize="small" />
                      <span>Settings</span>
                    </Link>

                    <div className="px-2 mt-1">
                      <Signout key={1} width="w-full" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="w-full">
            <Searching onLocalSearch={onLocalSearch} />
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {isChat && <DMChatList searchQuery={localSearch} />}
          {isUpdates && <GroupChatList searchQuery={localSearch} />}
          {/* {isSearch && <SearchPage searchQuery={localSearch} />} */}
          {isCalls && <CallsList searchQuery={localSearch} />}

          {!isChat && !isUpdates && !isCalls && (
            <div className="p-4 text-gray-400 text-sm">
              Namaste, welcome to Varta.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
