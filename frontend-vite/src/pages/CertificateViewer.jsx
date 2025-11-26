// frontend-vite/src/pages/CertificateViewer.jsx
import { useState, useEffect } from "react";
import api from "@/api/axiosClient";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function CertificateViewer() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, producer, company, active, retired
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllCertificates();
  }, []);

  const fetchAllCertificates = async () => {
    setLoading(true);
    try {
      const response = await api.get("/certificates/all");
      setCertificates(response.data.certificates || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      alert("Failed to load certificates");
    } finally {
      setLoading(false);
    }
  };

  // Filter certificates
  const filteredCertificates = certificates.filter((cert) => {
    // Filter by type
    if (filter === "producer" && cert.ownerType !== "Producer") return false;
    if (filter === "company" && cert.ownerType !== "Company") return false;
    if (filter === "active" && cert.retired) return false;
    if (filter === "retired" && !cert.retired) return false;

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        cert.label.toLowerCase().includes(search) ||
        cert.owner.toLowerCase().includes(search) ||
        cert.issuer.toLowerCase().includes(search) ||
        cert.id.toString().includes(search)
      );
    }

    return true;
  });

  // Stats
  const stats = {
    total: certificates.length,
    producer: certificates.filter(c => c.ownerType === "Producer").length,
    company: certificates.filter(c => c.ownerType === "Company").length,
    active: certificates.filter(c => !c.retired).length,
    retired: certificates.filter(c => c.retired).length,
    totalEnergy: certificates.reduce((sum, c) => sum + c.energyWh, 0) / 1000, // in kWh
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-bold text-gradient-solar mb-3 flex items-center gap-3">
          <span className="text-5xl">📋</span> Certificate Viewer (Admin Only)
        </h1>
        <p className="text-gray-600 text-lg">
          View all certificates issued and purchased on the platform
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="solar-card p-4 bg-gradient-to-br from-sky-50 to-sky-100 border-2 border-sky-200">
          <h3 className="text-sm font-semibold text-sky-700 mb-1">Total</h3>
          <p className="text-3xl font-bold text-sky-600">{stats.total}</p>
        </div>
        <div className="solar-card p-4 bg-gradient-to-br from-solar-50 to-solar-100 border-2 border-solar-200">
          <h3 className="text-sm font-semibold text-solar-700 mb-1">Producers</h3>
          <p className="text-3xl font-bold text-solar-600">{stats.producer}</p>
        </div>
        <div className="solar-card p-4 bg-gradient-to-br from-energy-50 to-energy-100 border-2 border-energy-200">
          <h3 className="text-sm font-semibold text-energy-700 mb-1">Companies</h3>
          <p className="text-3xl font-bold text-energy-600">{stats.company}</p>
        </div>
        <div className="solar-card p-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200">
          <h3 className="text-sm font-semibold text-green-700 mb-1">Active</h3>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="solar-card p-4 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200">
          <h3 className="text-sm font-semibold text-red-700 mb-1">Retired</h3>
          <p className="text-3xl font-bold text-red-600">{stats.retired}</p>
        </div>
        <div className="solar-card p-4 bg-gradient-to-br from-solar-50 to-energy-50 border-2 border-solar-300">
          <h3 className="text-sm font-semibold text-solar-700 mb-1">Total Energy</h3>
          <p className="text-2xl font-bold text-solar-600">{stats.totalEnergy.toFixed(1)} kWh</p>
        </div>
      </div>

      {/* Filters */}
      <div className="solar-card p-6 bg-white">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by ID, label, owner, or issuer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "all"
                  ? "bg-sky-gradient text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("producer")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "producer"
                  ? "bg-solar-gradient text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Producers
            </button>
            <button
              onClick={() => setFilter("company")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "company"
                  ? "bg-energy-gradient text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Companies
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "active"
                  ? "bg-green-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("retired")}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === "retired"
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Retired
            </button>
          </div>

          <button
            onClick={fetchAllCertificates}
            className="px-6 py-2 bg-sky-gradient text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
          >
            <span>🔄</span> Refresh
          </button>
        </div>
      </div>

      {/* Certificates List */}
      <div className="solar-card p-6 bg-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Certificates ({filteredCertificates.length})
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-solar-600 text-xl font-semibold flex items-center justify-center gap-2">
              <span className="animate-spin text-2xl">⚙️</span> Loading certificates...
            </div>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No certificates found</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredCertificates.map((cert) => (
              <div
                key={cert.id}
                className={`p-5 rounded-xl border-2 transition hover:shadow-lg ${
                  cert.retired
                    ? "bg-gray-50 border-gray-300 opacity-75"
                    : cert.ownerType === "Producer"
                    ? "bg-gradient-to-r from-solar-50 to-white border-solar-300"
                    : "bg-gradient-to-r from-energy-50 to-white border-energy-300"
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">
                        {cert.ownerType === "Producer" ? "⚡" : cert.ownerType === "Company" ? "🏢" : "📜"}
                      </span>
                      <div>
                        <h3 className={`text-xl font-bold ${
                          cert.ownerType === "Producer" ? "text-solar-700" : "text-energy-700"
                        }`}>
                          {cert.label}
                        </h3>
                        <span className={`text-sm px-3 py-1 rounded-full font-semibold ${
                          cert.ownerType === "Producer"
                            ? "bg-solar-100 text-solar-700"
                            : cert.ownerType === "Company"
                            ? "bg-energy-100 text-energy-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {cert.ownerType}
                        </span>
                        {cert.retired && (
                          <span className="ml-2 text-sm px-3 py-1 rounded-full font-semibold bg-red-100 text-red-700">
                            RETIRED
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                      <div>
                        <span className="font-semibold">Owner:</span>{" "}
                        <span className="font-mono text-xs">{cert.owner.slice(0, 10)}...{cert.owner.slice(-8)}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Issuer:</span>{" "}
                        <span className="font-mono text-xs">{cert.issuer.slice(0, 10)}...{cert.issuer.slice(-8)}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Energy:</span>{" "}
                        <span className="text-energy-600 font-bold">{(cert.energyWh / 1000).toFixed(3)} kWh</span>
                      </div>
                      <div>
                        <span className="font-semibold">Issued:</span>{" "}
                        {new Date(cert.timestamp * 1000).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-semibold">Price:</span>{" "}
                        {(parseInt(cert.priceWei) / 1e18).toFixed(6)} ETH
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={`${BACKEND_URL}/api/download_certificate/${cert.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-sky-gradient text-white rounded-lg font-semibold hover:shadow-lg transition text-center flex items-center justify-center gap-2"
                    >
                      <span>📄</span> Download PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
