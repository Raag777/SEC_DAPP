import { useState, useEffect } from "react";
import { registerCompany, listCompanies } from "../api/companies";
import { purchaseCertificate, getAllCertificates } from "../api/certificates";
import { connectWallet } from "../blockchain/contract";

export default function Companies() {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [companies, setCompanies] = useState([]);
  const [certs, setCerts] = useState([]);
  const [wallet, setWallet] = useState("");

  const load = async () => {
    const c = await listCompanies();
    const cert = await getAllCertificates();
    setCompanies(c.data);
    setCerts(cert.data);
  };

  const connect = async () => {
    const w = await connectWallet();
    setWallet(w);
  };

  useEffect(() => { load(); }, []);

  const register = async () => {
    await registerCompany(address, name);
    alert("Company Registered!");
    load();
  };

  const buy = async (id) => {
    await purchaseCertificate(wallet, id);
    alert("Purchase Successful!");
    load();
  };

  return (
    <div className="p-10">
      <h1 className="title">Company Dashboard</h1>

      {!wallet ? (
        <button className="btn" onClick={connect}>Connect Wallet</button>
      ) : (
        <p className="text-gray-700">Wallet: {wallet}</p>
      )}

      <div className="max-w-xl space-y-3 mt-6">
        <input
          placeholder="Company Address"
          className="input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          placeholder="Company Name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="btn" onClick={register}>Register Company</button>
      </div>

      <h2 className="subtitle mt-10">Available Certificates</h2>

      <ul className="grid md:grid-cols-2 gap-4">
        {certs.map((c) => (
          <li key={c.certID} className="card">
            <p><b>ID:</b> {c.certID}</p>
            <p><b>Energy:</b> {c.energy} kWh</p>

            {!c.owner && (
              <button className="btn mt-3" onClick={() => buy(c.certID)}>
                Buy This Certificate
              </button>
            )}

            {c.owner && <p className="text-green-600 font-medium">Owned</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
