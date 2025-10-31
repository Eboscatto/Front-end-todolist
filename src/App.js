import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Registro from './Registro';
import Tarefas from './Tarefas';

function App() {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/tarefas" element={<Tarefas />} />
        </Routes>
        </BrowserRouter>
    )
}
export default App;
