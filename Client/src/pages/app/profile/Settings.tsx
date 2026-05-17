import { Camera } from "lucide-react";
import { useEffect } from "react";
import Spinner from "../../../components/ui/Spinner";
import { useAuth } from "../../../context/Auth";
import { useUpdateProfile } from "../../../hooks/profile/useUpdateProfile";
import { useDeleteProfilePicture } from "../../../hooks/profile/useDeleteProfilePicture";
import { useFetchProfile } from "../../../hooks/profile/useFetchProfile";
import { useProfilePictureUpload } from "../../../hooks/profile/useProfilePictureUpload";

export default function ProfileSettings() {
  const { user } = useAuth();

  const {
    profile,
    loading: profileLoading,
    refetch,
    setProfile,
  } = useFetchProfile();

  const {
    name,
    bio,
    setName,
    setBio,
    updateProfile,
    loading: updating,
  } = useUpdateProfile(refetch);

  const { uploadingProfile, profilePictureUpload } = useProfilePictureUpload(
    setProfile,
    refetch,
  );

  const { loading: deletingProfilePicture, deleteProfilePicture } =
    useDeleteProfilePicture(refetch);

  // ✅ Sync fetched profile into form
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setBio(profile.profile?.bio || "");
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile();
  };

  if (profileLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your account and preferences
            </p>
          </div>

          <div className="text-sm font-semibold text-gray-700">Brand Name</div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 p-3">
              <NavItem label="Profile" active />
              <NavItem label="Account" />
              <NavItem label="Privacy" />
              <NavItem label="App Language" />
              <NavItem label="Help" />
            </div>
          </div>

          {/* Content */}
          <div className="col-span-9 space-y-6">
            <Section title="Profile" />

            {/* Profile Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-gray-200 rounded-2xl p-6"
            >
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  {profile?.profile?.profile_picture ? (
                    <img
                      src={profile.profile.profile_picture}
                      className="w-24 h-24 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-600">
                      {profile?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Upload */}
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-50">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          profilePictureUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>

                  {/* Upload spinner */}
                  {uploadingProfile && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-3">
                  <input
                    className="w-full text-lg font-medium bg-transparent outline-none border-b border-gray-200 focus:border-blue-500 pb-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Display name"
                  />

                  <input
                    className="w-full text-sm text-gray-500 bg-transparent outline-none border-b border-gray-200 pb-1"
                    value={profile?.username || ""}
                    readOnly
                  />

                  {/* Delete button */}
                  {profile?.profile?.profile_picture && (
                    <button
                      type="button"
                      onClick={deleteProfilePicture}
                      disabled={deletingProfilePicture}
                      className="text-xs text-red-500 hover:underline disabled:opacity-50"
                    >
                      {deletingProfilePicture
                        ? "Removing..."
                        : "Remove picture"}
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short bio..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>

              {/* Save button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2.5 bg-gray-900 text-white text-sm rounded-xl hover:bg-gray-800 disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            {/* Account */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Account
              </h2>
              <SettingsRow label="Email" value={profile?.email || ""} />
              <SettingsRow label="Password" value="••••••••" />
            </div>

            {/* Privacy */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                Privacy
              </h2>
              <ToggleRow label="Online Status" />
              <ToggleRow label="Read Receipts" />
            </div>

            {/* Language */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                App Language
              </h2>
              <select className="w-full border border-gray-200 rounded-xl px-4 py-2 bg-white">
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Sidebar */
function NavItem({ label, active }: any) {
  return (
    <div
      className={`px-3 py-2 rounded-xl text-sm cursor-pointer transition
      ${active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}
    >
      {label}
    </div>
  );
}

/* Section */
function Section({ title }: any) {
  return <h2 className="text-lg font-semibold">{title}</h2>;
}

/* Row */
function SettingsRow({ label, value }: any) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}

/* Toggle */
function ToggleRow({ label }: any) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="w-10 h-5 bg-gray-200 rounded-full" />
    </div>
  );
}
