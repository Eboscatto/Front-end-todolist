import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // limpa mensagens automaticamente
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleLogin = async () => {
    if (!userName || !password) {
      setError("Preencha usuário e senha ❌");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      if (!response.ok) {
        const erro = await response.text();
        throw new Error(erro || "Erro no login");
      }

      const token = await response.text();
      localStorage.setItem("token", token);

      setMessage("Login realizado com sucesso ✅");

      // pequeno delay pra UX
      setTimeout(() => navigate("/tasks"), 1000);

    } catch (error) {
      setError(error.message || "Erro de conexão ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Fazer Login</h2>

        <input
          type="text"
          placeholder="Usuário"
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <button
          onClick={handleLogin}
          className={`${styles.button} ${loading ? styles.loading : ""}`}
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        {message && (
          <p className={`${styles.message} ${styles.success}`}>
            {message}
          </p>
        )}

        {error && (
          <p className={`${styles.message} ${styles.error}`}>
            {error}
          </p>
        )}

        <p className={styles.linkText}>
          Ainda não tem conta?{" "}
          <a href="/registro" className={styles.link}>
            Registre-se
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;