import { COLORS, CommandEngine } from "./app-core.mjs";

const canvas = document.querySelector("#drawingCanvas");
const ctx = canvas.getContext("2d");
const stage = document.querySelector(".stage");
const micButton = document.querySelector("#micButton");
const micLabel = document.querySelector("#micLabel");
const languageSelect = document.querySelector("#languageSelect");
const transcriptText = document.querySelector("#transcriptText");
const latencyPill = document.querySelector("#latencyPill");
const actionList = document.querySelector("#actionList");
const eventLog = document.querySelector("#eventLog");
const commandCount = document.querySelector("#commandCount");
const confidenceScore = document.querySelector("#confidenceScore");
const queueStatus = document.querySelector("#queueStatus");
const sceneTitle = document.querySelector("#sceneTitle");
const chips = document.querySelector("#commandChips");

const engine = new CommandEngine({ width: canvas.width, height: canvas.height });
const state = {
  operations: [],
  redo: [],
  events: [],
  recognition: null,
  listening: false,
  lastTheme: "paper"
};

function resizeCanvas() {
  render();
}

function background(theme = "paper") {
  state.lastTheme = theme;
  const w = canvas.width;
  const h = canvas.height;
  if (theme === "night") {
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, "#18213a");
    gradient.addColorStop(1, "#0c1018");
    ctx.fillStyle = gradient;
  } else if (theme === "sunset") {
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "#f3bd3e");
    gradient.addColorStop(0.52, "#e98b38");
    gradient.addColorStop(1, "#1a8ca1");
    ctx.fillStyle = gradient;
  } else if (theme === "ocean") {
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, "#8fd1d8");
    gradient.addColorStop(1, "#2f5f9d");
    ctx.fillStyle = gradient;
  } else if (theme === "sky") {
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, "#8fd1d8");
    gradient.addColorStop(0.72, "#fffaf0");
    gradient.addColorStop(1, "#e8dfcd");
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = "#fffaf0";
  }
  ctx.fillRect(0, 0, w, h);
  drawGrid(theme);
}

