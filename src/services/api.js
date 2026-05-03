const BASE_URL = "http://localhost:8080";

// =============================
// Função principal (interceptor)
// =============================
export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  // Headers padrão
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Injeta token automaticamente
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // =============================
    // Interceptor de erro global
    // =============================

    // Auth global
    if (response.status === 401 || response.status === 403) {
      console.warn("Sessão expirada. Redirecionando...");

      localStorage.removeItem("token");

      // redireciona sem precisar do navigate
      window.location.href = "/";

      return null;
    }

    // Erro global    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    // Sucesso
    return response;

  } catch (error) {
    console.error("Erro global de rede:", error);
    throw error;
  }
};