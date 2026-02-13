import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Boards from './pages/Board/Board';

// Защищённый маршрут
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Публичный маршрут (только для неавторизованных)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    return <Navigate to="/boards" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/boards" element={
          <ProtectedRoute>
            <Boards />
          </ProtectedRoute>
        } />
        
        <Route path="/" element={
          <Navigate to="/login" replace />
        } />
        
        <Route path="*" element={
          <Navigate to="/login" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;