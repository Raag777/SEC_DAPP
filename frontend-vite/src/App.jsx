// App.jsx
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";

// pages
import Home from "@/pages/Home";
import Producers from "@/pages/Producers";
import Companies from "@/pages/Companies";
import AdminMint from "@/pages/AdminMint";
import CertificateView from "@/pages/CertificateView";

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producers" element={<Producers />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/admin" element={<AdminMint />} />
        <Route path="/certificate/:id" element={<CertificateView />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;
