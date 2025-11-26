// frontend-vite/src/pages/MetricsDashboard.jsx
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getThroughput, getLatencyStats, getBlockchainAnalytics } from "../api/metrics";

const MetricsDashboard = () => {
  const [throughputData, setThroughputData] = useState(null);
  const [latencyData, setLatencyData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllMetrics();
    const interval = setInterval(fetchAllMetrics, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const fetchAllMetrics = async () => {
    setLoading(true);
    try {
      const [throughput, latency, analyticsData] = await Promise.all([
        getThroughput(),
        getLatencyStats(),
        getBlockchainAnalytics(),
      ]);

      setThroughputData(throughput);
      setLatencyData(latency);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare block time chart data
  const blockTimeChartData = throughputData?.blocks?.map((block, idx) => ({
    blockNumber: block.number,
    blockTime: idx > 0 ? block.timestamp - throughputData.blocks[idx - 1].timestamp : 0,
    transactions: block.transactionCount,
  })) || [];

  // Prepare latency chart data
  const latencyChartData = latencyData?.metrics?.map((m, idx) => ({
    index: idx + 1,
    latencyMs: m.latencyMs,
    blockNumber: m.blockNumber,
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-50 via-energy-50 to-sky-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-5xl font-bold text-gradient-solar mb-3 flex items-center gap-3">
              <span className="text-5xl">📊</span> Performance Metrics
            </h1>
            <p className="text-white text-lg">Real-time blockchain performance analytics</p>
          </div>
          <button
            onClick={fetchAllMetrics}
            disabled={loading}
            className="btn-solar px-6 py-3 disabled:opacity-50 flex items-center gap-2"
          >
            <span>{loading ? "⚙️" : "🔄"}</span>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Current Block"
            value={analytics?.currentBlockNumber || "—"}
            color="bg-sky-gradient"
            icon="📦"
          />
          <MetricCard
            title="Total Certificates"
            value={analytics?.totalCertificates || 0}
            color="bg-energy-gradient"
            icon="📜"
          />
          <MetricCard
            title="Avg Block Time"
            value={throughputData?.averageBlockTime ? `${throughputData.averageBlockTime}s` : "—"}
            color="bg-solar-gradient"
            icon="⏱️"
          />
          <MetricCard
            title="TPS"
            value={throughputData?.transactionsPerSecond?.toFixed(4) || "—"}
            color="bg-red-800 from-solar-500 to-energy-500"
            icon="⚡"
          />
        </div>

        {/* Throughput Section */}
        <div className="solar-card p-6 bg-white mb-8">
          <h2 className="text-3xl font-bold text-solar-700 mb-6 flex items-center gap-2">
            <span>📈</span> Throughput Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-6 rounded-xl border-2 border-sky-200 shadow-md">
              <h3 className="text-lg font-semibold text-sky-700 mb-2 flex items-center gap-2">
                <span>📦</span> Total Blocks Analyzed
              </h3>
              <p className="text-4xl font-bold text-sky-600">{throughputData?.totalBlocks || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-energy-50 to-energy-100 p-6 rounded-xl border-2 border-energy-200 shadow-md">
              <h3 className="text-lg font-semibold text-energy-700 mb-2 flex items-center gap-2">
                <span>💼</span> Total Transactions
              </h3>
              <p className="text-4xl font-bold text-energy-600 text-black ">{throughputData?.totalTransactions || 0}</p>
            </div>
          </div>

          {/* Block Time Chart */}
          <div className="bg-gradient-to-br from-solar-50 to-white p-6 rounded-xl border-2 border-solar-200">
            <h3 className="text-xl font-bold text-solar-700 mb-4 flex items-center gap-2">
              <span>⏱️</span> Block Time (seconds)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={blockTimeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="blockNumber"
                  label={{ value: "Block Number", position: "insideBottom", offset: -5 }}
                />
                <YAxis label={{ value: "Time (s)", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#a78bfa" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="blockTime"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  name="Block Time (s)"
                  dot={{ fill: "#f59e0b", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Transaction Count per Block */}
          <div className="bg-gradient-to-br from-energy-50 to-white p-6 rounded-xl border-2 border-energy-200 mt-6">
            <h3 className="text-xl font-bold text-energy-700 mb-4 flex items-center gap-2">
              <span>📊</span> Transactions per Block
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={blockTimeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="blockNumber"
                  label={{ value: "Block Number", position: "insideBottom", offset: -5 }}
                />
                <YAxis label={{ value: "Transactions", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#22c55e" }}
                />
                <Legend />
                <Bar dataKey="transactions" fill="#22c55e" name="Transactions" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latency Section */}
        <div className="solar-card p-6 bg-white mb-8">
          <h2 className="text-3xl font-bold text-sky-700 mb-6 flex items-center gap-2">
            <span>⚡</span> Latency Analysis
          </h2>

          {latencyData && latencyData.count > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-energy-50 to-energy-100 p-6 rounded-xl border-2 border-energy-200 shadow-md">
                  <h3 className="text-lg font-semibold text-energy-700 mb-2 flex items-center gap-2">
                    <span>📊</span> Average Latency
                  </h3>
                  <p className="text-4xl font-bold text-energy-600">
                    {latencyData.averageLatencyMs.toFixed(2)} ms
                  </p>
                </div>
                <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-6 rounded-xl border-2 border-sky-200 shadow-md">
                  <h3 className="text-lg font-semibold text-sky-700 mb-2 flex items-center gap-2">
                    <span>⬇️</span> Min Latency
                  </h3>
                  <p className="text-4xl font-bold text-sky-600">{latencyData.minLatencyMs} ms</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-200 shadow-md">
                  <h3 className="text-lg font-semibold text-red-700 mb-2 flex items-center gap-2">
                    <span>⬆️</span> Max Latency
                  </h3>
                  <p className="text-4xl font-bold text-red-600">{latencyData.maxLatencyMs} ms</p>
                </div>
              </div>

              {/* Latency Chart */}
              <div className="bg-gradient-to-br from-sky-50 to-white p-6 rounded-xl border-2 border-sky-200">
                <h3 className="text-xl font-bold text-sky-700 mb-4 flex items-center gap-2">
                  <span>📈</span> Transaction Latency (ms)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={latencyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="index"
                      label={{ value: "Transaction #", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis label={{ value: "Latency (ms)", angle: -90, position: "insideLeft" }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                      labelStyle={{ color: "#fff" }}
                      itemStyle={{ color: "#3b82f6" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="latencyMs"
                      stroke="#0ea5e9"
                      strokeWidth={3}
                      name="Latency (ms)"
                      dot={{ fill: "#0ea5e9", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-gray-600 text-xl">
                📊 No latency data available. Submit transactions to see metrics.
              </p>
            </div>
          )}
        </div>

        {/* Activity Summary */}
        {analytics?.recentActivity && (
          <div className="solar-card p-6 bg-white">
            <h2 className="text-3xl font-bold text-energy-700 mb-6 flex items-center gap-2">
              <span>🎯</span> Recent Activity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 p-6 rounded-xl border-2 border-sky-200 shadow-md">
                <h3 className="text-sm font-semibold text-sky-700 mb-2 flex items-center gap-1">
                  <span>📦</span> Blocks Analyzed
                </h3>
                <p className="text-3xl font-bold text-sky-600">
                  {analytics.recentActivity.blocksAnalyzed}
                </p>
              </div>
              <div className="bg-gradient-to-br from-solar-50 to-solar-100 p-6 rounded-xl border-2 border-solar-200 shadow-md">
                <h3 className="text-sm font-semibold text-solar-700 mb-2 flex items-center gap-1">
                  <span>⚡</span> Certificates Issued
                </h3>
                <p className="text-3xl font-bold text-solar-600 text-black ">
                  {analytics.recentActivity.certificatesIssued}
                </p>
              </div>
              <div className="bg-gradient-to-br from-energy-50 to-energy-100 p-6 rounded-xl border-2 border-energy-200 shadow-md">
                <h3 className="text-sm font-semibold text-energy-700 mb-2 flex items-center gap-1">
                  <span>🛒</span> Certificates Purchased
                </h3>
                <p className="text-3xl font-bold text-energy-600 text-black ">
                  {analytics.recentActivity.certificatesPurchased}
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-200 shadow-md">
                <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
                  <span>🔒</span> Certificates Retired
                </h3>
                <p className="text-3xl font-bold text-red-600">
                  {analytics.recentActivity.certificatesRetired}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for metric cards
const MetricCard = ({ title, value, color, icon }) => (
  <div className={`${color} p-6 rounded-xl shadow-solar-lg hover:shadow-solar transition`}>
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-white text-sm font-semibold uppercase tracking-wide">{title}</h3>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-white text-4xl font-bold">{value}</p>
  </div>
);

export default MetricsDashboard;
