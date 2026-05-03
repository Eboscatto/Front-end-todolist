import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import Tasks from './Tasks';
import PrivateRoute from './PrivateRoute';

function App() {
    return (
        <BrowserRouter>        
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/registro" element={<Registration />} />
                <Route
                    path="/tasks"
                    element={
                        <PrivateRoute>
                            <Tasks />
                        </PrivateRoute>
                    }                    
                />                
            </Routes>
        </BrowserRouter>
        
             
    );
}

export default App;