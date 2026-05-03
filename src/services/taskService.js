import { apiFetch } from "./api";

export const taskService = {

  // =============================
  // Buscar tarefas
  // =============================
  getTasks: async () => {
    const response = await apiFetch("/tasks", {
      method: "GET"
    });

    if (!response) return null;

    return await response.json();
  },

  // =============================
  // Criar tarefa
  // =============================
  createTask: async (data) => {
    const response = await apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify(data)
    });

    return response.json();

  },

  // =============================
  // Atualizar tarefa
  // =============================
  updateTask: async (id, data) => {
    const response = await apiFetch(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });

    if (!response) return null;

    return await response.json();
  },

  // =============================
  // Deletar tarefa
  // =============================
  deleteTask: async (id) => {
    const response = await apiFetch(`/tasks/${id}`, {
      method: "DELETE"
    });

    if (!response) return null;

    // 204 = sucesso sem conteúdo
    if (response.status === 204 || response.status === 200) {
      return true;
    }

    return false;
  }

};