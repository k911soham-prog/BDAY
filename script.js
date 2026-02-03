// ---------- GLOBAL ----------
const screens = document.querySelectorAll(".screen");
const music = document.getElementById("bgMusic");
const toggle = document.getElementById("musicToggle");

function show(n) {
  screens.forEach(s => s.classList.remove("active"));
  screens[n].classList.add("active");
}

// ---------- START ----------
function start() {
  try { music.play(); } catch (e) {}

  document.getElementById("giftOverlay").style.display = "flex";
}
window.start = start;

// ---------- PUZZLE ----------
function initPuzzle() {
  const puzzle = document.getElementById("puzzle");
  const piecesContainer = document.getElementById("pieces");

  puzzle.innerHTML = "";
  piecesContainer.innerHTML = "";

  const size = 3;

  // slots
  for (let i = 0; i < size * size; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.index = i;

    slot.ondragover = e => e.preventDefault();
    slot.ondrop = e => {
      e.preventDefault();
      const pieceIndex = e.dataTransfer.getData("piece");
      const piece = document.querySelector(`.piece[data-index="${pieceIndex}"]`);

      if (slot.firstChild) {
        piecesContainer.appendChild(slot.firstChild);
      }
      slot.appendChild(piece);

      checkPuzzleComplete();
    };

    puzzle.appendChild(slot);
  }

  // pieces
  let pieces = [];
  for (let i = 0; i < size * size; i++) {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.draggable = true;
    piece.dataset.index = i;

    piece.style.backgroundPosition =
      `-${(i % size) * 100}px -${Math.floor(i / size) * 100}px`;

    piece.ondragstart = e => {
      e.dataTransfer.setData("piece", i);
    };

    pieces.push(piece);
  }

  pieces.sort(() => Math.random() - 0.5);
  pieces.forEach(p => {
  piecesContainer.appendChild(p);
  enableTouchDrag(p); // <-- ADD THIS
  });
}

function checkPuzzleComplete() {
  let correct = 0;
  document.querySelectorAll(".slot").forEach(slot => {
    const piece = slot.firstChild;
    if (piece && piece.dataset.index === slot.dataset.index) {
      correct++;
      piece.draggable = false;
    } else if (piece) {
      piece.draggable = true;
    }
  });

  if (correct === 9) puzzleComplete();
}

function puzzleComplete() {
  confetti({
    particleCount: 180,
    spread: 160,
    scalar: 1.2,
    origin: { y: 0.6 }
  });

  const popup = document.getElementById("puzzlePopup");
  popup.classList.add("show");

  // hearts
  const hearts = [];
  for (let i = 0; i < 18; i++) {
    const h = document.createElement("div");
    h.className = "heart";
    h.textContent = "💜";
    h.style.left = Math.random() * 90 + "vw";
    h.style.top = Math.random() * 80 + "vh";
    h.style.fontSize = 18 + Math.random() * 24 + "px";
    document.body.appendChild(h);
    hearts.push(h);
  }

  setTimeout(() => {
    hearts.forEach(h => h.remove());
    popup.classList.remove("show");

    show(3); // slideshow
    showSlide(0);
  }, 4000);
}

// ---------- MUSIC ----------
if (toggle) {
  toggle.onclick = () => {
    if (music.paused) {
      music.play();
      toggle.textContent = "🔊";
    } else {
      music.pause();
      toggle.textContent = "🔇";
    }
  };
}

// ---------- SLIDES ----------
const slides = ["1.jpg", "2.jpg", "3.jpg"];
const captions = [
  "A little moment I like 🌸",
  "This one always makes me smile ✨",
  "Had to save the best for last 💖"
];

let currentSlide = 0;
const slideImg = document.getElementById("slideImg");

