import apiClient from "./client.api";

export const userAPI = {
  // Connect user
  connectUser: (targetId: string) => {
    return apiClient.post(`/connections/send-request/${targetId}`);
  },
  acceptUser: (targetId: string) => {
    return apiClient.post(`/connections/accept-request/${targetId}`);
  },
  disconnectUser: (targetId: string) => {
    return apiClient.delete(`/connections/disconnect/${targetId}`);
  },
  declineRequest: (targetId: string) => {
    return apiClient.delete(`/connections/decline-request/${targetId}`);
  },
  blockUser: (targetId: string) => {
    return apiClient.patch(`/connections/block-user/${targetId}`);
  },
  unblockUser: (targetId: string) => {
    return apiClient.patch(`/connections/unblock/${targetId}`);
  },

  getConnectionReq: () => {
    return apiClient.get(`/connections/`);
  },
  pendingConnectionReq: () => {
    return apiClient.get(`/connections/pending-requests`);
  },
  connectionStatus: (targetId: string) => {
    return apiClient.get(`/connections/connection-status/${targetId}`);
  },

  userStatus: (targetId: string) => {
    return apiClient.get(`/users/status/${targetId}`);
  },
  getUser: (username: string) => {
    return apiClient.get(`/users/${username}`);
  },

  getDirectConversationId: (targetId: string) => {
    return apiClient.get(`/conversation/direct/${targetId}`);
  },
  getDirectChats: () => {
    return apiClient.get(`/conversation/direct-chat`);
  },
  getGroupChats: () => {
    return apiClient.get(`/conversation/group-chat`);
  },

  sendDMChat: (targetId: string) => {
    return apiClient.post(`/chat/dm/${targetId}/message`);
  },
  getDMChats: (targetId: string) => {
    return apiClient.get(`/chat/dm/${targetId}/messages`);
  },

  createGroup: (data: { name: string; memberIds: string[] }) => {
    return apiClient.post(`/chat/group`, data);
  },
  sendGroupChat: (conversationId: string) => {
    return apiClient.post(`/chat/group/${conversationId}/message`);
  },
  getGroupChat: (conversationId: string) => {
    return apiClient.get(`/chat/group/${conversationId}/messages`);
  },
};
