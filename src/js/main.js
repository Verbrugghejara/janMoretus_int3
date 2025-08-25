import "../css/style.css";
gsap.registerPlugin(ScrollTrigger);

// let pageHeight = document.body.scrollHeight;

// let lock1 = 0;
// let lock2 = 0;
yearsScroll();

document.querySelector(".lock-1").classList.add("hidden");
document.querySelector(".lock-2").classList.add("hidden");

// window.addEventListener("resize", () => {
//   document.querySelector(".lock-1").classList.remove("hidden");
//   document.querySelector(".lock-2").classList.remove("hidden");

//   ScrollTrigger.refresh();

//   pageHeight = document.body.scrollHeight;

//   if (lock1 === 0) {
//     document.querySelector(".lock-1").classList.add("hidden");
//   }
//   if (lock2 === 0) {
//     document.querySelector(".lock-2").classList.add("hidden");
//   }
// });
// =====================
// 1. Eyes Animation
// =====================

const header = document.getElementById("eyes");
const eyeLeft = document.getElementById("eye-left");
const eyeRight = document.getElementById("eye-right");

function moveEyes(e) {
  const rect = header.getBoundingClientRect();
  const xPct = (e.clientX - rect.left) / rect.width; // 0 → links, 1 → rechts
  const yPct = (e.clientY - rect.top) / rect.height; // 0 → boven, 1 → onder

  // Laat de ogen echt over de hele container bewegen
  const maxX = 2; // grotere range in %
  const maxY = 1;

  eyeLeft.style.left = 47 + (xPct - 0.3) * maxX + "%";
  eyeLeft.style.top = 24 + (yPct - 0.3) * maxY + "%";

  eyeRight.style.left = 57.5 + (xPct - 0.3) * maxX + "%";
  eyeRight.style.top = 23.5 + (yPct - 0.3) * maxY + "%";
}

// Reset ogen bij muis leave
header.addEventListener("mouseleave", function () {
  eyeLeft.style.left = "47%";
  eyeLeft.style.top = "24%";
  eyeRight.style.left = "57.5%";
  eyeRight.style.top = "23.5%";
});

header.addEventListener("mousemove", moveEyes);

// =====================
// 2. Timeline Years Animation
// =====================

function yearsScroll() {
  const years = [1543, 1558, 1570, 1583, 1585, 1589, 1590, 1610, 1543];
  const fonts = [
    "'Playfair Display', serif",
    "'Inter', sans-serif",
    "'Times New Roman', serif",
    "'Futura', sans-serif",
    "'Garamond', serif",
    "'Courier New', monospace",
    "'Didot', serif",
    "'Palatino Linotype', serif",
    "'Playfair Display', serif",
  ];

  const container = document.getElementById("year-container");
  years.forEach((year, i) => {
    const layer = document.createElement("div");
    layer.className =
      "year-layer absolute flex flex-col items-center justify-center text-center";
    layer.style.opacity = 0;

    const yearEl = document.createElement("p");
    yearEl.className =
      "title-year select-none tracking-tight leading-none text-white";
    yearEl.style.fontFamily = fonts[i % fonts.length];
    yearEl.style.fontSize = "clamp(4rem, 16vw, 16rem)";

    year
      .toString()
      .split("")
      .forEach((d) => {
        const span = document.createElement("span");
        span.className = "digit inline-block will-change-transform opacity-0";
        span.textContent = d;
        yearEl.appendChild(span);
      });

    const sub = document.createElement("p");
    sub.className = "text-year mt-6 text-xl md:text-2xl text-white/90";
    sub.innerHTML =
      i === years.length - 1
        ? "the year I was born, in the city of <span class='highlight'>Antwerp</span>."
        : "";

    layer.appendChild(yearEl);
    layer.appendChild(sub);
    container.appendChild(layer);
  });

  const layers = gsap.utils.toArray(".year-layer");

  gsap.set(layers[0], { autoAlpha: 1 });
  gsap.set(layers[0].querySelectorAll(".digit"), { yPercent: 0, opacity: 1 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#timeline",
      start: "top top",
      end: "+=" + years.length * 400,
      scrub: 0.3,
      pin: false,
    },
  });

  for (let i = 1; i < layers.length; i++) {
    const prev = layers[i - 1];
    const next = layers[i];
    const fromTop = i === layers.length - 1;

    tl.to(
      prev.querySelectorAll(".digit"),
      {
        yPercent: -40,
        autoAlpha: 0,
        stagger: 0,
        duration: 0.2,
      },
      ">"
    );

    tl.set(next, { autoAlpha: 1 }, "<");
    tl.set(
      next.querySelectorAll(".digit"),
      {
        yPercent: fromTop ? -100 : 100,
        autoAlpha: 0,
      },
      "<"
    );

    tl.to(
      next.querySelectorAll(".digit"),
      {
        yPercent: 0,
        autoAlpha: 1,
        stagger: 0.05,
        duration: 0.3,
        ease: "power2.out",
      },
      ">"
    );
  }
}

