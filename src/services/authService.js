import { apiFetch } from "./api";

export const authService = {
  login: async (data) => {
    const response = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  },

  register: async (data) => {
    const response = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  }
};