import Card from "@/components/Card";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-solar-400 via-solar-500 to-energy-500 text-white rounded-2xl p-8 md:p-12 shadow-solar-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-6xl md:text-7xl animate-float">☀️</span>
            <div>
              <h1
                 className="text-4xl md:text-6xl font-bold mb-2"
                 style={{ color: "white" }}
              >
               Solar Energy Certificate DApp
             </h1>

              <p className="text-xl md:text-2xl opacity-90">
                Blockchain-Powered Renewable Energy Trading
              </p>
            </div>
          </div>
          <p className="text-lg opacity-90 max-w-3xl leading-relaxed">
            A decentralized application that revolutionizes how solar energy producers issue certificates
            and how companies purchase renewable energy credits - all secured by blockchain technology.
          </p>
        </div>
      </div>

      {/* What is SEC DApp */}
      <Card className="solar-card">
        <h2 className="text-3xl font-bold mb-4 text-solar-600 flex items-center gap-2">
          <span>🌟</span> What is SEC DApp?
        </h2>
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">
          The Solar Energy Certificate (SEC) DApp is a blockchain-based marketplace that connects
          renewable energy producers with companies seeking to offset their carbon footprint and
          support clean energy initiatives.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          Our platform enables transparent, secure, and verifiable trading of solar energy certificates,
          ensuring every transaction is immutably recorded on the blockchain with cryptographic proof.
        </p>
      </Card>

      {/* How It Works */}
      <Card className="solar-card bg-gradient-to-br from-solar-50 to-energy-50">
        <h2 className="text-3xl font-bold mb-6 text-energy-600 flex items-center gap-2">
          <span>⚙️</span> How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white border-2 border-sky-300 rounded-xl hover:shadow-lg transition">
            <div className="text-5xl mb-3">👥</div>
            <div className="text-3xl font-bold text-sky-600 mb-3">1</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Registration</h3>
            <p className="text-gray-600">
              Producers and companies register their accounts through the admin panel
            </p>
          </div>
          <div className="text-center p-6 bg-white border-2 border-sky-300 rounded-xl hover:shadow-lg transition">
            <div className="text-5xl mb-3">📜</div>
            <div className="text-3xl font-bold text-sky-600 mb-3">2</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Certificate Issuance</h3>
            <p className="text-gray-600">
              Producers issue certificates for their solar energy generation (in kWh)
            </p>
          </div>
          <div className="text-center p-6 bg-white border-2 border-sky-300 rounded-xl hover:shadow-lg transition">
            <div className="text-5xl mb-3">🔄</div>
            <div className="text-3xl font-bold text-sky-600 mb-3">3</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Trading & Verification</h3>
            <p className="text-gray-600">
              Companies purchase certificates with full blockchain verification and proof
            </p>
          </div>
        </div>
      </Card>

      {/* For Producers */}
      <Card className="solar-card bg-gradient-to-br from-solar-50 to-white border-2 border-solar-300">
        <h2 className="text-3xl font-bold mb-4 text-solar-700 flex items-center gap-2">
          <span>⚡</span> For Solar Energy Producers
        </h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-solar-600">How to Get Started:</h3>
          <ol className="list-decimal list-inside space-y-2 text-lg text-gray-700">
            <li>
              Navigate to the <Link to="/admin" className="text-blue-600 font-semibold underline">Admin Panel</Link> to register your producer account
            </li>
            <li>Once registered, go to the <Link to="/producers" className="text-blue-600 font-semibold underline">Producers Dashboard</Link></li>
            <li>Select your producer account (P1, P2, etc.)</li>
            <li>Issue certificates by entering energy generated (in kWh)</li>
            <li>Your certificates are instantly recorded on the blockchain!</li>
          </ol>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-solar-600">Benefits for Producers:</h3>
          <ul className="space-y-2 text-lg text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-2">✓</span>
              <span><strong>Monetize Clean Energy:</strong> Generate revenue from your solar energy production</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-2">✓</span>
              <span><strong>Blockchain Security:</strong> All transactions are cryptographically secured and immutable</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-2">✓</span>
              <span><strong>Transparent Pricing:</strong> Set your own certificate prices and track all sales</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-2">✓</span>
              <span><strong>Instant Payments:</strong> Receive payments directly when companies purchase your certificates</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-2">✓</span>
              <span><strong>Verifiable Credentials:</strong> Every certificate is permanently recorded with unique IDs (P1_ID1, P2_ID3, etc.)</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-2">✓</span>
              <span><strong>No Intermediaries:</strong> Direct peer-to-peer transactions reduce costs and increase profits</span>
            </li>
          </ul>
        </div>
      </Card>

      {/* For Companies */}
      <Card className="solar-card bg-gradient-to-br from-energy-50 to-white border-2 border-energy-300">
        <h2 className="text-3xl font-bold mb-4 text-energy-700 flex items-center gap-2">
          <span>🏢</span> For Companies & Organizations
        </h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-energy-600">How to Get Started:</h3>
          <ol className="list-decimal list-inside space-y-2 text-lg text-gray-700">
            <li>
              Navigate to the <Link to="/admin" className="text-green-600 font-semibold underline">Admin Panel</Link> to register your company account
            </li>
            <li>Once registered, go to the <Link to="/companies" className="text-green-600 font-semibold underline">Companies Dashboard</Link></li>
            <li>Select your company account (C1, C2, etc.)</li>
            <li>Browse available certificates and enter the certificate ID you want to purchase</li>
            <li>Complete the purchase - ownership transfers instantly on the blockchain!</li>
          </ol>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-energy-600">Benefits for Companies:</h3>
          <ul className="space-y-2 text-lg text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-2">✓</span>
              <span><strong>Carbon Footprint Reduction:</strong> Offset your emissions by supporting renewable energy</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-2">✓</span>
              <span><strong>ESG Compliance:</strong> Meet environmental, social, and governance (ESG) requirements</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-2">✓</span>
              <span><strong>Blockchain Verification:</strong> Every certificate is verifiable with cryptographic proof</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-2">✓</span>
              <span><strong>Transparent History:</strong> Complete audit trail of all certificate transactions</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-2">✓</span>
              <span><strong>Tamper-Proof Records:</strong> Certificate ownership cannot be disputed or altered</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-2">✓</span>
              <span><strong>Unique Certificate IDs:</strong> Track your purchases with labels like C1_ID1, C2_ID5, etc.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 font-bold mr-2">✓</span>
              <span><strong>Brand Reputation:</strong> Demonstrate commitment to sustainability and clean energy</span>
            </li>
          </ul>
        </div>
      </Card>

      {/* Blockchain Benefits */}
      <Card className="solar-card bg-gradient-to-br from-sky-50 via-solar-50 to-energy-50 border-2 border-sky-300">
        <h2 className="text-3xl font-bold mb-4 text-sky-700 flex items-center gap-2">
          <span>🔗</span> Why Blockchain Technology?
        </h2>
        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          Our platform leverages blockchain technology to provide unparalleled security,
          transparency, and trust in renewable energy certificate trading.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-solar border-l-4 border-solar-500 hover:shadow-solar-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-solar-700 flex items-center gap-2">
              <span>🔒</span> Security & Immutability
            </h3>
            <p className="text-gray-700">
              All transactions are cryptographically secured and permanently recorded. Once a certificate
              is issued or purchased, the record cannot be altered, deleted, or tampered with.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-solar border-l-4 border-sky-500 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-sky-700 flex items-center gap-2">
              <span>👁️</span> Transparency
            </h3>
            <p className="text-gray-700">
              Every transaction is visible and verifiable on the blockchain. Anyone can verify the
              authenticity of a certificate and trace its complete history from issuance to purchase.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-energy border-l-4 border-energy-500 hover:shadow-energy-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-energy-700 flex items-center gap-2">
              <span>✓</span> Cryptographic Verification
            </h3>
            <p className="text-gray-700">
              Merkle tree technology provides mathematical proof that certificates are authentic.
              Generate and verify proofs instantly without trusting any central authority.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-solar border-l-4 border-solar-600 hover:shadow-solar-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-solar-700 flex items-center gap-2">
              <span>⚡</span> Decentralization
            </h3>
            <p className="text-gray-700">
              No single entity controls the platform. Smart contracts automatically execute transactions,
              eliminating intermediaries and reducing costs while increasing trust.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-solar border-l-4 border-sky-600 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-sky-700 flex items-center gap-2">
              <span>🛡️</span> Data Protection
            </h3>
            <p className="text-gray-700">
              Your transaction data is protected by military-grade encryption. The blockchain network
              ensures data integrity and prevents unauthorized access or modifications.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-energy border-l-4 border-energy-600 hover:shadow-energy-lg transition">
            <h3 className="text-xl font-semibold mb-2 text-energy-700 flex items-center gap-2">
              <span>📊</span> Complete Audit Trail
            </h3>
            <p className="text-gray-700">
              Every action is timestamped and recorded with unique transaction hashes. Perfect for
              compliance, reporting, and regulatory requirements.
            </p>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <div className="relative overflow-hidden bg-gradient-to-r from-energy-500 via-solar-500 to-sky-500 text-white rounded-2xl p-8 md:p-12 text-center shadow-solar-lg">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Join the renewable energy revolution today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/admin"
             className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-sky-600 transition duration-200 flex items-center justify-center gap-2"            >
              <span>⚡</span> Register as Producer
            </Link>
            <Link
              to="/admin"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-sky-600 transition duration-200 flex items-center justify-center gap-2"            >
              <span>🏢</span> Register as Company
            </Link>
            <Link
              to="/explorer"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-sky-600 transition duration-200 flex items-center justify-center gap-2"
            >
              <span>🔍</span> Explore Blockchain
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <Card className="solar-card bg-gradient-to-br from-gray-50 to-white">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <span>💡</span> Need Help?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-gray-700 flex items-start gap-2">
            <span className="text-solar-500 font-bold">⚡</span>
            <span><strong>For Producers:</strong> Visit the <Link to="/producers" className="text-solar-600 font-semibold hover:underline">Producers Dashboard</Link> to issue certificates</span>
          </p>
          <p className="text-gray-700 flex items-start gap-2">
            <span className="text-energy-500 font-bold">🏢</span>
            <span><strong>For Companies:</strong> Visit the <Link to="/companies" className="text-energy-600 font-semibold hover:underline">Companies Dashboard</Link> to purchase certificates</span>
          </p>
          <p className="text-gray-700 flex items-start gap-2">
            <span className="text-sky-500 font-bold">🔍</span>
            <span><strong>View Transactions:</strong> Check the <Link to="/explorer" className="text-sky-600 font-semibold hover:underline">Block Explorer</Link> to verify any transaction</span>
          </p>
          <p className="text-gray-700 flex items-start gap-2">
            <span className="text-solar-500 font-bold">📊</span>
            <span><strong>Platform Metrics:</strong> See real-time statistics at <Link to="/metrics" className="text-solar-600 font-semibold hover:underline">Metrics Dashboard</Link></span>
          </p>
        </div>
      </Card>
    </div>
  );
}
