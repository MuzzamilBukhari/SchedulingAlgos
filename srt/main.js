class PCB {
  constructor(pid, executionTime, arrivalTime) {
    this.pid = pid;
    this.executionTime = executionTime;
    this.remainingTime = executionTime;
    this.arrivalTime = arrivalTime;
    this.startTime = -1;
    this.finishTime = null;
    this.turnAroundTime = null;
    this.waitingTime = null;
    this.utilization = null;
  }

  setStartTime(time) {
    if (this.startTime === -1) {
      this.startTime = time;
    }
  }

  calculateMetrics() {
    this.turnAroundTime = this.finishTime - this.arrivalTime;
    this.waitingTime = this.turnAroundTime - this.executionTime;

    this.utilization = this.executionTime / this.turnAroundTime;
  }
}

let PCBs = [];
let ganttChart = [];

document.getElementById("numProcesses").addEventListener("change", function () {
  const numProcesses = Number(this.value);
  const processInputContainer = document.getElementById(
    "processInputContainer"
  );
  processInputContainer.innerHTML = "";

  for (let i = 0; i < numProcesses; i++) {
    const processGroup = document.createElement("div");
    processGroup.classList.add("form-group");

    const label = document.createElement("label");
    label.textContent = `Execution Time for Process ${i + 1}:`;

    const burstInput = document.createElement("input");
    burstInput.type = "number";
    burstInput.min = "1";
    burstInput.id = `executionTime${i}`;
    burstInput.classList.add("input-field");
    burstInput.placeholder = "Execution Time";

    processGroup.appendChild(label);
    processGroup.appendChild(burstInput);
    processInputContainer.appendChild(processGroup);
  }
});

document.getElementById("startSimulation").addEventListener("click", () => {
  PCBs = [];
  ganttChart = [];

  const n = Number(document.getElementById("numProcesses").value);

  for (let i = 0; i < n; i++) {
    const executionTime = Number(
      document.getElementById(`executionTime${i}`).value
    );
    const pcb = new PCB(`P${i + 1}`, executionTime, i + 1);
    PCBs.push(pcb);
  }

  simulateSRTF(n);
  displayGanttChart();
  displayPCBInfo();
});

function simulateSRTF(n) {
  let time = 0;
  let completed = 0;

  while (completed < n) {
    let shortest = null;
    let minRemainingTime = Number.MAX_VALUE;

    for (let i = 0; i < n; i++) {
      const pcb = PCBs[i];
      if (
        pcb.arrivalTime <= time &&
        pcb.remainingTime > 0 &&
        pcb.remainingTime < minRemainingTime
      ) {
        shortest = pcb;
        minRemainingTime = pcb.remainingTime;
      }
    }

    if (shortest) {
      shortest.setStartTime(time);
      ganttChart.push(shortest.pid); // Track for Gantt chart
      shortest.remainingTime--;

      if (shortest.remainingTime === 0) {
        completed++;
        shortest.finishTime = time + 1;
        shortest.calculateMetrics();
      }
    }
    time++;
  }
}

function displayGanttChart() {
  const ganttDiv = document.getElementById("ganttChart");
  ganttDiv.innerHTML = ""; // Clear previous chart

  ganttChart.forEach((processId) => {
    const bar = document.createElement("div");
    bar.classList.add("gantt-bar");
    bar.textContent = processId;
    ganttDiv.appendChild(bar);
  });
}

function displayPCBInfo() {
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = ""; // Clear previous output

  PCBs.forEach((pcb) => {
    let pcbBlock = document.createElement("div");
    pcbBlock.classList.add("process-block");

    pcbBlock.innerHTML = `
      <h3>Process Control Block of ${pcb.pid}</h3>
      <p>Arrival Time: ${pcb.arrivalTime}</p>
      <p>Execution Time: ${pcb.executionTime}</p>
      <p>Start Time: ${pcb.startTime}</p>
      <p>Finish Time: ${pcb.finishTime}</p>
      <p>Turnaround Time: ${pcb.turnAroundTime}</p>
      <p>Waiting Time: ${pcb.waitingTime}</p>
      <p>Utilization: ${pcb.utilization}</p>
    `;
    outputDiv.appendChild(pcbBlock);
  });
}
