// src/components/IoTSimulator.jsx
import React, { useState, useEffect } from "react";
import Button from "./ui/Button";

/**
 * IoTSimulator
 * - Manual simulation
 * - Auto simulation
 * - Sends energy (kWh) upward via onSend()
 */
export default function IoTSimulator({ onSend }) {
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    let interval;
    if (auto) {
      interval = setInterval(() => {
        const val = Math.round(5 + Math.random() * 50);
        setCurrent(prev => prev + val);
        onSend && onSend(val);
      }, 5000); // every 5 seconds
    }
    return () => clearInterval(interval);
  }, [auto, onSend]);

  // Manual one-time reading
  function sendOne() {
    const val = Math.round(5 + Math.random() * 50);
    setCurrent(c => c + val);
    onSend && onSend(val);
  }

  return (
    <div className="space-y-3">
      <div className="text-sm">
        Simulated cumulative energy (kWh): <b>{current}</b>
      </div>

      <div className="flex gap-3">
        <Button onClick={sendOne}>Send Reading</Button>

        <Button onClick={() => setAuto(a => !a)}>
          {auto ? "Stop Auto" : "Start Auto"}
        </Button>
      </div>
    </div>
  );
}
