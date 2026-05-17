import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../../components/ui/avatar/TextAvatar.js";
import { useFetchChats } from "../../hooks/chats/useFetchChats.js";
import { useNewMessage } from "../../hooks/socket/useNewMessage.js";
import { useUserStatus } from "../../hooks/users/userStatus.js";
import type { Conversation } from "../../types/conversation.type.js";

interface ChatListProps {
  searchQuery?: string;
}

export default function DMChatList({ searchQuery = "" }: ChatListProps) {
  const [chats, setChats] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { targetId } = useParams();
  const navigate = useNavigate();
  const { status } = useUserStatus();
  useFetchChats(setChats, setLoading);
  useNewMessage(setChats, targetId);

  // Reset unread when chat is opened
  const handleChatClick = (username: string, conversationId: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.conversation_id === conversationId ? { ...c, unreadCount: 0 } : c,
      ),
    );
    navigate(`/chat/${username}`);
  };

  const filtered = chats.filter((chat) => {
    const other = chat.participants[0]?.user;
    if (!searchQuery) return true;
    return other?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) return <div className="p-4 text-gray-400">Loading chats...</div>;

  return (
    <div className="w-full h-full flex-1 flex flex-col overflow-y-auto rounded-2xl bg-[#0f172a]">
      {filtered.length === 0 && (
        <div className="p-4 text-gray-400 text-sm text-center">
          No conversations yet.
        </div>
      )}

      {filtered.map((chat) => {
        const other = chat.participants[0]?.user;
        const lastMsg = chat.messages[0];
        console.log(lastMsg);
        const isActive = targetId === other?.username;

        return (
          <div
            key={chat.conversation_id}
            onClick={() =>
              handleChatClick(other?.username, chat.conversation_id)
            }
            className={`group flex items-center justify-between gap-3 px-4 py-3         cursor-pointer 
              transition-all duration-200 border-b border-white/5
              ${isActive ? "bg-white/10" : "hover:bg-white/5"}`}
          >
            {/* LEFT */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Avatar */}
              <div className="relative w-11 h-11 rounded-full shrink-0">
                {other?.profile?.profile_picture ? (
                  <img
                    src={other.profile.profile_picture}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10"
                  />
                ) : (
                  <Avatar name={other?.name} size="sm" status={status} />
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col min-w-0 flex-1">
                <p className="font-semibold text-sm text-white truncate">
                  {other?.is_deleted ? "Deleted Account" : other?.name}
                </p>

                <p className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition">
                  {lastMsg?.content ?? "No messages yet"}
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              {lastMsg && (
                <span className="text-[10px] text-gray-500 group-hover:text-gray-300 transition">
                  {new Date(lastMsg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}

              {chat.unreadCount > 0 && (
                <span className="bg-green-500/90 text-white text-[10px] rounded-full min-w-4 h-5 px-1 flex items-center justify-center font-semibold shadow">
                  {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