function showSlide(index) {
  if (index < 0) index = 0;
  if (index >= slides.length) index = slides.length - 1;
  currentSlide = index;

  slideImg.classList.add("slide-hide");
  setTimeout(() => {
    slideImg.src = slides[currentSlide];
    slideImg.classList.remove("slide-hide");
  }, 200);

  const text = document.getElementById("slideText");
  text.textContent = captions[currentSlide];
  text.style.animation = "none";
  text.offsetHeight;
  text.style.animation = null;

  const finishBtn = document.getElementById("finishBtn");
  finishBtn.style.display =
    currentSlide === slides.length - 1 ? "inline-block" : "none";

  showFloatingTexts(currentSlide);
}

function next() {
  showSlide(currentSlide + 1);
}
function prev() {
  showSlide(currentSlide - 1);
}
window.next = next;
window.prev = prev;

// ---------- FLOATING TEXT ----------
function showFloatingTexts(slideIndex) {
  document.querySelectorAll(".floatText").forEach(t => t.remove());

  const messages = [
    ["You make me smile 😄", "Hope your day is sweet 🍭", "XOXO 💖"],
    ["A tiny wish ✨", "Just for you 💜", "Keep smiling 🌸"],
    ["Hugs and cake 🎂", "Shining bright 🌟", "Happy vibes 💕"]
  ];

  (messages[slideIndex] || []).forEach((msg, i) => {
    const t = document.createElement("div");
    t.className = "floatText";
    t.textContent = msg;

    t.style.left =
      (Math.random() < 0.5 ? 10 + Math.random() * 25 : 65 + Math.random() * 25) + "vw";
    t.style.top = 70 + Math.random() * 20 + "vh";

    document.body.appendChild(t);

    setTimeout(() => t.remove(), 6500 + i * 200);
  });
}

// ---------- FINAL CARD ----------
function showCard() {
  const card = document.getElementById("card");
  card.style.display = "block";
  music.volume = 0.6;

  confetti({
    particleCount: 220,
    spread: 180,
    startVelocity: 45,
    gravity: 0.9,
    scalar: 1.3,
    origin: { y: 0.65 }
  });
}
window.showCard = showCard;

// ---------- BACKGROUND DECOR ----------
for (let i = 0; i < 8; i++) {
  const b = document.createElement("div");
  b.className = "balloon";
  b.style.left = Math.random() * 100 + "vw";
  b.style.animationDuration = 15 + Math.random() * 10 + "s";
  b.style.background =
    `radial-gradient(circle at 30% 30%, white,
    hsl(${Math.random() * 360}, 80%, 70%))`;
  document.body.appendChild(b);
}

for (let i = 0; i < 3; i++) {
  const o = document.createElement("div");
  o.className = "orb";
  o.style.top = Math.random() * 80 + "vh";
  o.style.left = Math.random() * 80 + "vw";
  document.body.appendChild(o);
}
const giftOverlay = document.getElementById("giftOverlay");
const giftBox = document.getElementById("giftBox");

giftBox.onclick = () => {
  giftBox.classList.add("open");
  giftOverlay.classList.add("reveal");
  document.getElementById("brainImg").style.display = "block";
  setTimeout(() => {
    giftOverlay.style.display = "none";
    show(1);
    setTimeout(initPuzzle, 50);
  }, 3000);
};

/* ---------- TOUCH SUPPORT FOR PUZZLE ---------- */
function enableTouchDrag(piece) {
  let targetSlot = null;

  piece.addEventListener("touchstart", e => {
    e.preventDefault();
    piece.touchId = e.changedTouches[0].identifier;
  });

  piece.addEventListener("touchmove", e => {
    const touch = [...e.changedTouches].find(
      t => t.identifier === piece.touchId
    );
    if (!touch) return;

    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el && el.classList.contains("slot")) {
      targetSlot = el;
    }
  });

  piece.addEventListener("touchend", () => {
    if (targetSlot) {
  if (targetSlot.firstChild && targetSlot.firstChild !== piece) {
    document.getElementById("pieces").appendChild(targetSlot.firstChild);
  }
  targetSlot.appendChild(piece);
  checkPuzzleComplete();
}

    targetSlot = null;
    piece.touchId = null;
  });
}
