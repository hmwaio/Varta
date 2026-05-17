import { useCallback, useEffect, useState } from "react";
import { userAPI } from "../../api/user.api";
import type { Message } from "../../types/message.type";

export const useFetchMessages = (targetId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!targetId) return;
    try {
      setLoading(true);
      const res = await userAPI.getDMChats(targetId);
      setMessages(res.data.data.messages ?? []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [targetId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return {
    messages,
    setMessages,
    loading,
    error,
    refetch: fetchMessages,
  };
};
