import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!userName || !password) {
      alert("Preencha usuário e senha");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      if (response.ok) {
        // Pega o token
        const token = await response.text();

        // Salva token
        localStorage.setItem("token", token);
    
        navigate("/tasks");
      } else {
        const erro = await response.text();
        alert("Erro no login: " + erro);
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      alert("Erro de conexão com o servidor");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Fazer Login</h2>

        <input
          type="text"
          placeholder="Usuário"
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button onClick={handleLogin} style={buttonStyle}>
          Entrar
        </button>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Ainda não tem conta?{" "}
          <a href="/registro" style={{ color: "#4CAF50", textDecoration: "none" }}>
            Registre-se
          </a>
        </p>
      </div>
    </div>
  );
}

/* estilos */
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "#f0f2f5",
};

const cardStyle = {
  background: "#fff",
  padding: "40px",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "400px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  fontSize: "16px",
  cursor: "pointer",
};

export default Login;
