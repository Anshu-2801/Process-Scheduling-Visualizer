import React from "react";

const explanations = {
  FCFS: "First Come First Serve (FCFS) algorithm executes processes in the order they arrive. No preemption. Simple and fair, but can cause long waiting times.",
  SJF: "Shortest Job First (SJF) selects the process with the smallest burst time next. It's efficient but can starve long jobs if short ones keep coming.",
  RR: "Round Robin (RR) uses a time quantum. Each process gets equal CPU time in rounds. It's fair and good for time-sharing systems.",
  Priority: "Priority Scheduling assigns a priority number to each process. Lower number = higher priority. May cause starvation if priorities aren't managed well.",
};

function AlgoExplanation({ selectedAlgo }) {
  return (
    <div className="card">
      <h2 className="section-title">🧠 About {selectedAlgo} Scheduling</h2>
      <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
        {explanations[selectedAlgo] || "No explanation available for this algorithm."}
      </p>
    </div>
  );
}

export default AlgoExplanation;
