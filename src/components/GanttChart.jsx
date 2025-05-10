import React, { useEffect, useState } from "react";
import "../assets/style.css";

function GanttChart({ ganttData }) {
  const [animatedData, setAnimatedData] = useState([]);

  useEffect(() => {
    let index = 0;
    setAnimatedData([]); // Reset

    if (ganttData.length === 0) return;

    const interval = setInterval(() => {
      if (index < ganttData.length) {
        
        if (ganttData[index]) {
            setAnimatedData(prev => [...prev, ganttData[index]]);
          }
          
        index++;
      } else {
        clearInterval(interval);
      }
    }, 500); // 500ms delay between bars

    return () => clearInterval(interval);
  }, [ganttData]);

  return (
    <div className="gantt-chart">
      <h2 className="section-title">🧠 Gantt Chart</h2>
      {animatedData.length === 0 ? (
        <p style={{ textAlign: "center" }}>Run scheduling to visualize execution timeline.</p>
      ) : (
        <div className="gantt-bar-container">
          {animatedData.map((item, index) => {
  if (!item || typeof item.duration !== "number") return null;
  return (
    <div
      key={index}
      className="gantt-bar"
      style={{ width: `${item.duration * 30}px` }}
    >
      <span className="bar-label">{item.id}</span>
      <span className="bar-time start">{item.start}</span>
      <span className="bar-time end">{item.end}</span>
    </div>
  );
})}
        </div>
      )}
    </div>
  );
}

export default GanttChart;
