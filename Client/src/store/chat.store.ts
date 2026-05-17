import { create } from "zustand";

type UnreadState = {
  unreadCounts: Record<string, number>;
  setUnreadCount: (conversationId: string, count: number) => void;
  incrementUnread: (conversationId: string) => void;
  clearUnread: (conversationId: string) => void;
  resetUnread: () => void;
};

export const useChatStore = create<UnreadState>((set) => ({
  unreadCounts: {},

  setUnreadCount: (conversationId, count) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: count,
      },
    })),

  incrementUnread: (conversationId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: (state.unreadCounts[conversationId] || 0) + 1,
      },
    })),

  clearUnread: (conversationId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: 0,
      },
    })),

  resetUnread: () =>
    set({
      unreadCounts: {},
    }),
}));
