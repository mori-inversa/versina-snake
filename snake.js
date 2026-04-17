// Simple canvas snake game.
// Grid of COLS x ROWS cells, each CELL px. Fills the viewport.

const CELL = 20;
const TICK_MS = 120;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

let COLS, ROWS;
let snake, dir, pendingDir, food, score, alive, timer;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  COLS = Math.floor(canvas.width / CELL);
  ROWS = Math.floor(canvas.height / CELL);
}

function reset() {
  resize();
  const cx = Math.floor(COLS / 2);
  const cy = Math.floor(ROWS / 2);
  snake = [
    { x: cx,     y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
    { x: cx - 3, y: cy },
    { x: cx - 4, y: cy },
    { x: cx - 5, y: cy },
  ];
  dir = { x: 1, y: 0 };
  pendingDir = dir;
  score = 0;
  alive = true;
  placeFood();
  updateScore();
}

function placeFood() {
  while (true) {
    const f = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
    if (!snake.some((s) => s.x === f.x && s.y === f.y)) {
      food = f;
      return;
    }
  }
}

function updateScore() {
  scoreEl.textContent = `Score: ${score}`;
}

function step() {
  if (!alive) return;

  dir = pendingDir;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // Wall collision
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    alive = false;
    draw();
    return;
  }

  // Self collision
  if (snake.some((s) => s.x === head.x && s.y === head.y)) {
    alive = false;
    draw();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 1;
    updateScore();
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  // Inversa green background
  ctx.fillStyle = "#13140e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle grid pattern
  ctx.beginPath();
  ctx.strokeStyle = "rgba(235, 252, 114, 0.07)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= COLS; x++) {
    ctx.moveTo(x * CELL + 0.5, 0);
    ctx.lineTo(x * CELL + 0.5, ROWS * CELL);
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.moveTo(0, y * CELL + 0.5);
    ctx.lineTo(COLS * CELL, y * CELL + 0.5);
  }
  ctx.stroke();

  // food
  ctx.fillStyle = "#ebfc72";
  ctx.fillRect(food.x * CELL, food.y * CELL, CELL, CELL);

  // snake — gradient from green (head) to purple (tail)
  for (let i = 0; i < snake.length; i++) {
    const t = snake.length === 1 ? 0 : i / (snake.length - 1);
    const hue = 120 + t * 150;
    ctx.fillStyle = `hsl(${hue}, 85%, 60%)`;
    ctx.fillRect(snake[i].x * CELL, snake[i].y * CELL, CELL, CELL);
  }

  if (!alive) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f4f3e8";
    ctx.font = "28px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 6);
    ctx.font = "14px 'JetBrains Mono', monospace";
    ctx.fillText("Press R to restart", canvas.width / 2, canvas.height / 2 + 20);
  }
}

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (dir.y !== 1) pendingDir = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (dir.y !== -1) pendingDir = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (dir.x !== 1) pendingDir = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (dir.x !== -1) pendingDir = { x: 1, y: 0 };
      break;
    case "r":
    case "R":
      reset();
      break;
  }
});

window.addEventListener("resize", () => {
  clearInterval(timer);
  reset();
  draw();
  timer = setInterval(step, TICK_MS);
});

reset();
draw();
timer = setInterval(step, TICK_MS);
