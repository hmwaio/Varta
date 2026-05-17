import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { userAPI } from "../../api/user.api.js";
import { ChatInputBox } from "../../components/ui/Chats/ChatInputBox.js";
import { useAuth } from "../../context/Auth.js";
import { getSocket } from "../../lib/socket.js";

type Message = {
  message_id: string;
  sender_id: string;
  sender_name: string;
  sender_picture: string | null;
  content: string;
  type: string;
  created_at: string;
};

export default function GroupChatPage() {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupName, setGroupName] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;
    fetchMessages();
    fetchGroupInfo();
  }, [conversationId]);

  // Socket — join group room + listen
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;

    socket.emit("conversation:join", conversationId);

    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => {
        const exists = prev.find((m) => m.message_id === msg.message_id);
        if (exists) return prev;
        return [...prev, msg];
      });
      scrollToBottom();
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.emit("conversation:leave", conversationId);
      socket.off("message:new", handleNewMessage);
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const res = await userAPI.getGroupChat(conversationId!);
      setMessages(res.data.data.messages ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupInfo = async () => {
    try {
      const res = await userAPI.getGroupChats();
      const group = res.data.data?.find(
        (g: any) => g.conversation_id === conversationId,
      );
      if (group) {
        setGroupName(group.name ?? "Group");
        setMemberCount(group.member_count ?? 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim() || !conversationId) return;

    const socket = getSocket();
    const optimistic: Message = {
      message_id: crypto.randomUUID(),
      sender_id: user!.user_id,
      sender_name: user!.name,
      sender_picture: null,
      content,
      type: "TEXT",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    setContent("");

    socket?.emit(
      "message:send",
      { conversationId, content, type: "TEXT" },
      (ack: { success: boolean; error?: string }) => {
        if (!ack.success) {
          setMessages((prev) =>
            prev.filter((m) => m.message_id !== optimistic.message_id),
          );
          alert(ack.error ?? "Failed to send message");
        }
      },
    );
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p>Welcome, {user?.name} 👋 — Select a group to start chatting</p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full w-full rounded-2xl overflow-hidden">
      {/* 🌈 Background */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#020617]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.15),transparent_40%)]" />

      {/* CONTENT */}
      <div className="relative flex flex-col h-full">
        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-3 backdrop-blur-md bg-white/5 border-b border-white/10">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold
        bg-linear-to-br from-blue-500 to-purple-600 ring-2 ring-white/10"
          >
            {groupName?.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="flex-1">
            <p className="font-semibold text-white text-sm tracking-tight">
              {groupName}
            </p>
            <p className="text-xs text-gray-400">{memberCount} members</p>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {loading && (
            <p className="text-center text-gray-400 text-sm">Loading...</p>
          )}

          {!loading && messages.length === 0 && (
            <p className="text-center text-gray-400 text-sm">
              No messages yet. Say hi! 👋
            </p>
          )}

          {messages.map((msg) => {
            const isMe = msg.sender_id === user?.user_id;

            return (
              <div
                key={msg.message_id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                {/* Sender Name (group only) */}
                {!isMe && (
                  <span className="text-[11px] text-purple-300 mb-1 ml-1 font-medium">
                    {msg.sender_name}
                  </span>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm shadow-md backdrop-blur-sm
              ${
                isMe
                  ? "bg-linear-to-br from-green-500 to-emerald-600 text-white rounded-br-none"
                  : "bg-white/10 text-gray-100 border border-white/10 rounded-bl-none"
              }`}
                >
                  <p>{msg.content}</p>

                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span
                      className={`text-[10px] ${
                        isMe ? "text-green-100" : "text-gray-400"
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 border-t border-white/10 bg-white/5 backdrop-blur-md">
          <ChatInputBox
          roomId={conversationId}
            content={content}
            onSend={sendMessage}
            setContent={setContent}
          />
        </div>
      </div>
    </div>
  );
}
