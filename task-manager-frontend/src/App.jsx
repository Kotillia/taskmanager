import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGOWANIE */}
        <Route path="/login" element={<Login />} />

        {/* REJESTRACJA */}
        <Route path="/register" element={<Register />} />

        {/* DEFAULT ROUTE TO LOGIN */}
        <Route path="*" element={<Navigate to="/login" />} />

        {/* DASHBOARD*/}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;