import { AppShortcut } from "@mui/icons-material";
import { CircleUserRound, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userAPI } from "../../api/profile.api.js";
import { useAuth } from "../../context/Auth.js";
import Signout from "../ui/Buttons/Signout.js";
import Spinner from "../ui/Spinner";
import logo from "/logo.png";

export default function Navbar() {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".close-dropdown")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getMyProfile();
      setProfile(response.data.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div>
        <Spinner />
      </div>
    );

  return (
    <>
      <nav className="close-dropdown fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[99.5%]">
        <div
          className="flex items-center justify-between px-4 py-2 rounded-b-2xl 
    bg-white border-b border-gray-200 shadow-sm"
        >
          {/* Logo */}
          <section className="flex items-center gap-3 w-1/12">
            <img
              className="w-9 h-9 rounded-full shadow-sm"
              src={logo}
              alt="Varta"
            />
            <span className="hidden md:block text-gray-900 font-semibold text-lg tracking-tight">
              Varta
            </span>
          </section>

          {/* Right Side */}
          <section className="flex justify-end w-1/12 relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center justify-center rounded-full 
        p-[2px] hover:scale-105 transition-all duration-200"
            >
              <div className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden ring-1 ring-gray-200">
                {profile.profile.profile_picture ? (
                  <img
                    src={profile.profile.profile_picture}
                    className="w-9 h-9 object-cover"
                    alt={profile?.name?.charAt(0).toUpperCase()}
                  />
                ) : (
                  <div className="w-9 h-9 flex items-center justify-center text-gray-700 text-sm font-semibold">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div
                className="absolute right-0 top-14 w-64 rounded-2xl 
          bg-white border border-gray-200 shadow-xl overflow-hidden"
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">@{user?.username}</p>
                </div>

                {/* Menu */}
                <div className="py-2">
                  <Link
                    to="/me"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <CircleUserRound className="w-4 h-4 text-gray-500" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span>Settings</span>
                  </Link>

                  <Link
                    to="/account"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Account</span>
                  </Link>

                  <div className="px-2 mt-2">
                    <Signout key={1} width="w-full" />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-100 text-xs text-center text-gray-500">
                  <button className="w-full py-2 mb-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center gap-2 text-gray-700">
                    <AppShortcut />
                    <span>Download App</span>
                  </button>
                  <p>Varta Web</p>
                  <p className="text-[10px] text-gray-400">Version 1.0.0</p>
                </div>
              </div>
            )}
          </section>
        </div>
      </nav>
    </>
  );
}
