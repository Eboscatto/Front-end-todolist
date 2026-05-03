import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { taskService } from "./services/taskService";
import { toLocalISOString, formatDateToInput } from "./utils/dateUtils";
import styles from "./Tasks.module.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [priority, setPriority] = useState("MÉDIA");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskService.getTasks();
        setTasks(data || []);
      } catch {
        setError("Erro de conexão");
      }
    };
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!title.trim() || !description.trim()) return;

    if (new Date(startAt) >= new Date(endAt)) {
      setError("A data inicial deve ser menor que a final ❌");
      return;
    }

    setLoading(true);
    try {
      const task = await taskService.createTask({
        title,
        description,
        priority,
        startAt: toLocalISOString(startAt),
        endAt: toLocalISOString(endAt)
      });

      setTasks(prev => [...prev, task]);
      setMessage("Tarefa criada com sucesso ✅");
      resetForm();

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    if (new Date(startAt) >= new Date(endAt)) {
      setError("Data inválida ❌");
      return;
    }

    setLoading(true);
    try {
      const updated = await taskService.updateTask(editingTask.id, {
        title,
        description,
        priority,
        startAt: toLocalISOString(startAt),
        endAt: toLocalISOString(endAt)
      });

      setTasks(prev =>
        prev.map(t => t.id === updated.id ? updated : t)
      );

      setMessage("Atualizado com sucesso ✏️");
      resetForm();

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Excluir tarefa?")) return;

    setLoading(true);
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      setMessage("Removido 🗑️");
    } catch {
      setError("Erro ao deletar");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStartAt(formatDateToInput(task.startAt));
    setEndAt(formatDateToInput(task.endAt));
    setPriority(task.priority);
  };

  const resetForm = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setStartAt("");
    setEndAt("");
    setPriority("MÉDIA");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getPriorityClass = (priority) => {
    if (priority === "ALTA") return styles.priorityAlta;
    if (priority === "MÉDIA") return styles.priorityMedia;
    return styles.priorityBaixa;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Cadastrar Tarefa</h2>

        <button onClick={handleLogout} className={styles.logout}>
          Sair
        </button>

        <input className={styles.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />

        <textarea className={`${styles.input} ${styles.textarea}`} value={description} onChange={e => setDescription(e.target.value)} placeholder="Descrição" />

        <input className={styles.input} type="datetime-local" value={startAt} onChange={e => setStartAt(e.target.value)} />
        <input className={styles.input} type="datetime-local" value={endAt} onChange={e => setEndAt(e.target.value)} />

        <select className={styles.input} value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="BAIXA">Baixa</option>
          <option value="MÉDIA">Média</option>
          <option value="ALTA">Alta</option>
        </select>

        {editingTask && (
          <button className={styles.buttonSecondary} onClick={resetForm}>
            Cancelar edição
          </button>
        )}

        <button
          className={styles.buttonPrimary}
          onClick={editingTask ? handleUpdateTask : handleAddTask}
          disabled={loading}
        >
          {loading ? "Processando..." : editingTask ? "Atualizar" : "Adicionar"}
        </button>

        {loading && <p className={styles.loading}>Processando...</p>}
        {message && <p className={styles.message}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <ul className={styles.taskList}>
          {tasks.length === 0 ? (
            <li>Nenhuma tarefa cadastrada.</li>
          ) : (
            tasks.map(task => (
              <li key={task.id} className={`${styles.taskItem} ${getPriorityClass(task.priority)}`}>
                <button
                  className={`${styles.iconButton} ${styles.editButton}`}
                  onClick={() => handleEditTask(task)}
                >
                  ✏️
                </button>

                <button
                  className={`${styles.iconButton} ${styles.deleteButton}`}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  🗑️
                </button>

                <strong>{task.title}</strong>
                <br />
                {task.description}
                <br />
                ⏰ {new Date(task.startAt).toLocaleString()} até {new Date(task.endAt).toLocaleString()}
                <br />
                🔥 {task.priority}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default Tasks;