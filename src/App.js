import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Registro from './Registro';
import Tarefas from './Tarefas';
import PrivateRoute from './PrivateRoute';

function App() {
    return (
        <BrowserRouter>        
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route
                    path="/tasks"
                    element={
                        <PrivateRoute>
                            <Tarefas />
                        </PrivateRoute>
                    }
                    
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;