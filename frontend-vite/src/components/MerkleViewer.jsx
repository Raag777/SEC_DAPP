// src/components/MerkleViewer.jsx
import React from "react";

/**
 * Simple Merkle viewer that expects this shape:
 * {
 *   root: "0xabc...",
 *   leaves: ["0xaaa...", "0xbbb...", ...],
 *   proofs: { "0": ["0x..", ...], ... }  // optional
 * }
 *
 * This is a small visual aid for presentations — not a production graph library.
 */

export default function MerkleViewer({ data }) {
  if (!data) return <div className="p-4 text-sm text-gray-500">No merkle data</div>;

  const { root, leaves } = data;

  return (
    <div className="p-4 border rounded bg-white dark:bg-gray-800">
      <div className="mb-3">
        <div className="text-xs text-gray-500">Merkle Root</div>
        <div className="font-mono break-all">{root}</div>
      </div>

      <div>
        <div className="text-xs text-gray-500 mb-2">Leaves</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {leaves && leaves.length ? leaves.map((l, i) => (
            <div key={i} className="p-2 border rounded font-mono text-sm break-all">
              {i+1}. {l}
            </div>
          )) : <div className="text-sm text-gray-500">No leaves</div>}
        </div>
      </div>

      <div className="mt-4">
        <svg width="100%" height="80" viewBox="0 0 600 80" className="mx-auto block">
          {/* root */}
          <text x="300" y="18" textAnchor="middle" fontSize="12">Root</text>
          <rect x="260" y="22" width="80" height="18" rx="4" fill="#eef2ff" stroke="#c7d2fe" />
          <text x="300" y="35" textAnchor="middle" fontSize="10" fontFamily="monospace">{root?.slice(0,12) || ""}...</text>

          {/* leaves */}
          {leaves && leaves.slice(0,4).map((l, idx) => {
            const x = 60 + idx * 140;
            return (
              <g key={idx}>
                <text x={x+40} y="58" textAnchor="middle" fontSize="10">L{idx+1}</text>
                <rect x={x} y="62" width="80" height="14" rx="4" fill="#f8fafc" stroke="#e6edf8" />
                <text x={x+40} y="72" textAnchor="middle" fontSize="8" fontFamily="monospace">{l?.slice(0,10) || ""}..</text>
                <line x1={x+40} y1="62" x2="300" y2="40" stroke="#e5e7eb" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
