// Final Updated ResultPanel.jsx with Modern UI

import React from "react";
import "../assets/style.css";

function ResultPanel({ processes, metrics, avgWT, avgTAT, cpuUtil, throughput }) {

  return (
    <div className="result-panel">
      <h2 className="section-title">📋 Entered Processes</h2>

      {processes.length === 0 ? (
        <p style={{ textAlign: "center" }}>No processes added yet.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Process ID</th>
                <th>Arrival Time</th>
                <th>Burst Time</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p, index) => (
                <tr key={index}>
                  <td>{p.id}</td>
                  <td>{p.arrivalTime}</td>
                  <td>{p.burstTime}</td>
                  <td>{p.priority || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {metrics.length > 0 && (
        <>
          <h2 className="section-title">📊 Scheduling Results</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Process</th>
                  <th>Completion Time</th>
                  <th>Turnaround Time</th>
                  <th>Waiting Time</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m, i) => (
                  <tr key={i}>
                    <td>{m.id}</td>
                    <td>{m.completionTime}</td>
                    <td>{m.turnaroundTime}</td>
                    <td>{m.waitingTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="averages">
            <p><strong>Average Turnaround Time:</strong> {avgTAT}</p>
            <p><strong>Average Waiting Time:</strong> {avgWT}</p>
          </div>
          <div className="averages">
  <p><strong>Average Turnaround Time:</strong> {avgTAT}</p>
  <p><strong>Average Waiting Time:</strong> {avgWT}</p>
  <p><strong>CPU Utilization:</strong> {cpuUtil}%</p>
  <p><strong>Throughput:</strong> {throughput} processes/unit time</p>
</div>

        </>
      )}
    </div>
  );
}

export default ResultPanel;
