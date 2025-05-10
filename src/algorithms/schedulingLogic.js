// Updated schedulingLogic.js with CPU Utilization & Throughput

export function fcfs(processes) {
    const sorted = [...processes].sort(
      (a, b) => parseInt(a.arrivalTime) - parseInt(b.arrivalTime)
    );
  
    let currentTime = 0;
    const ganttData = [];
    const metrics = [];
  
    for (let i = 0; i < sorted.length; i++) {
      const p = sorted[i];
      const arrival = parseInt(p.arrivalTime);
      const burst = parseInt(p.burstTime);
  
      if (currentTime < arrival) {
        currentTime = arrival;
      }
  
      const start = currentTime;
      const end = start + burst;
  
      ganttData.push({ id: p.id, start, end, duration: burst });
  
      metrics.push({
        id: p.id,
        arrivalTime: arrival,
        burstTime: burst,
        completionTime: end,
        turnaroundTime: end - arrival,
        waitingTime: end - arrival - burst,
      });
  
      currentTime = end;
    }
  
    const avgWT = (metrics.reduce((sum, p) => sum + p.waitingTime, 0) / metrics.length).toFixed(2);
    const avgTAT = (metrics.reduce((sum, p) => sum + p.turnaroundTime, 0) / metrics.length).toFixed(2);
    const totalBurst = metrics.reduce((sum, p) => sum + p.burstTime, 0);
    const completionTime = Math.max(...metrics.map(p => p.completionTime));
    const cpuUtil = ((totalBurst / completionTime) * 100).toFixed(2);
    const throughput = (metrics.length / completionTime).toFixed(2);
  
    return { ganttData, metrics, avgWT, avgTAT, cpuUtil, throughput };
  }
  
  export function sjf(processes) {
    const sorted = [...processes].map(p => ({
      id: p.id,
      arrivalTime: parseInt(p.arrivalTime),
      burstTime: parseInt(p.burstTime),
      priority: parseInt(p.priority || 0),
    }));
  
    let currentTime = 0;
    const ganttData = [];
    const metrics = [];
    const completed = [];
  
    while (completed.length < sorted.length) {
      const available = sorted.filter(
        p => !completed.includes(p.id) && p.arrivalTime <= currentTime
      );
  
      if (available.length === 0) {
        currentTime++;
        continue;
      }
  
      const shortest = available.reduce((a, b) =>
        a.burstTime < b.burstTime ? a : b
      );
  
      const start = currentTime;
      const end = start + shortest.burstTime;
  
      ganttData.push({ id: shortest.id, start, end, duration: shortest.burstTime });
  
      metrics.push({
        id: shortest.id,
        arrivalTime: shortest.arrivalTime,
        burstTime: shortest.burstTime,
        completionTime: end,
        turnaroundTime: end - shortest.arrivalTime,
        waitingTime: end - shortest.arrivalTime - shortest.burstTime,
      });
  
      currentTime = end;
      completed.push(shortest.id);
    }
  
    const avgWT = (metrics.reduce((sum, p) => sum + p.waitingTime, 0) / metrics.length).toFixed(2);
    const avgTAT = (metrics.reduce((sum, p) => sum + p.turnaroundTime, 0) / metrics.length).toFixed(2);
    const totalBurst = metrics.reduce((sum, p) => sum + p.burstTime, 0);
    const completionTime = Math.max(...metrics.map(p => p.completionTime));
    const cpuUtil = ((totalBurst / completionTime) * 100).toFixed(2);
    const throughput = (metrics.length / completionTime).toFixed(2);
  
    return { ganttData, metrics, avgWT, avgTAT, cpuUtil, throughput };
  }
  
  export function rr(processes, quantum) {
    const readyQueue = [];
    const ganttData = [];
    const metrics = [];
    const sorted = [...processes].map(p => ({
      id: p.id,
      arrivalTime: parseInt(p.arrivalTime),
      burstTime: parseInt(p.burstTime),
      remainingTime: parseInt(p.burstTime),
      completionTime: 0,
      startTime: -1,
    }));
  
    let currentTime = 0;
    let completed = 0;
    const visited = new Set();
  
    while (completed < sorted.length) {
      sorted.forEach(p => {
        if (p.arrivalTime <= currentTime && !visited.has(p.id)) {
          readyQueue.push(p);
          visited.add(p.id);
        }
      });
  
      if (readyQueue.length === 0) {
        currentTime++;
        continue;
      }
  
      const currentProcess = readyQueue.shift();
  
      if (currentProcess.startTime === -1) {
        currentProcess.startTime = currentTime;
      }
  
      const execTime = Math.min(currentProcess.remainingTime, quantum);
      const start = currentTime;
      const end = start + execTime;
  
      ganttData.push({ id: currentProcess.id, start, end, duration: execTime });
  
      currentTime += execTime;
      currentProcess.remainingTime -= execTime;
  
      sorted.forEach(p => {
        if (p.arrivalTime <= currentTime && !visited.has(p.id)) {
          readyQueue.push(p);
          visited.add(p.id);
        }
      });
  
      if (currentProcess.remainingTime > 0) {
        readyQueue.push(currentProcess);
      } else {
        currentProcess.completionTime = currentTime;
        completed++;
        const tat = currentTime - currentProcess.arrivalTime;
        const wt = tat - currentProcess.burstTime;
  
        metrics.push({
          id: currentProcess.id,
          arrivalTime: currentProcess.arrivalTime,
          burstTime: currentProcess.burstTime,
          completionTime: currentTime,
          turnaroundTime: tat,
          waitingTime: wt,
        });
      }
    }
  
    const avgWT = (metrics.reduce((sum, p) => sum + p.waitingTime, 0) / metrics.length).toFixed(2);
    const avgTAT = (metrics.reduce((sum, p) => sum + p.turnaroundTime, 0) / metrics.length).toFixed(2);
    const totalBurst = metrics.reduce((sum, p) => sum + p.burstTime, 0);
    const completionTime = Math.max(...metrics.map(p => p.completionTime));
    const cpuUtil = ((totalBurst / completionTime) * 100).toFixed(2);
    const throughput = (metrics.length / completionTime).toFixed(2);
  
    return { ganttData, metrics, avgWT, avgTAT, cpuUtil, throughput };
  }
  
  export function priorityScheduling(processes) {
    const sorted = [...processes].map(p => ({
      id: p.id,
      arrivalTime: parseInt(p.arrivalTime),
      burstTime: parseInt(p.burstTime),
      priority: parseInt(p.priority || 0),
    }));
  
    let currentTime = 0;
    const ganttData = [];
    const metrics = [];
    const completed = [];
  
    while (completed.length < sorted.length) {
      const available = sorted.filter(
        p => !completed.includes(p.id) && p.arrivalTime <= currentTime
      );
  
      if (available.length === 0) {
        currentTime++;
        continue;
      }
  
      const highest = available.reduce((a, b) =>
        a.priority < b.priority ? a : b
      );
  
      const start = currentTime;
      const end = start + highest.burstTime;
  
      ganttData.push({ id: highest.id, start, end, duration: highest.burstTime });
  
      metrics.push({
        id: highest.id,
        arrivalTime: highest.arrivalTime,
        burstTime: highest.burstTime,
        completionTime: end,
        turnaroundTime: end - highest.arrivalTime,
        waitingTime: end - highest.arrivalTime - highest.burstTime,
      });
  
      currentTime = end;
      completed.push(highest.id);
    }
  
    const avgWT = (metrics.reduce((sum, p) => sum + p.waitingTime, 0) / metrics.length).toFixed(2);
    const avgTAT = (metrics.reduce((sum, p) => sum + p.turnaroundTime, 0) / metrics.length).toFixed(2);
    const totalBurst = metrics.reduce((sum, p) => sum + p.burstTime, 0);
    const completionTime = Math.max(...metrics.map(p => p.completionTime));
    const cpuUtil = ((totalBurst / completionTime) * 100).toFixed(2);
    const throughput = (metrics.length / completionTime).toFixed(2);
  
    return { ganttData, metrics, avgWT, avgTAT, cpuUtil, throughput };
  }
  