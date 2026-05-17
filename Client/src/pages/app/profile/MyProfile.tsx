import { Settings } from "lucide-react";
import Spinner from "../../../components/ui/Spinner";
import { useAuth } from "../../../context/Auth";
import { useFetchProfile } from "../../../hooks/profile/useFetchProfile";

export default function MyProfile() {
  const { user } = useAuth();
  const { profile, loading, error } = useFetchProfile();

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* 🌈 Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#020617]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.15),transparent_40%)]" />

      {/* CONTENT */}
      <div className="relative max-w-4xl mx-auto px-4 py-10">

        {/* PROFILE CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-xl p-6">

          {/* Top Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

            {/* Avatar */}
            <div className="relative">
              {profile?.profile.profile_picture ? (
                <img
                  src={profile.profile.profile_picture}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-white/10 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold ring-4 ring-white/10 shadow-lg">
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {profile?.name}
              </h1>

              <p className="text-gray-400 mt-1">@{user?.username}</p>

              <p className="text-gray-400 text-sm mt-2">
                {profile?.email}
              </p>

              {/* Bio */}
              {profile?.profile.bio && (
                <p className="mt-4 text-gray-300 text-sm max-w-md">
                  {profile.profile.bio}
                </p>
              )}
            </div>

            {/* Edit Button */}
            <button className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-full 
              bg-white/10 hover:bg-white/20 text-white text-sm transition backdrop-blur-md">
              <Settings size={16} />
              Edit
            </button>

          </div>

          {/* Divider */}
          <div className="my-6 border-t border-white/10" />

          {/* Extra Info Section */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">

            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-sm text-gray-400">Status</p>
              <p className="text-white font-semibold mt-1">
                {profile?.is_verified ? "Verified" : "Unverified"}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-sm text-gray-400">Joined</p>
              <p className="text-white font-semibold mt-1">
                {new Date(profile?.created_at || "").toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-sm text-gray-400">Account</p>
              <p className="text-white font-semibold mt-1">
                Active
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}