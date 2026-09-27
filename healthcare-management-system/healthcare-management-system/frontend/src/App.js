import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import PrescriptionsPage from "./pages/PrescriptionsPage";
import ReportsPage from "./pages/ReportsPage";

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
        <Route path="/prescriptions" element={<ProtectedRoute><PrescriptionsPage /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