// =====================
// 2. Books
// =====================

const container = document.getElementById("book-container");
let draggedItem = null;

document.querySelectorAll(".draggable").forEach((item) => {
  item.addEventListener("dragstart", (e) => {
    draggedItem = item;

    const emptyImg = new Image();
    emptyImg.src = "";
    e.dataTransfer.setDragImage(emptyImg, 0, 0);
    item.classList.add("scale-110", "rounded-lg");
  });

  item.addEventListener("dragend", () => {
    item.classList.remove("scale-110", "rounded-lg");
    draggedItem = null;
    checkOrder();
  });
});

container.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(container, e.clientX);
  if (afterElement == null) {
    container.appendChild(draggedItem);
  } else {
    container.insertBefore(draggedItem, afterElement);
  }
});

function getDragAfterElement(container, x) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.opacity-50)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function checkOrder() {
  const items = [...container.querySelectorAll(".draggable")];
  items.forEach((item, index) => {
    const correctOrder = parseInt(item.dataset.order);
    const img = item.querySelector(".book-img");

    if (correctOrder === index + 1) {
      img.src = "./src/assets/bookY.png";
    } else {
      img.src = "./src/assets/bookV2.png";
    }
  });
}

// =====================
// Mobile drag & drop
// =====================
document.querySelectorAll(".draggable").forEach((item) => {
  let startX, startY;
  let placeholder = null;

  item.addEventListener("touchstart", (e) => {
    draggedItem = item;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    item.classList.add("scale-110", "rounded-lg");

    placeholder = document.createElement("div");
    placeholder.className = "w-[50px] h-[100px]";
    item.parentNode.insertBefore(placeholder, item.nextSibling);

    item.style.position = "absolute";
    item.style.zIndex = 1000;
    moveAt(e.touches[0].clientX, e.touches[0].clientY);
  });

  item.addEventListener("touchmove", (e) => {
    e.preventDefault();
    moveAt(e.touches[0].clientX, e.touches[0].clientY);

    const touchX = e.touches[0].clientX;
    const afterElement = getTouchAfterElement(container, touchX);
    if (afterElement == null) {
      container.appendChild(placeholder);
    } else {
      container.insertBefore(placeholder, afterElement);
    }
  });

  function moveAt(x, y) {
    item.style.left = x - item.offsetWidth / 2 + "px";
    item.style.top = y - item.offsetHeight / 2 + "px";
  }

  item.addEventListener("touchend", () => {
    placeholder.parentNode.insertBefore(item, placeholder);
    placeholder.remove();

    item.style.position = "";
    item.style.left = "";
    item.style.top = "";
    item.style.zIndex = "";
    item.classList.remove("scale-110", "rounded-lg");

    draggedItem = null;
    checkOrder();
  });
});

function getTouchAfterElement(container, x) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = x - box.left - box.width / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// =====================
// Maskoverlay & Lockwheel
// =====================

const mask = document.querySelector("#maskOverlay");
const combinations = document.getElementById("combinations");
const question1 = document.getElementById("question-1");
const question2 = document.getElementById("question-2");
const question3 = document.getElementById("question-3");

mask.style.webkitMaskImage = "none";
mask.style.maskImage = "none";

