import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";

// Pages
import Home from "@/pages/Home";
import Producers from "@/pages/Producers";
import Companies from "@/pages/Companies";
import AdminMint from "@/pages/AdminMint";
import CertificateView from "@/pages/CertificateView";

function App() {
  return (
    <Router>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/producers" element={<Producers />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/admin" element={<AdminMint />} />
          <Route path="/certificate/:tokenId" element={<CertificateView />} />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;
