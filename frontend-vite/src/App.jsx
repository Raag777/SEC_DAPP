// App.jsx
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";

// pages
import Home from "@/pages/Home";
import Producers from "@/pages/Producers";
import Companies from "@/pages/Companies";
import AdminMint from "@/pages/AdminMint";
import CertificateView from "@/pages/CertificateView";
import CertificateViewer from "@/pages/CertificateViewer";
import BlockExplorer from "@/pages/BlockExplorer";
import MetricsDashboard from "@/pages/MetricsDashboard";

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producers" element={<Producers />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/admin" element={<AdminMint />} />
        <Route path="/certificate/:id" element={<CertificateView />} />
        <Route path="/certificates" element={<CertificateViewer />} />
        <Route path="/explorer" element={<BlockExplorer />} />
        <Route path="/metrics" element={<MetricsDashboard />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;
