import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';



const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


function App() {
  return (
    <Router>
        <Toaster position="top-right" />
      <Routes>
        {/* LOGOWANIE */}
        <Route path="/login" element={<Login />} />

        {/* REJESTRACJA */}
        <Route path="/register" element={<Register />} />

        {/* DEFAULT ROUTE TO LOGIN */}
        <Route path="*" element={<Navigate to="/login" />} />

        {/* DASHBOARD*/}
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
          } />
      </Routes>
    </Router>
  );
}

export default App;