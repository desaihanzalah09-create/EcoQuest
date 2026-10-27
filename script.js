const items = [
  { name: "Newspaper", type: "paper", emoji: "📰" },
  { name: "Cardboard Box", type: "paper", emoji: "📦" },
  { name: "Plastic Bottle", type: "plastic", emoji: "🥤" },
  { name: "Plastic Bag", type: "plastic", emoji: "🛍️" },
  { name: "Glass Jar", type: "glass", emoji: "🫙" },
  { name: "Wine Bottle", type: "glass", emoji: "🍾" },
  { name: "Apple Core", type: "organic", emoji: "🍎" },
  { name: "Banana Peel", type: "organic", emoji: "🍌" }
];

let score = 0;
let streak = 0;
let timeLeft = 45;
let timerInterval = null;
let currentItem = null;

const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const wasteItemEl = document.getElementById("waste-item");
const itemEmojiEl = document.getElementById("item-emoji");
const itemNameEl = document.getElementById("item-name");
const bins = document.querySelectorAll(".bin");
const modal = document.getElementById("game-over-modal");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");

function initGame() {
  score = 0;
  streak = 0;
  timeLeft = 45;
  scoreEl.textContent = score;
  streakEl.textContent = "0x";
  timerEl.textContent = timeLeft;
  modal.classList.add("hidden");

  spawnNextItem();
  
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

function spawnNextItem() {
  const randomIndex = Math.floor(Math.random() * items.length);
  currentItem = items[randomIndex];
  itemEmojiEl.textContent = currentItem.emoji;
  itemNameEl.textContent = currentItem.name;
}

function handleSort(selectedType) {
  if (timeLeft <= 0) return;

  if (selectedType === currentItem.type) {
    streak++;
    const points = 10 * streak;
    score += points;
    scoreEl.textContent = score;
    streakEl.textContent = `${streak}x`;
  } else {
    streak = 0;
    streakEl.textContent = "0x";
  }

  spawnNextItem();
}

function updateTimer() {
  timeLeft--;
  timerEl.textContent = timeLeft;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    endGame();
  }
}

function endGame() {
  finalScoreEl.textContent = score;
  modal.classList.remove("hidden");
}

// Drag & Drop Handling
wasteItemEl.addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", currentItem.type);
});

bins.forEach((bin) => {
  bin.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  bin.addEventListener("drop", (e) => {
    e.preventDefault();
    const binType = bin.getAttribute("data-type");
    handleSort(binType);
  });

  // Click sorting
  bin.addEventListener("click", () => {
    const binType = bin.getAttribute("data-type");
    handleSort(binType);
  });
});

restartBtn.addEventListener("click", initGame);

// Start the game on page load
initGame();