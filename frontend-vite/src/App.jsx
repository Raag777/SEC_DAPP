// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RoleManager from "./components/RoleManager";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./components/dashboards/AdminDashboard";
import ProducerDashboard from "./components/dashboards/ProducerDashboard";
import CompanyDashboard from "./components/dashboards/CompanyDashboard";
import BlockchainExplorer from "./components/dashboards/BlockchainExplorer";
import CertificateViewer from "./components/dashboards/CertificateViewer";
import IoTSimulatorPage from "./components/dashboards/IoTSimulatorPage";

import useContract from "./hooks/useContract";

function HomeRedirect() {
  const { connected, role } = useContract();

  if (!connected)
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-3">Welcome to SEC DApp</h2>
        <p>Please connect your wallet to continue.</p>
      </div>
    );

  if (!role) return <div className="p-6">Detecting role…</div>;

  if (role === "admin") return <Navigate to="/admin" />;
  if (role === "producer") return <Navigate to="/producer" />;
  return <Navigate to="/company" />;
}

export default function App() {
  return (
    <Routes>
      {/* HOME → auto redirect */}
      <Route path="/" element={<HomeRedirect />} />

      {/* ROLE MANAGER (for changing roles) */}
      <Route path="/role-manager" element={<RoleManager />} />

      {/* PRODUCER */}
      <Route
        path="/producer"
        element={
          <ProtectedRoute allowedRoles={["producer"]}>
            <DashboardLayout title="Producer Dashboard">
              <ProducerDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* COMPANY */}
      <Route
        path="/company"
        element={
          <ProtectedRoute allowedRoles={["company"]}>
            <DashboardLayout title="Company Dashboard">
              <CompanyDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout title="Admin Dashboard">
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* IoT SIMULATOR */}
      <Route
        path="/simulate-iot"
        element={
          <ProtectedRoute allowedRoles={["producer", "admin"]}>
            <DashboardLayout title="IoT Simulator">
              <IoTSimulatorPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* EXPLORER — PUBLIC */}
      <Route
        path="/explorer"
        element={
          <DashboardLayout title="Blockchain Explorer">
            <BlockchainExplorer />
          </DashboardLayout>
        }
      />

      {/* CERTIFICATE VIEWER — PUBLIC */}
      <Route path="/certificate/:id" element={<CertificateViewer />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
