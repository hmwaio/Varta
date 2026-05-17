import { useEffect } from "react";
import { useAuth } from "../../context/Auth";
import type { Conversation } from "../../types/conversation.type";
import { useSocket } from "./useSocket";

export const useNewMessage = (
  setChats: React.Dispatch<React.SetStateAction<Conversation[]>>,
  activeChatUsername?: string,
) => {
  const { user } = useAuth();
  const socket = useSocket();

  // reset unread count when active chat changes
  useEffect(() => {
    if (!activeChatUsername) return;
    setChats((prev) =>
      prev.map((chat) => {
        const isActive = chat.participants.some(
          (p) => p.user.username === activeChatUsername,
        );
        return isActive ? { ...chat, unreadCount: 0 } : chat;
      }),
    );
  }, [activeChatUsername, setChats]);


  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: any) => {
      setChats((prev) => {
        const exists = prev.some(
          (chat) => chat.conversation_id === msg.conversation_id,
        );

        if (!exists) return prev;

        const updated = prev.map((chat) => {
          if (chat.conversation_id !== msg.conversation_id) return chat;
          const isFromMe = msg.sender_id === user?.user_id;
          const isActiveChat = chat.participants.some(
            (p) => p.user.username === activeChatUsername,
          );

          return {
            ...chat,
            messages: [{ content: msg.content, created_at: msg.created_at }],
            unreadCount:
              isFromMe || isActiveChat
                ? chat.unreadCount
                : (chat.unreadCount ?? 0) + 1,
          };
        });

        return [...updated].sort((a, b) => {
          const aTime = a.messages[0]?.created_at ?? "";
          const bTime = b.messages[0]?.created_at ?? "";
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });
      });
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, user?.user_id, activeChatUsername, setChats]);
};
