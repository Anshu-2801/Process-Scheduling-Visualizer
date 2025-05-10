// Final Updated ProcessForm.jsx with Clean UI

import React, { useState } from "react";
import "../assets/style.css";

function ProcessForm({ onAddProcess }) {
  const [process, setProcess] = useState({
    id: "",
    arrivalTime: "",
    burstTime: "",
    priority: ""
  });

  const handleChange = (e) => {
    setProcess({ ...process, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (process.id && process.arrivalTime && process.burstTime) {
      onAddProcess(process);
      setProcess({ id: "", arrivalTime: "", burstTime: "", priority: "" });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        className="input"
        type="text"
        name="id"
        placeholder="Process ID"
        value={process.id}
        onChange={handleChange}
        required
      />
      <input
        className="input"
        type="number"
        name="arrivalTime"
        placeholder="Arrival Time"
        value={process.arrivalTime}
        onChange={handleChange}
        required
      />
      <input
        className="input"
        type="number"
        name="burstTime"
        placeholder="Burst Time"
        value={process.burstTime}
        onChange={handleChange}
        required
      />
      <input
        className="input"
        type="number"
        name="priority"
        placeholder="Priority (optional)"
        value={process.priority}
        onChange={handleChange}
      />
      <button className="btn primary" type="submit">Add Process</button>
    </form>
  );
}

export default ProcessForm;