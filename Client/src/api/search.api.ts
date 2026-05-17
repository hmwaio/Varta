import apiClient from "./client.api";

export const searchAPI = {
  // Search users
  searchUser: (username: string) => {
    return apiClient.get("/search/", { params: { query: username } });
  },
};
