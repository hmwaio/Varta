import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userAPI } from "../../api/user.api.js";

type GroupConversation = {
  conversation_id: string;
  name: string | null;
  member_count: number;
  last_message: {
    content: string | null;
    created_at: string;
    sender_name: string;
  } | null;
  updated_at: string;
};
interface GroupChatListProps {
  searchQuery?: string;
}

export default function GroupChatList({
  searchQuery = "",
}: GroupChatListProps) {
  const [groups, setGroups] = useState<GroupConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { conversationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await userAPI.getGroupChats();
      setGroups(res.data.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = groups.filter(
    (g) =>
      !searchQuery || g.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading)
    return <div className="p-4 text-gray-400">Loading groups...</div>;

  return (
    <div className="w-full h-full flex flex-col overflow-y-auto rounded-2xl bg-[#0f172a]">
      {filtered.length === 0 && (
        <div className="p-4 text-gray-400 text-sm text-center">
          No groups yet.
        </div>
      )}

      {filtered.map((group) => {
        const isActive = conversationId === group.conversation_id;

        return (
          <div
            key={group.conversation_id}
            onClick={() => navigate(`/updates/${group.conversation_id}`)}
            className={`group flex items-center justify-between gap-3 px-4 py-3 cursor-pointer 
        transition-all duration-200 border-b border-white/5
        ${isActive ? "bg-white/10" : "hover:bg-white/5"}`}
          >
            {/* LEFT */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Avatar */}
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold shrink-0
            bg-linear-to-br from-blue-500 to-purple-600 ring-2 ring-white/10 shadow-sm"
              >
                {group.name?.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex flex-col min-w-0 flex-1">
                <p className="font-semibold text-sm text-white truncate">
                  {group.name}
                </p>

                <p className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition">
                  {group.last_message
                    ? `${group.last_message.sender_name}: ${group.last_message.content}`
                    : "No messages yet"}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              {group.last_message && (
                <span className="text-[10px] text-gray-500 group-hover:text-gray-300 transition">
                  {new Date(group.last_message.created_at).toLocaleTimeString(
                    [],
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </span>
              )}

              <span className="text-[10px] text-gray-500">
                {group.member_count} members
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
