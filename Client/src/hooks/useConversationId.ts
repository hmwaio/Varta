import { useEffect, useState } from "react";
import { userAPI } from "../api/user.api";

export const useConversationId = (targetId?: string) => {
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (!targetId) return;
    userAPI.getDirectConversationId(targetId)
      .then((res) => setConversationId(res.data.data.conversation_id))
      .catch(console.error);
  }, [targetId]);

  return conversationId;
};