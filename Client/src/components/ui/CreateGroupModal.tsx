import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../api/user.api.js";
import { useAuth } from "../../context/Auth.js";
import { useFetchConnection } from "../../hooks/useFetchConnection.js";

type Step = "select" | "name";

interface Props {
  onClose: () => void;
}

export default function CreateGroupModal({ onClose }: Props) {
  const [step, setStep] = useState<Step>("select");

  const [selected, setSelected] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { connections } = useFetchConnection();

  const toggleSelect = (userId: string) => {
    setSelected((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim()) return alert("Group name required.");
    if (selected.length < 2) return alert("Select at least 2 members.");
    setLoading(true);
    try {
      const res = await userAPI.createGroup({
        name: groupName,
        memberIds: selected,
      });
      const conversationId = res.data.data.conversation_id;
      onClose();
      navigate(`/updates/${conversationId}`);
    } catch (err: any) {
      alert(err.response?.data?.error ?? "Failed to create group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-white font-semibold text-lg tracking-wide">
            {step === "select" ? "Add Members" : "Group Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition text-xl"
          >
            ✕
          </button>
        </div>

        {/* Step 1 */}
        {step === "select" && (
          <>
            <p className="text-gray-300 text-sm mb-3">
              Select at least 2 members ({selected.length})
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {connections.map((c) => {
                const isSelected = selected.includes(c.username);

                return (
                  <div
                    key={c.user_id}
                    onClick={() => toggleSelect(c.username)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                ${
                  isSelected
                    ? "bg-purple-600/80 ring-2 ring-purple-400"
                    : "bg-white/5 hover:bg-white/10"
                }`}
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                      {c.profile?.profile_picture ? (
                        <img
                          src={c.profile.profile_picture}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        c.name?.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{c.name}</p>
                      <p className="text-gray-400 text-xs">@{c.username}</p>
                    </div>

                    {isSelected && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() =>
                selected.length >= 2
                  ? setStep("name")
                  : alert("Select at least 2 members.")
              }
              className="mt-5 w-full py-2.5 rounded-xl font-semibold text-white 
          bg-linear-to-r from-purple-600 to-indigo-600 
          hover:opacity-90 transition"
            >
              Continue →
            </button>
          </>
        )}

        {/* Step 2 */}
        {step === "name" && (
          <>
            <div className="mb-4">
              <label className="text-gray-300 text-sm mb-2 block">
                Group Name
              </label>

              <input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full bg-white/10 text-white border border-white/10 
            rounded-xl px-4 py-3 focus:outline-none 
            focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                autoFocus
              />
            </div>

            <p className="text-gray-400 text-sm mb-4">
              {selected.length} members selected
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("select")}
                className="flex-1 bg-white/10 text-white py-2 rounded-xl hover:bg-white/20 transition"
              >
                ← Back
              </button>

              <button
                onClick={handleCreate}
                disabled={loading || !groupName.trim()}
                className="flex-1 py-2 rounded-xl font-semibold text-white
            bg-linear-to-r from-purple-600 to-indigo-600
            hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