ScrollTrigger.create({
  trigger: "#chapterBlock",
  start: "-40% -40%",
  end: "bottom bottom",
  onEnter: () => {
    gsap.to(mask, { opacity: 1, duration: 0.3 });
  },
  onLeaveBack: () => {
    gsap.to(mask, { opacity: 0, duration: 0.3 });
    gsap.killTweensOf(lock);
    gsap.to(lock, {
      scale: 1,
      duration: 0,
      overwrite: true,
    });
    // lock.style.pointerEvents = "auto";
    // lock.style.cursor = "pointer";
    fadeInDone = false;
    combinations.classList.add("hidden");
    question1.classList.add("hidden");
    question2.classList.add("hidden");
    question3.classList.add("hidden");
  },
  onLeave: () => {
    gsap.to(mask, { opacity: 0, duration: 0.3 });
  },
  onEnterBack: () => {
    gsap.to(mask, { opacity: 1, duration: 0.3 });
  },
});
let lockAnimationActive = false;
const lock = document.getElementById("lock");
let fadeInDone = false;

function stopLockAnimation() {
  lockAnimationActive = false;
  gsap.killTweensOf(lock);
  gsap.to(lock, {
    x: 0,
    rotation: 0,
    duration: 0.2,
    ease: "power2.out",
  });
}
function animateLock() {
  if (!lockAnimationActive) return;
  gsap.fromTo(
    lock,
    { x: -10, rotation: -10 },
    {
      x: 10,
      rotation: 10,
      duration: 0.12,
      repeat: 7,
      transformOrigin: "top top",
      yoyo: true,
      ease: "power1.inOut",
      onComplete: () => {
        gsap.to(lock, {
          x: 0,
          rotation: 0,
          duration: 0.2,
          ease: "power2.out",
          onComplete: () => {
            if (lockAnimationActive) {
              setTimeout(animateLock, 2000);
            }
            if (fadeInDone) {
              stopLockAnimation();
            }
          },
        });
      },
    }
  );
}

gsap.to(
  {},
  {
    scrollTrigger: {
      trigger: "#chapterBlock",
      start: "-40% -40%",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        let progress = self.progress; // 0 → 1
        let size = 50 - progress * 50; // van 60vmax → 5vmax
        mask.style.webkitMaskImage = `radial-gradient(circle ${size}vmax at center, transparent 0%, black 100%)`;
        mask.style.maskImage = `radial-gradient(circle ${size}vmax at center, transparent 0%, black 100%)`;
      },
      onLeave: () => {
        lockAnimationActive = true;

        animateLock();

        // lock.addEventListener("click", stopLockAnimation, { once: true });
      },
    },
  }
);

lock.addEventListener("click", () => {
  if (fadeInDone) return;
  fadeInDone = true;
  stopLockAnimation(); // nu werkt dit ook
  gsap.to(lock, {
    scale: 5,
    duration: 0.5,
    yoyo: true,
    ease: "power2.inOut",
    transformOrigin: "bottom center",
  });

  // lock.style.pointerEvents = "none";
  // lock.style.cursor = "default";
  // Fade-in animatie met GSAP
  const unlockInstructions = document.getElementById("unlock-instructions");
  unlockInstructions.classList.add("hidden");
  [combinations, question1, question2, question3].forEach((el, i) => {
    el.classList.remove("hidden");
    if (el === combinations) el.classList.add("flex");
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, delay: i * 0.2, ease: "power2.out" }
    );
  });
});

const lockWheel = document.getElementById("lockWheel");
let isDragging = false;
let startAngle = 0;
let currentAngle = 0;

// Combinatiecode
const correctAngles = [95, 290, 45];
let currentStep = 0; // Houdt bij welk cijfer van de code we zijn

function getAngle(e, el) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const x = (e.touches ? e.touches[0].clientX : e.clientX) - cx;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - cy;

  return (Math.atan2(y, x) * 180) / Math.PI;
}

lockWheel.addEventListener("mousedown", startRotate);
lockWheel.addEventListener("touchstart", startRotate);

