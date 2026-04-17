// Simple canvas snake game.
// Grid of GRID x GRID cells, each CELL px.

const CELL = 20;
const GRID = 20;
const TICK_MS = 120;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");

let snake, dir, pendingDir, food, score, alive, timer;

function reset() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
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
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
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
  if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
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
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // food
  ctx.fillStyle = "#e74c3c";
  ctx.fillRect(food.x * CELL, food.y * CELL, CELL, CELL);

  // snake
  ctx.fillStyle = "#2ecc71";
  for (const s of snake) {
    ctx.fillRect(s.x * CELL, s.y * CELL, CELL, CELL);
  }

  if (!alive) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.font = "28px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 6);
    ctx.font = "14px system-ui, sans-serif";
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

reset();
draw();
timer = setInterval(step, TICK_MS);
