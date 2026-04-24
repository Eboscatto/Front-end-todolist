import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [priority, setPriority] = useState("MÉDIA");

  const navigate = useNavigate();

  // Centraliza token
  const getToken = () => localStorage.getItem("token");

  // Centraliza headers
  const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`
  });

  // Trata erro de auth em um só lugar
  const handleAuthError = (status) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      navigate("/");
      return true;
    }
    return false;
  };

  // =============================
  // Buscar tarefas
  // =============================
  useEffect(() => {
    const fetchTasks = async () => {
      const token = getToken();

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/tasks", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (handleAuthError(response.status)) return;

        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error("Erro ao buscar tarefas");
        }

      } catch (error) {
        console.error("Erro de rede:", error);
      }
    };

    fetchTasks();
  }, [navigate]);

  // =============================
  // Criar tarefa
  // =============================
  const handleAddTask = async () => {
    if (!title.trim() || !description.trim()) return;

    try {
        console.log("TOKEN NO POST:", getToken());
      const response = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          title,
          description,
          priority,
          startAt: new Date(startAt).toISOString(),
          endAt: new Date(endAt).toISOString(),
        }),
      });

      if (handleAuthError(response.status)) return;

      if (response.ok) {
        const taskCriada = await response.json();

        // Evita bug de estado antigo
        setTasks(prev => [...prev, taskCriada]);

        setTitle("");
        setDescription("");
        setStartAt("");
        setEndAt("");
        setPriority("MÉDIA");
      } else {
        const errorText = await response.text();
        console.error("Erro ao criar tarefa:", errorText);
      }

    } catch (error) {
      console.error("Erro de rede:", error);
    }
  };

  // =============================
  // Editar tarefa
  // =============================

  // Estado
  const [editingTask, setEditingTask] = useState(null);

  // Função editar (preenche formulário)
  const handleEditTask = (task) => {
    setEditingTask(task);

    setTitle(task.title);
    setDescription(task.description);
    setStartAt(task.startAt.slice(0, 16));
    setEndAt(task.endAt.slice(0, 16));
    setPriority(task.priority);
  };

  // Função atualizar (PUT)  
  const handleUpdateTask = async () => {
    

    try {
      const response = await fetch(`http://localhost:8080/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: getHeaders(),         
        body: JSON.stringify({
          title,
          description,
          priority,
          startAt: new Date(startAt).toISOString(),
          endAt: new Date(endAt).toISOString(),
        }),
      });

      if (handleAuthError(response.status))
        return;

      if (response.ok) {
        const updateTask = await response.json();

        setTasks(prev =>
          prev.map(task =>
            task.id === updateTask.id ? updateTask : task
          )
        );
      } else {
        console.error("Erro ao atualizar a tarefa!");
      }
    } catch (error) {
      console.error("Erro de rede:", error);
    }

  };

  // Função limpa formulário (reset do formulário)
  const resetForm = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setStartAt("");
    setEndAt("");
    setPriority("MÉDIA");
  };


  // =============================
  // Deletar tarefa
  // =============================
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (response.status === 204 || response.status === 200) {
        // Evita bug com state antigo
        setTasks(prev => prev.filter(task => task.id !== taskId));
      } else {
        console.error("Erro ao deletar tarefa");
      }

    } catch (error) {
      console.error("Erro de rede:", error);
    }
  };

  // =============================
  // Logout
  // =============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          Cadastrar Tarefa
        </h2>

        <button onClick={handleLogout} style={logoutStyle}>
          Sair
        </button>

        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, height: "80px" }}
        />

        <input
          type="datetime-local"
          value={startAt}
          onChange={(e) => setStartAt(e.target.value)}
          style={inputStyle}
        />

        <input
          type="datetime-local"
          value={endAt}
          onChange={(e) => setEndAt(e.target.value)}
          style={inputStyle}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={inputStyle}
        >
          <option value="BAIXA">Baixa</option>
          <option value="MÉDIA">Média</option>
          <option value="ALTA">Alta</option>
        </select>

        <button onClick={editingTask ? handleUpdateTask : handleAddTask} style={addButtonStyle}>
          {editingTask ? "Atualizar" : "Adicionar"}
        </button>

        {editingTask && (
        <button
          onClick={resetForm}
          style={{
            marginTop: "10px",
            background: "#999",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer"
          }}
         >
          Cancelar edição
        </button>
        )}       

        <ul style={{ marginTop: "30px", paddingLeft: "0" }}>
          {tasks.length === 0 ? (
            <li style={{ listStyle: "none", textAlign: "center", color: "#777" }}>
              Nenhuma tarefa cadastrada.
            </li>
          ) : (
            tasks.map((task) => (
            <li
              key={task.id}
              style={{
                listStyle: "none",
                background: "#f9f9f9",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "5px",
                borderLeft: `6px solid ${
                  task.priority === "ALTA"
                    ? "#e53935"
                    : task.priority === "MÉDIA"
                    ? "#fbc02d"
                    : "#43a047"
                }`,
                position: "relative"
              }}
            >              
              <button
                onClick={() => handleEditTask(task)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "40px",
                  background: "transparent",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer"
                }}
                title="Editar tarefa"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDeleteTask(task.id)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "transparent",
                  border: "none",
                  fontSize: "18px",
                  cursor: "pointer"
                }}
                title="Excluir tarefa"
              >
                🗑️
              </button>

              <strong>{task.title}</strong>
              <br />
              {task.description}
              <br />
              ⏰ {new Date(task.startAt).toLocaleString()} até{" "}
              {new Date(task.endAt).toLocaleString()}
              <br />
              🔥 Prioridade: {task.priority}
            </li>
          ))

          )}
        </ul>
      </div>
    </div>
  );
}

/*  Estilos */
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  minHeight: "100vh",
  background: "#f0f2f5",
  padding: "40px",
};

const cardStyle = {
  background: "#fff",
  padding: "30px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "600px",
  position: "relative",
};

const logoutStyle = {
  position: "absolute",
  top: "20px",
  right: "20px",
  padding: "8px 16px",
  backgroundColor: "#e53935",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const addButtonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
  marginTop: "10px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const taskItemStyle = (priority) => ({
  listStyle: "none",
  background: "#f9f9f9",
  padding: "15px",
  marginBottom: "10px",
  borderRadius: "5px",
  borderLeft: `6px solid ${
    priority === "ALTA" ? "#e53935" : priority === "MÉDIA" ? "#fbc02d" : "#43a047"
  }`,
});

export default Tasks;