function startRotate(e) {
  e.preventDefault();
  isDragging = true;
  startAngle = getAngle(e, lockWheel) - currentAngle;

  document.addEventListener("mousemove", rotate);
  document.addEventListener("touchmove", rotate);
  document.addEventListener("mouseup", stopRotate);
  document.addEventListener("touchend", stopRotate);
}

function rotate(e) {
  if (!isDragging) return;
  currentAngle = getAngle(e, lockWheel) - startAngle;
  lockWheel.style.transform = `rotate(${currentAngle}deg)`;
  console.log("Current angle:", currentAngle);
}

function stopRotate() {
  isDragging = false;
  document.removeEventListener("mousemove", rotate);
  document.removeEventListener("touchmove", rotate);

  checkCodeStep();
}

function checkCodeStep() {
  const tolerance = 10;
  const normalizedAngle = ((currentAngle % 360) + 360) % 360;

  // Check of de huidige hoek overeenkomt met de volgende stap van de code
  if (Math.abs(normalizedAngle - correctAngles[currentStep]) < tolerance) {
    currentStep++;
    console.log("Correct step! CurrentStep:", currentStep);

    if (currentStep === correctAngles.length) {
      const feedback = document.getElementById("scrollingFeedback");
      feedback.classList.remove("hidden");
      feedback.classList.add("flex");
      const lockImg = document.querySelector("#lock img:first-child");
      lockImg.src = "./src/assets/lockOpen.png";

      lockWheel.classList.remove("cursor-grab");
      lockWheel.classList.add(
        "pointer-events-none",
        "cursor-default",
        "top-[72%]"
      );

      const answer3 = document.getElementById("answer-3");

      answer3.classList.remove("hidden");
      [question1, question2, question3].forEach((el, i) => {
        el.classList.add("hidden");
      });
      currentStep = 0;
      document.querySelector(".lock-1").classList.remove("hidden");
      document.querySelector(".lock-2").classList.remove("hidden");
      // lock1 = 1;
      // lock2 = 1;
      ScrollTrigger.refresh();
    } else if (currentStep == 1) {
      const answer1 = document.getElementById("answer-1");
      // verwijder class hidden van de child
      answer1.classList.remove("hidden");
    } else if (currentStep == 2) {
      const answer2 = document.getElementById("answer-2");
      // verwijder class hidden van de child
      answer2.classList.remove("hidden");
    }
  }
}

// =====================
// Signature
// =====================
let quill = document.getElementById("quill");
const ink = document.getElementById("ink-container");
const paper = document.getElementById("paper-container");
const canvas = document.getElementById("signature-canvas");
const ctx = canvas.getContext("2d");

let quillActive = false;
let inkLoaded = false;
let drawing = false;
let hasDrawn = false;
let quillOffsetX = 0;
let quillOffsetY = 0;

// =====================
// Canvas Resize
// =====================
function resizeCanvas() {
  const rect = paper.getBoundingClientRect();
  canvas.width = rect.width; // interne resolutie
  canvas.height = 160; // vaste hoogte
  canvas.style.width = rect.width + "px";
  canvas.style.height = "160px";
  canvas.style.position = "absolute";
  canvas.style.bottom = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = 30;

  // reset tekenstijl
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#2C3E50";
}

// =====================
// Veer klikken
// =====================
quill.addEventListener("click", (e) => {
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  quillActive = true;
  quill.style.opacity = "1";
  ink.style.opacity = "1";
  quill.style.pointerEvents = "none";

  quillOffsetX = 60; // pas aan op je afbeelding
  quillOffsetY = quill.offsetHeight - 5;

  e.stopPropagation();
});

// =====================
// Veer bewegen over paper
// =====================
paper.addEventListener("mousemove", (e) => {
  if (!quillActive) return;

  const rect = paper.getBoundingClientRect();
  const x = e.clientX - rect.left - quillOffsetX;
  const y = e.clientY - rect.top - quillOffsetY;

  quill.style.left = `${x}px`;
  quill.style.top = `${y}px`;

  if (drawing) {
    const canvasRect = canvas.getBoundingClientRect();
    const drawX = e.clientX - canvasRect.left;
    const drawY = e.clientY - canvasRect.top;
    ctx.lineTo(drawX, drawY);
    ctx.stroke();
  }
});

