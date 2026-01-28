// --------- GLOBAL ELEMENTS ----------
const screens = document.querySelectorAll(".screen");
const music = document.getElementById("bgMusic");
const toggle = document.getElementById("musicToggle");

// --------- SCREEN SWITCH ----------
function show(n) {
  screens.forEach(s => s.classList.remove("active"));
  screens[n].classList.add("active");
}

// --------- START BUTTON ----------
function start() {
  try {
    music.play();
  } catch (e) {}

  show(1); // go to puzzle screen
  setTimeout(initPuzzle, 50);
}

// make start() visible to HTML
window.start = start;

// --------- PUZZLE ----------
function initPuzzle() {
  const puzzle = document.getElementById("puzzle");
  const piecesContainer = document.getElementById("pieces");

  puzzle.innerHTML = "";
  piecesContainer.innerHTML = "";

  const size = 3;
  let placedCorrectly = 0;

  // Create slots
  for (let i = 0; i < size * size; i++) {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.index = i;

    slot.ondragover = e => e.preventDefault();
    slot.ondrop = e => {
  e.preventDefault();
  const pieceIndex = e.dataTransfer.getData("piece");
  const piece = document.querySelector(`.piece[data-index="${pieceIndex}"]`);

  // move any existing piece in the slot back to piecesContainer
  if (slot.firstChild) {
    piecesContainer.appendChild(slot.firstChild);
  }

  slot.appendChild(piece);

  // -----------------------------
  // recalc placedCorrectly
  // -----------------------------
  let placedCorrectly = 0;
  document.querySelectorAll(".slot").forEach(s => {
    const child = s.firstChild;
    if (child && child.dataset.index === s.dataset.index) {
      placedCorrectly++;
      child.draggable = false;
    } else if (child) {
      child.draggable = true;
    }
  });

  // trigger completion only if really complete
  if (placedCorrectly === 9) { // size*size = 3*3 = 9
    confetti({
      particleCount: 180,
      spread: 160,
      scalar: 1.2,
      origin: { y: 0.6 }
    });

    const popup = document.getElementById("puzzlePopup");
    popup.classList.add("show");

    // 💜 floating hearts
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

    // keep hearts + popup for 4s then go to slideshow
    setTimeout(() => {
      hearts.forEach(h => h.remove());
      popup.classList.remove("show");
      const screen3 = document.getElementById("screen3");
      show(2); // activate screen3

      // soft fade-in
      screen3.style.opacity = 0;
      screen3.style.transform = "scale(0.95)";
      screen3.style.transition = "opacity 0.8s ease, transform 0.8s ease";

      setTimeout(() => {
        screen3.style.opacity = 1;
        screen3.style.transform = "scale(1)";
      }, 50);

      // show first slide caption
     slideImg.src = slides[0];
     document.getElementById("slideText").textContent = captions[0];
     currentSlide = 0;

     // Show floating texts immediately
     showFloatingTexts(0);

    }, 4000);
  }
};


    puzzle.appendChild(slot);
  }

  // Create pieces
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

  // Shuffle pieces
  pieces.sort(() => Math.random() - 0.5);
  pieces.forEach(p => piecesContainer.appendChild(p));
}

// --------- MUSIC TOGGLE ----------
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
// --------- SLIDE NAVIGATION ----------
const slides = ["slides/1.jpg", "slides/2.jpg", "slides/3.jpg"];

const captions = [
  "A little moment I like 🌸",
  "This one always makes me smile ✨",
  "Had to save the best for last 💖"
];
let currentSlide = 0;

