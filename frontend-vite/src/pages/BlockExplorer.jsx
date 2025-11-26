// frontend-vite/src/pages/BlockExplorer.jsx
import { useState, useEffect } from "react";
import { getLatestBlockNumber, getBlockDetails, getBlockRange } from "../api/explorer";

const BlockExplorer = () => {
  const [latestBlock, setLatestBlock] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [blockDetails, setBlockDetails] = useState(null);
  const [recentBlocks, setRecentBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchLatestBlock();
  }, []);

  const fetchLatestBlock = async () => {
    try {
      const data = await getLatestBlockNumber();
      setLatestBlock(data.blockNumber);
      setSelectedBlock(data.blockNumber);

      // Fetch recent 20 blocks
      const fromBlock = Math.max(0, data.blockNumber - 19);
      const rangeData = await getBlockRange(fromBlock, data.blockNumber);
      setRecentBlocks(rangeData.blocks.reverse()); // Show newest first

      // Fetch details of latest block
      fetchBlockDetails(data.blockNumber);
    } catch (error) {
      console.error("Error fetching latest block:", error);
    }
  };

  const fetchBlockDetails = async (blockNumber) => {
    setLoading(true);
    try {
      const data = await getBlockDetails(blockNumber);
      setBlockDetails(data);
      setSelectedBlock(blockNumber);
    } catch (error) {
      console.error("Error fetching block details:", error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const blockNum = parseInt(searchInput);
    if (!isNaN(blockNum) && blockNum >= 0) {
      fetchBlockDetails(blockNum);
    } else {
      alert("Please enter a valid block number");
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const truncateHash = (hash, length = 16) => {
    if (!hash) return "";
    return `${hash.substring(0, length)}...${hash.substring(hash.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-solar-50 to-energy-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gradient-solar mb-3 flex items-center gap-3">
            <span className="text-5xl">🔍</span> Blockchain Explorer
          </h1>
          <p className="text-gray-700 text-lg">
            Latest Block: <span className="font-mono font-bold text-sky-600 bg-sky-100 px-3 py-1 rounded-lg">{latestBlock}</span>
          </p>
        </div>

        {/* Search Bar */}
        <div className="solar-card p-6 mb-6 bg-gradient-to-r from-sky-50 to-solar-50 border-2 border-sky-300">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter block number..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 py-3 border-2 border-sky-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-sky-gradient text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>🔎</span> Search
            </button>
            <button
              onClick={fetchLatestBlock}
              className="px-6 py-3 bg-energy-gradient text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <span>🔄</span> Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Blocks List */}
          <div className="lg:col-span-1">
            <div className="solar-card p-6 bg-white">
              <h2 className="text-2xl font-bold text-sky-700 mb-4 flex items-center gap-2">
                <span>📦</span> Recent Blocks
              </h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {recentBlocks.map((block) => (
                  <div
                    key={block.number}
                    onClick={() => fetchBlockDetails(block.number)}
                    className={`p-4 rounded-lg cursor-pointer transition border-2 ${
                      selectedBlock === block.number
                        ? "bg-sky-gradient text-white border-sky-500 shadow-lg"
                        : "bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100 hover:shadow-md"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold">Block {block.number}</span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        selectedBlock === block.number ? "bg-white/20" : "bg-sky-200"
                      }`}>
                        {block.transactionCount} txs
                      </span>
                    </div>
                    <div className={`text-xs mt-1 ${selectedBlock === block.number ? "opacity-90" : "text-gray-600"}`}>
                      {formatTimestamp(block.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Block Details */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="solar-card p-12 text-center bg-white">
                <div className="text-solar-600 text-xl font-semibold flex items-center justify-center gap-2">
                  <span className="animate-spin text-2xl">⚙️</span> Loading...
                </div>
              </div>
            ) : blockDetails ? (
              <div className="solar-card p-6 bg-white">
                <h2 className="text-3xl font-bold text-sky-700 mb-6 flex items-center gap-2">
                  <span>📦</span> Block #{blockDetails.number} Details
                </h2>

                <div className="space-y-4">
                  {/* Block Structure Visualization */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Block Number" value={blockDetails.number} />
                    <DetailItem label="Timestamp" value={formatTimestamp(blockDetails.timestamp)} />
                    <DetailItem label="Nonce" value={blockDetails.nonce} />
                    <DetailItem label="Miner" value={truncateHash(blockDetails.miner, 20)} mono />
                    <DetailItem label="Difficulty" value={blockDetails.difficulty} />
                    <DetailItem label="Gas Limit" value={blockDetails.gasLimit} />
                    <DetailItem label="Gas Used" value={blockDetails.gasUsed} />
                    <DetailItem
                      label="Gas Used %"
                      value={((parseInt(blockDetails.gasUsed) / parseInt(blockDetails.gasLimit)) * 100).toFixed(2) + "%"}
                    />
                  </div>

                  {/* Hashes */}
                  <div className="space-y-3 pt-4 border-t border-sky-200">
                    <DetailItem
                      label="Block Hash"
                      value={blockDetails.hash}
                      mono
                      fullWidth
                      copyable
                    />
                    <DetailItem
                      label="Parent Hash"
                      value={blockDetails.parentHash}
                      mono
                      fullWidth
                      copyable
                    />
                  </div>

                  {/* Transactions */}
                  <div className="pt-4 border-t border-sky-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span>💼</span> Transactions ({blockDetails.transactionCount})
                    </h3>
                    {blockDetails.transactions.length > 0 ? (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {blockDetails.transactions.map((tx, idx) => (
                          <div
                            key={idx}
                            className="bg-sky-50 p-3 rounded-lg text-sm font-mono text-sky-900 border border-sky-200 hover:bg-sky-100 transition"
                          >
                            {truncateHash(tx, 32)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg text-center">
                        No transactions in this block
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="solar-card p-12 text-center bg-gradient-to-br from-sky-50 to-solar-50 border-2 border-dashed border-sky-300">
                <p className="text-gray-600 text-xl flex items-center justify-center gap-2">
                  <span>👈</span> Select a block to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for detail items
const DetailItem = ({ label, value, mono, fullWidth, copyable }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    alert("Copied to clipboard!");
  };

  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <div className="text-gray-600 text-sm font-semibold mb-1">{label}</div>
      <div className={`text-gray-900 font-semibold ${mono ? "font-mono text-sm bg-gray-50 px-2 py-1 rounded" : ""} ${copyable ? "flex items-center gap-2" : ""}`}>
        <span className={fullWidth ? "break-all" : ""}>{value}</span>
        {copyable && (
          <button
            onClick={copyToClipboard}
            className="px-3 py-1 bg-sky-gradient text-white hover:shadow-lg rounded-lg text-xs font-bold transition flex-shrink-0"
          >
            📋 Copy
          </button>
        )}
      </div>
    </div>
  );
};

export default BlockExplorer;
