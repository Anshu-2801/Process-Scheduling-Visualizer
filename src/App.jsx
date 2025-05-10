// Final Updated App.jsx with Modern UI and Industry-Level Layout

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import ProcessForm from "./components/ProcessForm";
import ResultPanel from "./components/ResultPanel";
import GanttChart from "./components/GanttChart";
import { fcfs, sjf, rr, priorityScheduling } from "./algorithms/schedulingLogic";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./assets/style.css";
import CPUMetricsChart from "./components/CPUMetricsChart";
import AlgoExplanation from "./components/AlgoExplanation";
import ChatBot from "./components/ChatBot";
import { FaBrain, FaDownload, FaTrash } from "react-icons/fa";




function App() {
  const [processes, setProcesses] = useState([]);
  const [ganttChart, setGanttChart] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [avgWT, setAvgWT] = useState("");
  const [avgTAT, setAvgTAT] = useState("");
  const [selectedAlgo, setSelectedAlgo] = useState("FCFS");
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [darkMode, setDarkMode] = useState(false);
  const [cpuUtil, setCpuUtil] = useState("");
const [throughput, setThroughput] = useState("");


  const addProcess = (newProcess) => {
    setProcesses([...processes, newProcess]);
  };

  const handleRunScheduling = () => {
    let result;

    if (selectedAlgo === "FCFS") {
      result = fcfs(processes);
    } else if (selectedAlgo === "SJF") {
      result = sjf(processes);
    } else if (selectedAlgo === "RR") {
      result = rr(processes, timeQuantum);
    } else if (selectedAlgo === "Priority") {
      result = priorityScheduling(processes);
    } else {
      alert(`${selectedAlgo} not implemented yet.`);
      return;
    }

    setGanttChart(result.ganttData);
    setMetrics(result.metrics);
    setAvgWT(result.avgWT);
    setAvgTAT(result.avgTAT);
    setCpuUtil(result.cpuUtil);
setThroughput(result.throughput);

  };

  const handleReset = () => {
    setProcesses([]);
    setGanttChart([]);
    setMetrics([]);
    setAvgWT("");
    setAvgTAT("");
    setCpuUtil("");
    setThroughput("");
  };
  

  const handleDownloadJSON = () => {
    const data = {
      algorithm: selectedAlgo,
      timeQuantum: selectedAlgo === "RR" ? timeQuantum : null,
      processes: processes,
      metrics: metrics,
      avgWaitingTime: avgWT,
      avgTurnaroundTime: avgTAT,
      ganttChart: ganttChart,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `process_scheduling_${selectedAlgo}.json`;
    link.click();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("result-section");
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`process_scheduling_${selectedAlgo}.pdf`);
    });
  };

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <div style={{ textAlign: "right", padding: "10px 30px" }}>
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            style={{ marginRight: "8px" }}
          />
          Dark Mode
        </label>
      </div>

      <Navbar />

      <div className="card">
        <ProcessForm onAddProcess={addProcess} />
      </div>

      <div className="card">
      <AlgoExplanation selectedAlgo={selectedAlgo} />

      <ResultPanel
  processes={processes}
  metrics={metrics}
  avgWT={avgWT}
  avgTAT={avgTAT}
  cpuUtil={cpuUtil}
  throughput={throughput}
/>

      </div>

      <div className="card" style={{ textAlign: "center" }}>
        <select
          value={selectedAlgo}
          onChange={(e) => setSelectedAlgo(e.target.value)}
          className="dropdown"
        >
          <option value="FCFS">FCFS (First Come First Serve)</option>
          <option value="SJF">SJF (Shortest Job First)</option>
          <option value="RR">Round Robin</option>
          <option value="Priority">Priority Scheduling</option>
        </select>

        {selectedAlgo === "RR" && (
          <input
            type="number"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
            placeholder="Time Quantum"
            className="input"
          />
        )}

        <button className="btn" onClick={handleRunScheduling}>Run Scheduling</button>
        <button className="btn danger" onClick={handleReset}>Reset All</button>
        <button className="btn success" onClick={handleDownloadJSON}>Download JSON</button>
        <button className="btn purple" onClick={handleDownloadPDF}>Download PDF</button>
      </div>

      <div className="card">
  <GanttChart ganttData={ganttChart} />
</div>

{cpuUtil && throughput && (
  <div className="card">
    <CPUMetricsChart cpuUtil={cpuUtil} throughput={throughput} />
  </div>
)}

<div className="card">
  <ChatBot />
</div>



    </div>
  );
}

export default App;
