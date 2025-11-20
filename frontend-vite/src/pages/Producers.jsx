import { useState, useEffect } from "react";
import { registerProducer, listProducers } from "../api/producers";

export default function Producers() {
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [producers, setProducers] = useState([]);

  const load = async () => {
    const res = await listProducers();
    setProducers(res.data);
  };

  useEffect(() => { load(); }, []);

  const register = async () => {
    await registerProducer(address, name);
    alert("Producer Registered!");
    load();
  };

  return (
    <div className="p-10">
      <h1 className="title">Producer Dashboard</h1>

      <div className="max-w-xl space-y-3">
        <input
          placeholder="Producer Address"
          className="input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          placeholder="Producer Name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="btn" onClick={register}>
          Register Producer
        </button>
      </div>

      <h2 className="subtitle mt-10">Registered Producers</h2>

      <ul className="space-y-2">
        {producers.map((p) => (
          <li key={p.address} className="card">
            <strong>{p.name}</strong> — {p.address}
          </li>
        ))}
      </ul>
    </div>
  );
}
