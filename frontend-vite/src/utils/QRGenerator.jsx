// src/utils/QRGenerator.jsx
import React from "react";
import QRCode from "react-qr-code";

export default function QR({ text, size = 120 }) {
  return (
    <div className="p-2 bg-white rounded">
      <QRCode value={text} size={size} />
    </div>
  );
}
