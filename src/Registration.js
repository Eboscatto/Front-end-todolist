import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Registration.module.css";

function Registro() {
  const [userName, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // limpa mensagens automaticamente
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const handleRegistro = async () => {
    if (!userName || !name || !password) {
      setError("Preencha todos os campos ❌");
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, name, password })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Erro ao registrar usuário');
      }

      setMessage("Usuário registrado com sucesso ✅");

      // redireciona depois de 2s
      setTimeout(() => navigate('/'), 2000);

    } catch (error) {
      setError(error.message || "Erro inesperado ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Registro de Usuário</h2>

        <input
          type="text"
          placeholder="Usuário"
          value={userName}
          onChange={e => setUsername(e.target.value)}
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className={styles.input}
        />

        <button
          onClick={handleRegistro}
          className={`${styles.button} ${loading ? styles.loading : ""}`}
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrar"}
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
          Já tem conta?{" "}
          <a href="/" className={styles.link}>
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Registro;