// src/components/dashboards/IoTSimulatorPage.jsx
import React from "react";
import IoTSimulator from "../IoTSimulator";
import Card from "../ui/Card";

export default function IoTSimulatorPage() {
  return (
    <div className="p-6">
      <Card title="IoT Energy Simulator">
        <IoTSimulator onSend={(val) => alert(`Simulated ${val} kWh`)} />
      </Card>
    </div>
  );
}
