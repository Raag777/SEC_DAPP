import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export default function EnergyChart({ labels = [], series = [] }) {
  const data = { labels, datasets: [{ label: "kWh", data: series, fill: false }]};
  return <div className="bg-white p-4 rounded shadow"><Line data={data} /></div>;
}