const slideImg = document.getElementById("slideImg");
function showFloatingTexts(slideIndex) {
  // Remove old floating texts
  document.querySelectorAll(".floatText").forEach(t => t.remove());

  const messages = [
    ["You make me smile 😄", "Hope your day is sweet 🍭", "XOXO 💖"],
    ["A tiny wish ✨", "Just for you 💜", "Keep smiling 🌸"],
    ["Hugs and cake 🎂", "Shining bright 🌟", "Happy vibes 💕"]
  ];

  const floatMsgs = messages[slideIndex] || [];
  const usedPositions = [];

  floatMsgs.forEach((msg, i) => {
    const t = document.createElement("div");
    t.className = "floatText";
    t.textContent = msg;

    // LEFT or RIGHT of image only, no overlap
    let left, top, attempts = 0;
    do {
      left = Math.random() < 0.5 ? 10 + Math.random() * 25 : 65 + Math.random() * 25;
      top = 70 + Math.random() * 20;
      attempts++;
    } while (usedPositions.some(p => Math.abs(p.left - left) < 15 && Math.abs(p.top - top) < 8) && attempts < 50);

    usedPositions.push({ left, top });

    t.style.left = left + "vw";
    t.style.top = top + "vh";
    t.style.opacity = 0;
    t.style.transform = "translateY(20px)";
    t.style.fontSize = "1.25rem";
    t.style.position = "fixed";

    document.body.appendChild(t);

    // Animate in with small stagger
    setTimeout(() => {
      t.style.opacity = 1;
      t.style.transform = "translateY(0)";
    }, i * 200);

    // Fade out and remove after 6s
    setTimeout(() => {
      t.style.opacity = 0;
      t.style.transform = "translateY(-50px)";
      setTimeout(() => t.remove(), 800);
    }, 6000 + i * 200);
  });
}

function showSlide(index) { 
  // wrap index
  if (index < 0) index = slides.length - 1;
  if (index >= slides.length) index = slides.length - 1;
  currentSlide = index;

  // Animate slide image
  slideImg.classList.add("slide-hide");
  setTimeout(() => {
    slideImg.src = slides[currentSlide];
    slideImg.classList.remove("slide-hide");
  }, 200);

  // Update caption
  const text = document.getElementById("slideText");
  text.textContent = captions[currentSlide];

  // Show Finish button only on last slide
  const finishBtn = document.getElementById("finishBtn");
  finishBtn.style.display =
    currentSlide === slides.length - 1 ? "inline-block" : "none";

  // -----------------------------
  // FLOATING TEXTS (ONLY FOR SLIDESHOW)
  // -----------------------------
  const screen3 = document.getElementById("screen3");
  if (screen3.classList.contains("active")) {
    // Remove old floating texts
    document.querySelectorAll(".floatText").forEach(t => t.remove());

    // Messages per slide (max 3 each)
    const messages = [
      ["You make me smile 😄", "Hope your day is sweet 🍭", "XOXO 💖"],
      ["A tiny wish ✨", "Just for you 💜", "Keep smiling 🌸"],
      ["Hugs and cake 🎂", "Shining bright 🌟", "Happy vibes 💕"]
    ];

    const floatMsgs = messages[currentSlide] || [];
    const usedPositions = [];

    floatMsgs.forEach((msg, i) => {
      const t = document.createElement("div");
      t.className = "floatText";
      t.textContent = msg;

      // LEFT or RIGHT of image only, no overlap
      let left, top, attempts = 0;
      do {
        left = Math.random() < 0.5 ? 10 + Math.random() * 25 : 65 + Math.random() * 25;
        top = 70 + Math.random() * 20;
        attempts++;
      } while (usedPositions.some(p => Math.abs(p.left - left) < 15 && Math.abs(p.top - top) < 8) && attempts < 50);

      usedPositions.push({ left, top });

      t.style.left = left + "vw";
      t.style.top = top + "vh";
      t.style.opacity = 0;
      t.style.transform = "translateY(20px)";
      t.style.fontSize = "1.25rem"; // slightly bigger
      t.style.position = "fixed";

      document.body.appendChild(t);

      // Animate in immediately with small stagger
      setTimeout(() => {
        t.style.opacity = 1;
        t.style.transform = "translateY(0)";
      }, i * 200);

      // Fade out and remove after 6s
      setTimeout(() => {
        t.style.opacity = 0;
        t.style.transform = "translateY(-50px)";
        setTimeout(() => t.remove(), 800);
      }, 6000 + i * 200);
    });
  }
}
  
  // 📝 update caption
  const text = document.getElementById("slideText");
  if (text) {
    text.textContent = captions[currentSlide];
    text.style.animation = "none";
    text.offsetHeight; // restart animation
    text.style.animation = null;
  }

  // Show "Finish" button only on last slide
  const finishBtn = document.getElementById("finishBtn");
  finishBtn.style.display =
    currentSlide === slides.length - 1 ? "inline-block" : "none";

// Show next slide
function next() {
  showSlide(currentSlide + 1);
}

// Show previous slide
function prev() {
  showSlide(currentSlide - 1);
}

// make functions accessible from HTML
window.next = next;
window.prev = prev;

function showCard() {
  const card = document.getElementById("card");
  card.style.display = "block";

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
showSlide(0);