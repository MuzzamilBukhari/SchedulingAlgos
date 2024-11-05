class PCB {
  constructor(pid, burstTime, arrivalTime) {
    this.pid = pid;
    this.burstTime = burstTime;
    this.arrivalTime = arrivalTime;
    this.startTime = -1;
    this.finishTime = null;
    this.turnAroundTime = null;
    this.waitingTime = null;
  }

  setStartTime(time) {
    if (this.startTime === -1) {
      this.startTime = time;
    }
  }

  calculateMetrics() {
    this.turnAroundTime = this.finishTime - this.arrivalTime;
    this.waitingTime = this.turnAroundTime - this.burstTime;
  }
}

let PCBs = [];
let ganttChart = [];

// Capture the number of processes and dynamically generate input fields for burst times only
document.getElementById("numProcesses").addEventListener("change", function () {
  const numProcesses = Number(this.value);
  const processInputContainer = document.getElementById(
    "processInputContainer"
  );
  processInputContainer.innerHTML = "";

  for (let i = 0; i < numProcesses; i++) {
    addProcessInputFields(i);
  }
});

function addProcessInputFields(i) {
  const processInputContainer = document.getElementById(
    "processInputContainer"
  );

  const processGroup = document.createElement("div");
  processGroup.classList.add("form-group");

  const label = document.createElement("label");
  label.textContent = `Execution Time for Process ${i + 1}:`;

  const burstInput = document.createElement("input");
  burstInput.type = "number";
  burstInput.min = "1";
  burstInput.id = `burstTime${i}`;
  burstInput.classList.add("input-field");
  burstInput.placeholder = "Burst Time";

  processGroup.appendChild(label);
  processGroup.appendChild(burstInput);
  processInputContainer.appendChild(processGroup);
}

document.getElementById("startSimulation").addEventListener("click", () => {
  startSimulation();
});

function startSimulation() {
  PCBs = [];
  ganttChart = [];

  const n = Number(document.getElementById("numProcesses").value);

  for (let i = 0; i < n; i++) {
    const burstTime = Number(document.getElementById(`burstTime${i}`).value);
    const arrivalTime = i; // Automatically assign arrival time incrementally
    const pcb = new PCB(`P${i + 1}`, burstTime, arrivalTime);
    PCBs.push(pcb);
  }

  simulateSJF();
  displayGanttChart();
  displayPCBInfo();
}

function simulateSJF() {
  PCBs.sort(
    (a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime
  );

  let time = 0;
  ganttChart = [];

  PCBs.forEach((pcb) => {
    if (time < pcb.arrivalTime) {
      time = pcb.arrivalTime;
    }

    pcb.setStartTime(time);

    // Add each quantum individually to Gantt chart for the current process
    for (let i = 0; i < pcb.burstTime; i++) {
      ganttChart.push(pcb.pid); // Add process ID for each time unit
      time++;
    }

    pcb.finishTime = time;
    pcb.calculateMetrics();
  });
}

function displayGanttChart() {
  const ganttDiv = document.getElementById("ganttChart");
  ganttDiv.innerHTML = ""; // Clear previous chart

  ganttChart.forEach((processId, index) => {
    const bar = document.createElement("div");
    bar.classList.add("gantt-bar");
    bar.textContent = processId; // Display process ID in each quantum
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
      <p>Burst Time: ${pcb.burstTime}</p>
      <p>Start Time: ${pcb.startTime}</p>
      <p>Finish Time: ${pcb.finishTime}</p>
      <p>Turnaround Time: ${pcb.turnAroundTime}</p>
      <p>Waiting Time: ${pcb.waitingTime}</p>
    `;
    outputDiv.appendChild(pcbBlock);
  });
}
