import { useState, useEffect } from "react";
import { getAllCertificates, getMerkleProof, getMerkleRoot } from "../api/certificates";

export default function CertificateView() {
  const [certs, setCerts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [proof, setProof] = useState([]);
  const [root, setRoot] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const c = await getAllCertificates();
    const r = await getMerkleRoot();
    setCerts(c.data);
    setRoot(r.data.root);
  };

  const showProof = async (id) => {
    const p = await getMerkleProof(id);
    setSelected(id);
    setProof(p.data.proof);
  };

  return (
    <div className="p-10">
      <h1 className="title">Certificates & Merkle Proof</h1>

      <p className="mt-2 mb-6 text-gray-700">
        <b>Merkle Root:</b> {root}
      </p>

      <ul className="grid md:grid-cols-2 gap-4">
        {certs.map((c) => (
          <li key={c.certID} className="card">
            <p><b>ID:</b> {c.certID}</p>
            <p><b>Energy:</b> {c.energy} kWh</p>
            <p><b>Owner:</b> {c.owner || "None"}</p>

            <button className="btn mt-2" onClick={() => showProof(c.certID)}>
              Generate Proof
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="card mt-10">
          <h2 className="subtitle">Proof for {selected}</h2>
          <pre className="text-sm mt-3 whitespace-pre-wrap">
            {JSON.stringify(proof, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
