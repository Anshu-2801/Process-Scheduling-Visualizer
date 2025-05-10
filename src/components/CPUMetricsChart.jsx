import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

function CPUMetricsChart({ cpuUtil, throughput }) {
  const data = [
    { name: "CPU Utilization", value: parseFloat(cpuUtil) },
    { name: "Throughput", value: parseFloat(throughput) }
  ];

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2 className="section-title">📈 CPU Performance Metrics</h2>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 'auto']} />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CPUMetricsChart;
