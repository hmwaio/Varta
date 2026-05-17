import { useEffect } from "react";
import { userAPI } from "../../api/user.api";
import type { Conversation } from "../../types/conversation.type";

export const useFetchChats = (
  setChats: React.Dispatch<React.SetStateAction<Conversation[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await userAPI.getDirectChats();
        const data = res.data.data ?? [];

        // Sort by latest message on load
        const sorted = data.sort((a: Conversation, b: Conversation) => {
          const aTime = a.messages[0]?.created_at ?? "";
          const bTime = b.messages[0]?.created_at ?? "";
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        });

        setChats(sorted.map((c: Conversation) => ({ ...c, unreadCount: c.unreadCount ?? 0 })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [setChats, setLoading]);
};