// =====================
// Inktvat klikken
// =====================
ink.addEventListener("click", (e) => {
  if (!quillActive) return;
  inkLoaded = true;

  quill.src = "./src/assets/quillInkt.png";
  ctx.strokeStyle = "#2C3E50";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  e.stopPropagation();
});

// =====================
// Canvas tekenen
// =====================
canvas.addEventListener("mousedown", (e) => {
  if (!inkLoaded || !quillActive) {
    if (quillActive && !inkLoaded) {
      const feedback = document.getElementById("inkFeedback");
      feedback.classList.remove("hidden");
      feedback.classList.add("flex");
      setTimeout(() => {
        feedback.classList.add("hidden");
        feedback.classList.remove("flex");
      }, 2000);
    }
    return;
  }

  drawing = true;
  hasDrawn = true;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  ctx.beginPath();
  ctx.moveTo(x, y);
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  ctx.lineTo(x, y);
  ctx.stroke();
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
});

canvas.addEventListener("mouseleave", () => {
  drawing = false;
  if (hasDrawn) {
    ink.style.opacity = "0.5";

    quill.remove();
    const newQuill = document.createElement("img");
    newQuill.id = "quill";
    newQuill.src = "./src/assets/quill.png";
    newQuill.className =
      "hidden lg:block absolute opacity-50 max-w-[400px] -right-[330px] 2xl:-right-[30vw] bottom-0 w-16 cursor-pointer";
    newQuill.style.pointerEvents = "none";
    paper.appendChild(newQuill);
    quill = newQuill;
    quillActive = false;
    hasDrawn = false;

    const quote = document.querySelector(".quote-1");
    if (quote) {
      quote.classList.remove("hidden");
      quote.classList.add("flex");
    }
  }
});

// =====================
// Signature mobile
// =====================
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
if (isTouchDevice) {
  canvas.height = 100; // vaste hoogte
  canvas.style.height = "100px";
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  });

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    const quote = document.querySelector(".quote-1");
    quote.classList.remove("hidden");
    quote.classList.add("flex");
  });
} else {
}
// =====================
// Drag & Drop printing house
// =====================
const allowedBooks = [
  "book-de-constantia",
  "book-bible-translation",
  "book-atlas-of-ortelius",
  "book-medicinal-dodoens",
  "book-prayer-mass",
];

const cart = document.getElementById("cart");
const shelf = document.getElementById("shelf");
const confirmBtn = document.querySelector(".button-confirm");
const resultText = confirmBtn.nextElementSibling;

// ---------- Desktop drag & drop ----------
function drag(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.id);
  ev.dataTransfer.effectAllowed = "move";
}

function allowDrop(ev) {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
}

shelf.addEventListener("dragover", allowDrop);
shelf.addEventListener("drop", (ev) => {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("text/plain");
  const book = document.getElementById(id);
  if (!book) return;
  if (shelf.querySelectorAll("[draggable='true']").length >= 5) {
    alert("Je kunt maar 5 boeken in de shelf zetten!");
    return;
  }
  shelf.appendChild(book);
});

cart.addEventListener("dragover", allowDrop);
cart.addEventListener("drop", (ev) => {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("text/plain");
  const book = document.getElementById(id);
  if (!book) return;
  cart.appendChild(book);
});

// ---------- Mobile tap only ----------
document.querySelectorAll("[draggable='true']").forEach((book) => {
  // Desktop drag
  book.addEventListener("dragstart", drag);

  // Mobile tap (touch)
  book.addEventListener("touchend", () => {
    // Geen preventDefault op touchend
    if (book.parentElement === cart) {
      if (shelf.querySelectorAll("[draggable='true']").length >= 5) {
        alert("Je kunt maar 5 boeken in de shelf zetten!");
        return;
      }
      shelf.appendChild(book);
    } else if (book.parentElement === shelf) {
      cart.appendChild(book);
    }
  });
});

