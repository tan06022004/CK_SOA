import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import AccountantDashboard from './pages/AccountantDashboard';
import HousekeepingDashboard from './pages/HousekeepingDashboard';
import MaintenanceDashboard from './pages/MaintenanceDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (role) => {
    setCurrentUser(role);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            currentUser ? <Navigate to={`/${currentUser}`} /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/receptionist"
          element={
            <ProtectedRoute isAuthenticated={currentUser === 'receptionist'}>
              <ReceptionistDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accountant"
          element={
            <ProtectedRoute isAuthenticated={currentUser === 'accountant'}>
              <AccountantDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/housekeeping"
          element={
            <ProtectedRoute isAuthenticated={currentUser === 'housekeeping'}>
              <HousekeepingDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute isAuthenticated={currentUser === 'maintenance'}>
              <MaintenanceDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute isAuthenticated={currentUser === 'manager'}>
              <ManagerDashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;