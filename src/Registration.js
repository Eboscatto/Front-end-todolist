import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Registro() {
  const [userName, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegistro = async () => {
    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, name, password })
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar usuário');
      }
      alert('Usuário registrado com sucesso!');
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Registro de Usuário</h2>

        <input
          type="text"
          placeholder="Usuário"
          value={userName}
          onChange={e => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={e => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleRegistro}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Registrar
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Já tem conta? <a href="/" style={{ color: '#4CAF50', textDecoration: 'none' }}>Faça login</a>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '14px'
};

export default Registro;