// ---------- Confirm button ----------
confirmBtn.addEventListener("click", () => {
  const booksOnShelf = shelf.querySelectorAll("[draggable='true']");

  if (booksOnShelf.length < 5) {
    alert("You must place 5 books on the shelf before confirming!");
    return;
  }

  let correct = 0;

  booksOnShelf.forEach((book) => {
    if (allowedBooks.includes(book.id)) correct++;
  });

  resultText.textContent = `${correct} of ${allowedBooks.length} correct`;
});

// =====================
// Typing will
// =====================
const segments = Array.from(document.querySelectorAll(".typing"));

segments.forEach((span) => {
  const text = span.dataset.text || "";
  span.classList.add("relative", "inline-block", "cursor-text", "font-bold");

  span.innerHTML = `
  <span class="ghost text-black/20 font-bold">${text}</span>
  <span class="typed text-black outline-none bg-transparent font-bold min-w-[1ch]" 
    contenteditable="true" spellcheck="false"></span>
`;

  const typedEl = span.querySelector(".typed");

  span.addEventListener("click", () => setActive(segments.indexOf(span)));
  typedEl.addEventListener("focus", () => setActive(segments.indexOf(span)));
  typedEl.addEventListener("beforeinput", (e) =>
    handleMobileInput(e, typedEl, span)
  );
});

let current = null;

function setActive(i) {
  current = i;
  segments.forEach((s, idx) => {
    if (idx === i) {
      s.classList.add("active");
    } else {
      s.classList.remove("active");
    }
  });
  if (current !== null) {
    const typedEl = segments[current].querySelector(".typed");
    typedEl.focus({ preventScroll: true });
  }
}
function updateCursor(typedEl, cursorEl) {
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(typedEl);
  range.collapse(false); // cursor aan het einde
  const rect = range.getBoundingClientRect();
  const parentRect = typedEl.getBoundingClientRect();

  cursorEl.style.left = rect.right - parentRect.left + "px";
  cursorEl.style.top = rect.top - parentRect.top + "px";
  cursorEl.style.height = rect.height + "px";
}
function handleMobileInput(e, typedEl, span) {
  const targetText = span.dataset.text || "";
  const typed = typedEl.textContent;
  const inputChar = e.data;
  if (!inputChar) return;

  const nextChar = targetText[typed.length];
  if (!nextChar) return;

  const isMatch = inputChar === nextChar;

  if (!isMatch) {
    e.preventDefault();
    span.classList.add("error");
    setTimeout(() => span.classList.remove("error"), 200);
    return;
  }

  setTimeout(() => checkSegmentComplete(typedEl, span), 0);
}

function checkSegmentComplete(typedEl, span) {
  const targetText = span.dataset.text || "";
  if (typedEl.textContent.length === targetText.length) {
    span.classList.remove("active");

    const allDone = segments.every(
      (s) => s.querySelector(".typed").textContent === s.dataset.text
    );

    if (allDone) {
      typedEl.blur();
      const quote2 = document.querySelector(".quote-2");
      if (quote2)
        quote2.classList.add("opacity-100", "transition", "duration-500");
    } else {
      const nextIndex = segments.findIndex(
        (s) => s.querySelector(".typed").textContent !== s.dataset.text
      );
      if (nextIndex !== -1) setActive(nextIndex);
    }
  }
}
typedEl.addEventListener("input", () => {
  const cursorEl = typedEl.parentElement.querySelector(".custom-cursor");
  updateCursor(typedEl, cursorEl);
});
document.addEventListener("keydown", (e) => {
  if (current === null) return;
  const span = segments[current];
  const typedEl = span.querySelector(".typed");

  if (["Shift", "Alt", "Control", "Meta"].includes(e.key)) return;

  if (e.key === "Backspace") {
    typedEl.textContent = typedEl.textContent.slice(0, -1);
    e.preventDefault();
    return;
  }

  const targetText = span.dataset.text;
  const nextChar = targetText[typedEl.textContent.length];
  if (!nextChar) return;

  const isMatch = e.key === nextChar;

  if (isMatch) {
    typedEl.textContent = typedEl.textContent + nextChar;
    e.preventDefault();
    checkSegmentComplete(typedEl, span);
  } else {
    span.classList.add("error");
    setTimeout(() => span.classList.remove("error"), 200);
  }
});