function drawGrid(theme) {
  ctx.save();
  ctx.globalAlpha = theme === "paper" ? 0.16 : 0.08;
  ctx.strokeStyle = theme === "paper" ? "#161713" : "#fffaf0";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function render() {
  background(state.lastTheme);
  for (const item of state.operations) {
    drawOperation(item);
  }
  updateSidebars();
}

function drawOperation(item) {
  if (item.type === "background") {
    background(item.theme);
    return;
  }
  if (item.type === "mountains") return drawMountains();
  if (item.type === "river") return drawRiver(item);
  if (item.type === "clear") return;

  const x = item.at?.x ?? canvas.width / 2;
  const y = item.at?.y ?? canvas.height / 2;
  const size = item.size || 70;
  const fill = item.style?.fill || COLORS.black;
  const stroke = item.style?.stroke || COLORS.black;
  ctx.save();
  ctx.lineWidth = item.style?.width || 8;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;

  if (item.type === "circle") {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (item.type === "rect") {
    ctx.fillRect(x - size, y - size * 0.65, size * 2, size * 1.3);
    ctx.strokeRect(x - size, y - size * 0.65, size * 2, size * 1.3);
  } else if (item.type === "triangle") {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size, y + size * 0.8);
    ctx.lineTo(x - size, y + size * 0.8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (item.type === "line") {
    ctx.beginPath();
    ctx.moveTo(x - size * 0.9, y - size * 0.35);
    ctx.lineTo(x + size * 0.9, y + size * 0.35);
    ctx.stroke();
  } else if (item.type === "arrow") {
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size - 30, y - 28);
    ctx.moveTo(x + size, y);
    ctx.lineTo(x + size - 30, y + 28);
    ctx.stroke();
  } else if (item.type === "star") {
    drawStar(x, y, size * 0.58, size, fill, stroke);
  } else if (item.type === "heart") {
    drawHeart(x, y, size, fill, stroke);
  } else if (item.type === "tree") {
    drawTree(x, y, size, fill, stroke);
  } else if (item.type === "house") {
    drawHouse(x, y, size, fill, stroke);
  } else if (item.type === "face") {
    drawFace(x, y, size, fill, stroke);
  } else if (item.type === "sun") {
    drawSun(x, y, size);
  } else if (item.type === "moon") {
    drawMoon(x, y, size);
  } else if (item.type === "cloud") {
    drawCloud(x, y, size, fill, stroke);
  } else if (item.type === "flower") {
    drawFlower(x, y, size, fill, stroke);
  } else if (item.type === "text") {
    ctx.font = `900 ${Math.max(26, size)}px Georgia, serif`;
    ctx.fillStyle = fill;
    ctx.strokeStyle = "#161713";
    ctx.lineWidth = 4;
    ctx.strokeText(item.label || "hello", x - size * 2, y);
    ctx.fillText(item.label || "hello", x - size * 2, y);
  } else {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.bezierCurveTo(x + size, y - size, x + size, y + size, x, y + size);
    ctx.bezierCurveTo(x - size, y + size, x - size, y - size, x, y - size);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawStar(x, y, inner, outer, fill, stroke) {
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.stroke();
}

function drawHeart(x, y, size, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.6);
  ctx.bezierCurveTo(x - size * 1.4, y - size * 0.2, x - size * 0.9, y - size * 1.1, x, y - size * 0.45);
  ctx.bezierCurveTo(x + size * 0.9, y - size * 1.1, x + size * 1.4, y - size * 0.2, x, y + size * 0.6);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.stroke();
}

function drawTree(x, y, size, fill, stroke) {
  ctx.fillStyle = "#8a5a35";
  ctx.fillRect(x - size * 0.12, y, size * 0.24, size * 0.9);
  ctx.strokeRect(x - size * 0.12, y, size * 0.24, size * 0.9);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size * 0.7, y + size * 0.3);
  ctx.lineTo(x - size * 0.7, y + size * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.stroke();
}

function drawHouse(x, y, size, fill, stroke) {
  ctx.fillStyle = fill;
  ctx.fillRect(x - size * 0.75, y - size * 0.15, size * 1.5, size);
  ctx.strokeStyle = stroke;
  ctx.strokeRect(x - size * 0.75, y - size * 0.15, size * 1.5, size);
  ctx.fillStyle = COLORS.red;
  ctx.beginPath();
  ctx.moveTo(x - size * 0.9, y - size * 0.15);
  ctx.lineTo(x, y - size);
  ctx.lineTo(x + size * 0.9, y - size * 0.15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#fffaf0";
  ctx.fillRect(x - size * 0.17, y + size * 0.32, size * 0.34, size * 0.52);
  ctx.strokeRect(x - size * 0.17, y + size * 0.32, size * 0.34, size * 0.52);
}

function drawFace(x, y, size, fill, stroke) {
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.stroke();
  ctx.fillStyle = "#161713";
  ctx.beginPath();
  ctx.arc(x - size * 0.35, y - size * 0.2, size * 0.09, 0, Math.PI * 2);
  ctx.arc(x + size * 0.35, y - size * 0.2, size * 0.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y + size * 0.05, size * 0.45, 0.1, Math.PI - 0.1);
  ctx.stroke();
}

function drawSun(x, y, size) {
  ctx.save();
  ctx.strokeStyle = COLORS.orange;
  ctx.lineWidth = 8;
  for (let i = 0; i < 12; i += 1) {
    const angle = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * size * 0.75, y + Math.sin(angle) * size * 0.75);
    ctx.lineTo(x + Math.cos(angle) * size * 1.1, y + Math.sin(angle) * size * 1.1);
    ctx.stroke();
  }
  ctx.fillStyle = COLORS.yellow;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.68, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawMoon(x, y, size) {
  ctx.fillStyle = COLORS.yellow;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.68, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#18213a";
  ctx.beginPath();
  ctx.arc(x + size * 0.25, y - size * 0.08, size * 0.68, 0, Math.PI * 2);
  ctx.fill();
}

function drawCloud(x, y, size, fill, stroke) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 7;
  const circles = [
    [-0.55, 0.1, 0.42],
    [-0.18, -0.2, 0.52],
    [0.28, -0.12, 0.46],
    [0.62, 0.12, 0.34]
  ];
  ctx.beginPath();
  for (const [dx, dy, radius] of circles) {
    ctx.moveTo(x + dx * size + radius * size, y + dy * size);
    ctx.arc(x + dx * size, y + dy * size, radius * size, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.stroke();
  ctx.fillRect(x - size * 0.86, y, size * 1.72, size * 0.34);
  ctx.strokeRect(x - size * 0.86, y, size * 1.72, size * 0.34);
  ctx.restore();
}

function drawFlower(x, y, size, fill, stroke) {
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 6;
  ctx.fillStyle = COLORS.green;
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.25);
  ctx.lineTo(x, y + size * 1.35);
  ctx.stroke();
  ctx.fillStyle = fill;
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(angle) * size * 0.34, y + Math.sin(angle) * size * 0.34, size * 0.22, size * 0.38, angle, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.fillStyle = COLORS.yellow;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawMountains() {
  ctx.save();
  ctx.fillStyle = "rgba(22, 23, 19, 0.28)";
  ctx.strokeStyle = "#161713";
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height * 0.72);
  ctx.lineTo(canvas.width * 0.18, canvas.height * 0.38);
  ctx.lineTo(canvas.width * 0.36, canvas.height * 0.72);
  ctx.lineTo(canvas.width * 0.52, canvas.height * 0.46);
  ctx.lineTo(canvas.width * 0.72, canvas.height * 0.72);
  ctx.lineTo(canvas.width * 0.88, canvas.height * 0.44);
  ctx.lineTo(canvas.width, canvas.height * 0.72);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawRiver(item) {
  ctx.save();
  ctx.strokeStyle = item.style?.stroke || COLORS.cyan;
  ctx.lineWidth = 42;
  ctx.globalAlpha = 0.82;
  ctx.beginPath();
  ctx.moveTo(0, canvas.height * 0.8);
  ctx.bezierCurveTo(canvas.width * 0.24, canvas.height * 0.66, canvas.width * 0.38, canvas.height * 0.96, canvas.width * 0.62, canvas.height * 0.78);
  ctx.bezierCurveTo(canvas.width * 0.78, canvas.height * 0.66, canvas.width * 0.9, canvas.height * 0.86, canvas.width, canvas.height * 0.74);
  ctx.stroke();
  ctx.restore();
}

function applyOperations(ops, source = "voice") {
  for (const item of ops) {
    if (item.type === "clear") {
      state.operations = [];
      state.redo = [];
      state.lastTheme = "paper";
      continue;
    }
    if (item.type === "undo") {
      undo();
      continue;
    }
    if (item.type === "redo") {
      redo();
      continue;
    }
    if (item.type === "export") {
      exportPng();
      continue;
    }
    state.operations.push(item);
    state.redo = [];
  }
  render();
  log(`${source}: ${ops.map((item) => item.type).join(", ")}`);
}

function runCommand(command, source = "voice") {
  const start = performance.now();
  const plan = engine.plan(command);
  const elapsed = Math.max(1, Math.round(performance.now() - start + plan.latencyMs));
  transcriptText.textContent = command;
  latencyPill.textContent = `${elapsed} ms`;
  confidenceScore.textContent = `${Math.round(plan.confidence * 100)}%`;
  queueStatus.textContent = formatActionCount(plan.operations.length);
  sceneTitle.textContent = summarizeTitle(command);
  applyOperations(plan.operations, source);
  log(plan.message);
  if (plan.repairs?.length) log(plan.repairs[0]);
  speak(plan.message);
  return plan;
}

function summarizeTitle(command) {
  const cleaned = command.trim().replace(/\s+/g, " ");
  if (!cleaned) return "Untitled voice sketch";
  return cleaned.length > 44 ? `${cleaned.slice(0, 44)}...` : cleaned;
}

function updateSidebars() {
  commandCount.textContent = formatActionCount(state.operations.length);
  actionList.innerHTML = "";
  const recent = state.operations.slice(-8).reverse();
  if (!recent.length) {
    actionList.innerHTML = '<div class="action-item"><strong>Waiting</strong><span>Canvas is clean.</span></div>';
  } else {
    for (const item of recent) {
      const div = document.createElement("div");
      div.className = "action-item";
      div.innerHTML = `<strong>${item.type}</strong><span>${describeOperation(item)}</span>`;
      actionList.append(div);
    }
  }
}

function formatActionCount(count) {
  return `${count} ${count === 1 ? "action" : "actions"}`;
}

function describeOperation(item) {
  if (item.type === "background") return `${item.theme || "paper"} background`;
  const detail = item.label || item.style?.color || "shape";
  return `${detail} at ${Math.round(item.at?.x || 0)}, ${Math.round(item.at?.y || 0)}`;
}

function log(message) {
  const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  state.events.unshift(`${stamp} ${message}`);
  state.events = state.events.slice(0, 7);
  eventLog.innerHTML = "";
  for (const item of state.events) {
    const li = document.createElement("li");
    li.textContent = item;
    eventLog.append(li);
  }
}

function undo() {
  const item = state.operations.pop();
  if (item) state.redo.push(item);
  render();
}

function redo() {
  const item = state.redo.pop();
  if (item) state.operations.push(item);
  render();
}

function exportPng() {
  const link = document.createElement("a");
  link.download = "voxcanvas-drawing.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = languageSelect.value;
  utterance.rate = 1.04;
  window.speechSynthesis.speak(utterance);
}

function setupRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    micButton.disabled = true;
    micLabel.textContent = "Mic unsupported";
    log("SpeechRecognition is unavailable in this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = languageSelect.value;

  recognition.onresult = (event) => {
    let finalText = "";
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i];
      if (result.isFinal) finalText += result[0].transcript;
      else interim += result[0].transcript;
    }
    if (interim) transcriptText.textContent = interim;
    if (finalText) runCommand(finalText, "voice");
  };

  recognition.onerror = (event) => {
    log(`mic error: ${event.error}`);
  };

  recognition.onend = () => {
    if (state.listening) recognition.start();
  };

  return recognition;
}

function startMic() {
  if (!state.recognition) state.recognition = setupRecognition();
  if (!state.recognition) return;
  state.recognition.lang = languageSelect.value;
  state.listening = true;
  state.recognition.start();
  micButton.setAttribute("aria-pressed", "true");
  micLabel.textContent = "Listening";
  stage.classList.add("is-listening");
  log("microphone opened");
}

function stopMic() {
  state.listening = false;
  state.recognition?.stop();
  micButton.setAttribute("aria-pressed", "false");
  micLabel.textContent = "Start Mic";
  stage.classList.remove("is-listening");
  log("microphone paused");
}

micButton.addEventListener("click", () => {
  if (state.listening) stopMic();
  else startMic();
});

languageSelect.addEventListener("change", () => {
  if (state.recognition) state.recognition.lang = languageSelect.value;
});

document.querySelector("#undoButton").addEventListener("click", undo);
document.querySelector("#redoButton").addEventListener("click", redo);
document.querySelector("#downloadButton").addEventListener("click", exportPng);
document.querySelector("#clearButton").addEventListener("click", () => applyOperations([{ type: "clear" }], "button"));

chips.addEventListener("click", (event) => {
  const command = event.target?.dataset?.command;
  if (command) runCommand(command, "demo");
});

window.addEventListener("resize", resizeCanvas);

background("paper");
render();
log("studio ready");

window.VoxCanvasApp = {
  runCommand,
  getState: () => ({
    operations: state.operations,
    redo: state.redo,
    events: state.events,
    theme: state.lastTheme
  })
};
