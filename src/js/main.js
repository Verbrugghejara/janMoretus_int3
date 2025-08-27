import "../css/style.css";
gsap.registerPlugin(ScrollTrigger);

let pageHeight = document.body.scrollHeight;
let lock1 = 0;
let lock2 = 0;
document.getElementById("menu-btn").addEventListener("click", () => {
  document.getElementById("mobile-menu").classList.toggle("hidden");
});

document.querySelector(".locked").classList.add("hidden");
document.querySelector(".footer").classList.add("hidden");

window.addEventListener("resize", () => {
  document.querySelector(".locked").classList.remove("hidden");
  document.querySelector(".footer").classList.remove("hidden");

  ScrollTrigger.refresh();

  pageHeight = document.body.scrollHeight;

  if (lock1 === 0) {
    document.querySelector(".locked").classList.add("hidden");
  }
  if (lock2 === 0) {
    document.querySelector(".footer").classList.add("hidden");
  }
});

// =====================
// Navigation animation
// =====================
function addSmoothScroll(selector) {
  document.querySelectorAll(selector).forEach((link) => {
    function handler(e) {
      e.preventDefault();
      const targetId = link.getAttribute("href").replace("#", "");
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        target.classList.add("section-animate");
        setTimeout(() => target.classList.remove("section-animate"), 1000);
      }
    }
    link.addEventListener("click", handler);
    link.addEventListener("touchstart", handler);
  });
}
if (window.innerWidth > 1024) {
  addSmoothScroll('header a[href^="#"]');
  addSmoothScroll('footer a[href^="#"]');
}

let lastScrollTop = 0;
const navbar = document.querySelector("nav");

setInterval(() => {
  if (window.innerWidth < 1024) {
    navbar.style.transform = "translateY(0)";
    lastScrollTop = document.body.scrollTop;
    return;
  }

  const scrollTop = document.body.scrollTop;

  if (scrollTop > lastScrollTop) {
    navbar.style.transform = "translateY(-100%)";
  } else if (scrollTop < lastScrollTop) {
    navbar.style.transform = "translateY(0)";
  }

  lastScrollTop = scrollTop;
}, 50);
// =====================
// 1. Eyes Animation
// =====================

const header = document.getElementById("eyes");
const eyeLeft = document.getElementById("eye-left");
const eyeRight = document.getElementById("eye-right");

const moveEyes = (e) => {
  const rect = header.getBoundingClientRect();
  const xPct = (e.clientX - rect.left) / rect.width;
  const yPct = (e.clientY - rect.top) / rect.height;

  const maxX = 2;
  const maxY = 1;

  eyeLeft.style.left = 47 + (xPct - 0.3) * maxX + "%";
  eyeLeft.style.top = 24 + (yPct - 0.3) * maxY + "%";

  eyeRight.style.left = 57.5 + (xPct - 0.3) * maxX + "%";
  eyeRight.style.top = 23.5 + (yPct - 0.3) * maxY + "%";
};

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

const yearsScroll = () => {
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
      "year-layer absolute flex flex-col items-center justify-center text-center gap-6";
    layer.style.opacity = 0;

    const yearEl = document.createElement("p");
    yearEl.className = "title-year select-none";
    yearEl.style.fontFamily = fonts[i % fonts.length];

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
    sub.className = "mt-6 text-xl md:text-2xl text-alphaBlack";
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
};

// =====================
// 2. Books
// =====================

const container = document.getElementById("book-container");
let draggedItem = null;

const initDragAndDrop = () => {
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
};
container.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(container, e.clientX);
  if (afterElement == null) {
    container.appendChild(draggedItem);
  } else {
    container.insertBefore(draggedItem, afterElement);
  }
});

const getDragAfterElement = (container, x) => {
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
};

const checkOrder = () => {
  const items = Array.from(container.querySelectorAll(".draggable"));

  items.forEach((item) => {
    const index = Array.from(container.children).indexOf(item);
    const correctOrder = parseInt(item.dataset.order, 10);

    const defaultImg = item.querySelector(".book-default");
    const correctImg = item.querySelector(".book-correct");

    if (!defaultImg || !correctImg) {
      console.warn("❌ img niet gevonden in item:", item);
      return;
    }

    const isCorrect = correctOrder === index + 1;

    defaultImg.classList.toggle("hidden", isCorrect);
    correctImg.classList.toggle("hidden", !isCorrect);

    console.log(
      `Boek ${correctOrder}: huidige index=${index + 1}, correct=${isCorrect}`
    );
  });
};

// =====================
// Mobile drag & drop
// =====================
const initMobileDragAndDrop = () => {
  document.querySelectorAll(".draggable").forEach((item) => {
    let startX, startY;
    let placeholder = null;

    item.addEventListener(
      "touchstart",
      (e) => {
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
      },
      { passive: false }
    );

    item.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault();
        moveAt(e.touches[0].clientX, e.touches[0].clientY);

        const touchX = e.touches[0].clientX;
        const afterElement = getTouchAfterElement(container, touchX);
        if (afterElement == null) {
          container.appendChild(placeholder);
        } else {
          container.insertBefore(placeholder, afterElement);
        }
      },
      { passive: false }
    );

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
};
const getTouchAfterElement = (container, x) => {
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
};

// =====================
// Maskoverlay
// =====================

const unlockInstructions = document.getElementById("unlock-instructions");
const mask = document.querySelector("#maskOverlay");
const combinations = document.getElementById("combinations");
const question1 = document.querySelector(".question-1");
const question2 = document.querySelector(".question-2");
const question3 = document.querySelector(".question-3");
const questions = document.querySelector(".questions");

mask.style.webkitMaskImage = "none";
mask.style.maskImage = "none";
let lockOpen = false;
let lockAnimationActive = false;
const lock = document.getElementById("lock");
let fadeInDone = false;

const scrollTriggerMaskOverlay = () => {
  ScrollTrigger.create({
    trigger: "#chapterBlock",
    start: "-35% -35%",
    end: "bottom bottom",
    onEnter: () => {
      gsap.to(mask, { opacity: 1, duration: 0.3 });
    },
    onLeaveBack: () => {
      gsap.to(mask, { opacity: 0, duration: 0.3 });
      if (!lockOpen) {
        combinations.classList.add("hidden");
        unlockInstructions.classList.remove("hidden");
        gsap.killTweensOf(lock);
        gsap.to(lock, {
          scale: 1,
          duration: 0,
          overwrite: true,
        });
      }
      fadeInDone = false;
      question1.classList.add("hidden");
      question2.classList.add("hidden");
      question3.classList.add("hidden");
      questions.classList.add("hidden");
    },
    onLeave: () => {
      gsap.to(mask, { opacity: 0, duration: 0.3 });
    },
    onEnterBack: () => {
      gsap.to(mask, { opacity: 1, duration: 0.3 });
    },
  });

  gsap.to(
    {},
    {
      scrollTrigger: {
        trigger: "#chapterBlock",
        start: "-35% -35%",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          let progress = self.progress;
          let size = 50 - progress * 50;
          mask.style.webkitMaskImage = `radial-gradient(circle ${size}vmax at center, transparent 0%, black 100%)`;
          mask.style.maskImage = `radial-gradient(circle ${size}vmax at center, transparent 0%, black 100%)`;
        },
        onLeave: () => {
          lockAnimationActive = true;
          if (!fadeInDone && !lockOpen) {
            animateLock();
          }
        },
      },
    }
  );
};
const stopLockAnimation = () => {
  lockAnimationActive = false;
  gsap.killTweensOf(lock);
  gsap.to(lock, {
    x: 0,
    rotation: 0,
    duration: 0.2,
    ease: "power2.out",
  });
};
const animateLock = () => {
  if (!lockAnimationActive) return;
  gsap.fromTo(
    lock,
    { rotation: -10 },
    {
      rotation: 10,
      duration: 0.5,
      repeat: 10,
      transformOrigin: "top",
      yoyo: true,
      ease: "power1.inOut",
      onComplete: () => {
        gsap.to(lock, {
          rotation: 0,
          duration: 0.5,
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
};

// =====================
// Lockwheel
// =====================
const lockWheel = document.getElementById("lockWheel");
let isDragging = false;
let startAngle = 0;
let currentAngle = 0;
const correctAngles = [95, 290, 45];
let currentStep = 0;

lock.addEventListener("click", () => {
  if (fadeInDone) return;
  fadeInDone = true;
  stopLockAnimation();
  gsap.to(lock, {
    scale: 4,
    duration: 0.5,
    yoyo: true,
    ease: "power2.inOut",
    transformOrigin: "bottom center",
  });

  unlockInstructions.classList.add("hidden");
  [combinations, questions, question1, question2, question3].forEach(
    (el, i) => {
      el.classList.remove("hidden");
      if (el === combinations) el.classList.add("flex");
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, delay: i * 0.2, ease: "power2.out" }
      );
    }
  );
});

const getAngle = (e, el) => {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const x = (e.touches ? e.touches[0].clientX : e.clientX) - cx;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - cy;

  return (Math.atan2(y, x) * 180) / Math.PI;
};

const startRotate = (e) => {
  e.preventDefault();
  isDragging = true;
  startAngle = getAngle(e, lockWheel) - currentAngle;

  document.addEventListener("mousemove", rotate);
  document.addEventListener("touchmove", rotate);
  document.addEventListener("mouseup", stopRotate);
  document.addEventListener("touchend", stopRotate);
};

const rotate = (e) => {
  if (!isDragging) return;
  currentAngle = getAngle(e, lockWheel) - startAngle;
  lockWheel.style.transform = `rotate(${currentAngle}deg)`;
};

const stopRotate = () => {
  isDragging = false;
  document.removeEventListener("mousemove", rotate);
  document.removeEventListener("touchmove", rotate);

  checkCodeStep();
};
lockWheel.addEventListener("mousedown", startRotate);
lockWheel.addEventListener("touchstart", startRotate, { passive: false });

const disabledNav = document.querySelectorAll(".disabled");

const checkCodeStep = () => {
  const tolerance = 10;
  const normalizedAngle = ((currentAngle % 360) + 360) % 360;

  if (Math.abs(normalizedAngle - correctAngles[currentStep]) < tolerance) {
    currentStep++;
    if (currentStep === correctAngles.length) {
      const feedback = document.getElementById("scrollingFeedback");
      feedback.classList.remove("hidden");
      feedback.classList.add("flex");
      const lockClosed = document.querySelector("#lock .lock-closed");
      const lockOpenImg = document.querySelector("#lock .lock-open");
      lockClosed.classList.add("hidden");
      lockOpenImg.classList.remove("hidden");

      lockWheel.classList.remove("cursor-grab");
      lockWheel.classList.add(
        "pointer-events-none",
        "cursor-default",
        "top-[72%]"
      );

      disabledNav.forEach((nav) => {
        nav.classList.remove("disabled");
        nav.classList.add("hover:text-alphaYellow");
      });

      const answer3 = document.getElementById("answer-3");

      answer3.classList.remove("hidden");
      questions.classList.add("hidden");

      question1.classList.add("hidden");
      question2.classList.add("hidden");
      question3.classList.add("hidden");
      currentStep = 0;
      document.querySelector(".locked").classList.remove("hidden");
      document.querySelector(".footer").classList.remove("hidden");
      lock1 = 1;
      lock2 = 1;
      lockOpen = true;
      lock.style.pointerEvents = "none";
      ScrollTrigger.refresh();
    } else if (currentStep == 1) {
      const answer1 = document.getElementById("answer-1");
      answer1.classList.remove("hidden");
    } else if (currentStep == 2) {
      const answer2 = document.getElementById("answer-2");
      answer2.classList.remove("hidden");
    }
  }
};

// =====================
// Questions for door
// =====================

const closeQuestions = () => {
  document.querySelector(".questions-close").addEventListener("click", () => {
    document.getElementById("question-1").classList.add("hidden");
    document.getElementById("question-2").classList.add("hidden");
    document.getElementById("question-3").classList.add("hidden");
    document.querySelector(".questions-close").classList.add("hidden");
    document.querySelector(".questions-info").classList.remove("hidden");
    questions.classList.add("left-0");
    questions.classList.add("top-12");
    questions.classList.add("h-12");
    questions.classList.add("w-12");
    questions.classList.remove("py-3");
    questions.classList.remove("px-6");
  });
};

const openQuestions = () => {
  document.querySelector(".questions-info").addEventListener("click", () => {
    document.getElementById("question-1").classList.remove("hidden");
    document.getElementById("question-2").classList.remove("hidden");
    document.getElementById("question-3").classList.remove("hidden");
    document.querySelector(".questions-close").classList.remove("hidden");
    document.querySelector(".questions-info").classList.add("hidden");
    questions.classList.remove("left-0");
    questions.classList.remove("top-12");
    questions.classList.remove("h-12");
    questions.classList.remove("w-12");
    questions.classList.add("py-3");
    questions.classList.add("px-6");
  });
};

// =====================
// Signature
// =====================
const ink = document.getElementById("ink-container");
const paper = document.getElementById("paper-container");
const canvas = document.getElementById("signature-canvas");
const ctx = canvas.getContext("2d");
const quillEmpty = document.getElementById("quillEmpty");
const quillInkt = document.getElementById("quillInkt");

let quillActive = false;
let inkLoaded = false;
let drawing = false;
let hasDrawn = false;
let quillOffsetX = 0;
let quillOffsetY = 0;

const resizeCanvas = () => {
  const rect = paper.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = 200;
  canvas.style.width = rect.width + "px";
  canvas.style.height = "200px";
  canvas.style.position = "absolute";
  canvas.style.bottom = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = 30;

  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#2C3E50";
};
const getActiveQuill = () => {
  return quillInkt.classList.contains("hidden") ? quillEmpty : quillInkt;
};

paper.addEventListener("mousemove", (e) => {
  if (!quillActive) return;

  const activeQuill = getActiveQuill();

  const rect = paper.getBoundingClientRect();
  const x = e.clientX - rect.left - quillOffsetX;
  const y = e.clientY - rect.top - quillOffsetY;

  activeQuill.style.left = `${x}px`;
  activeQuill.style.top = `${y}px`;

  if (drawing) {
    const canvasRect = canvas.getBoundingClientRect();
    const drawX = e.clientX - canvasRect.left;
    const drawY = e.clientY - canvasRect.top;
    ctx.lineTo(drawX, drawY);
    ctx.stroke();
  }
});

quillEmpty.addEventListener("click", (e) => {
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  quillActive = true;
  quillEmpty.style.opacity = "1";
  ink.style.opacity = "1";
  quillOffsetX = 60;
  quillOffsetY = quillEmpty.offsetHeight - 5;
  quillEmpty.style.pointerEvents = "none";
  e.stopPropagation();
});

ink.addEventListener("click", (e) => {
  if (!quillActive) return;
  inkLoaded = true;

  quillEmpty.classList.add("hidden");
  quillInkt.classList.remove("hidden");

  const rect = paper.getBoundingClientRect();
  const x = e.clientX - rect.left - quillOffsetX;
  const y = e.clientY - rect.top - quillOffsetY;
  quillInkt.style.left = `${x}px`;
  quillInkt.style.top = `${y}px`;

  quillOffsetY = quillInkt.offsetHeight - 5;

  e.stopPropagation();
});

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

    quillInkt.classList.add("hidden");

    quillEmpty.classList.remove("hidden");
    quillEmpty.style.opacity = "0.5";
    quillEmpty.style.maxWidth = "400px";
    quillEmpty.style.right = "-400px";
    quillEmpty.style.bottom = "0";
    quillEmpty.style.left = "";
    quillEmpty.style.top = "";

    if (window.innerWidth >= 1280) {
      quillEmpty.style.right = "-30vw";
    }
    if (window.innerWidth >= 1536) {
      quillEmpty.style.right = "-30vw";
    }

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
  canvas.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      ctx.beginPath();
      ctx.moveTo(x, y);
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
    },
    { passive: false }
  );

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

const drag = (ev) => {
  ev.dataTransfer.setData("text/plain", ev.target.id);
  ev.dataTransfer.effectAllowed = "move";
};

const allowDrop = (ev) => {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
};

shelf.addEventListener("dragover", allowDrop);
shelf.addEventListener("drop", (ev) => {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("text/plain");
  const book = document.getElementById(id);
  if (!book) return;
  if (shelf.querySelectorAll("[draggable='true']").length >= 5) {
    alert("You can only place 5 books on the shelf!");
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

// =====================
// Drag & Drop printing house Mobile
// =====================

const makeDraggablePrintingHouse = (book) => {
  book.addEventListener("dragstart", drag);

  book.addEventListener("touchend", () => {
    if (book.parentElement === cart) {
      if (shelf.querySelectorAll("[draggable='true']").length >= 5) {
        alert("You can only place 5 books on the shelf!");
        return;
      }
      shelf.appendChild(book);
    } else if (book.parentElement === shelf) {
      cart.appendChild(book);
    }
  });
};
document.querySelectorAll("[draggable='true']").forEach((book) => {
  makeDraggablePrintingHouse(book);
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

segments.forEach((span, idx) => {
  const text = span.dataset.text || "";
  span.classList.add("relative", "inline-block", "cursor-text", "font-bold");

  span.innerHTML = `
    <span class="ghost text-black/20 font-bold">${text}</span>
    <span class="typed text-black outline-none bg-transparent font-bold min-w-[1ch]"
      contenteditable="true" spellcheck="false"></span>
    <span class="custom-cursor pointer-events-none absolute w-[2px] bg-black"></span>
  `;

  const typedEl = span.querySelector(".typed");
  const cursorEl = span.querySelector(".custom-cursor");

  typedEl.style.whiteSpace = "pre-wrap";
  typedEl.style.minHeight = "1em";

  span.addEventListener("click", () => setActive(idx));
  typedEl.addEventListener("focus", () => setActive(idx));

  typedEl.addEventListener("input", () => {
    positionCursor(typedEl, cursorEl);
    const targetText = text;
    const typedText = typedEl.textContent;
    const correctSoFar = targetText.startsWith(typedText);

    if (!correctSoFar && typedText.length > 0) {
      span.classList.add("error");
      setTimeout(() => span.classList.remove("error"), 200);
      // Verwijder de laatste foutieve letter
      typedEl.textContent = typedText.slice(0, -1);
      placeCaretAtEnd(typedEl);
      positionCursor(typedEl, cursorEl);
    }
    checkSegmentComplete(typedEl, span);
  });
});

let current = null;

const setActive = (i) => {
  segments.forEach((s, idx) => {
    const cursorEl = s.querySelector(".custom-cursor");
    if (cursorEl) cursorEl.style.display = "none";
  });

  current = i;
  segments.forEach((s, idx) => s.classList.toggle("active", idx === i));

  if (current !== null) {
    const typedEl = segments[current].querySelector(".typed");
    const cursorEl = segments[current].querySelector(".custom-cursor");
    typedEl.focus({ preventScroll: true });
    placeCaretAtEnd(typedEl);
    cursorEl.style.display = "block";
    positionCursor(typedEl, cursorEl);
  }
};

const placeCaretAtEnd = (el) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};

const positionCursor = (typedEl, cursorEl) => {
  if (!cursorEl) return;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;

  const range = sel.getRangeAt(0).cloneRange();
  range.collapse(true);

  const marker = document.createElement("span");
  marker.textContent = "\u200b";
  range.insertNode(marker);

  const markerRect = marker.getBoundingClientRect();
  const parentRect = typedEl.getBoundingClientRect();

  const left = markerRect.left - parentRect.left;
  const top = markerRect.top - parentRect.top;
  const height = markerRect.height || parentRect.height;

  cursorEl.style.left = left + "px";
  cursorEl.style.top = top + "px";
  cursorEl.style.height = height + "px";

  range.setStartAfter(marker);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  marker.remove();
};

const checkSegmentComplete = (typedEl, span) => {
  const targetText = span.dataset.text || "";
  if (typedEl.textContent.length === targetText.length) {
    span.classList.remove("active");

    const allDone = segments.every(
      (s) => s.querySelector(".typed").textContent === s.dataset.text
    );

    if (allDone) {
      typedEl.blur();
      segments.forEach((s) => {
        const cursorEl = s.querySelector(".custom-cursor");
        if (cursorEl) cursorEl.style.display = "none";
      });

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
};

document.addEventListener("keydown", (e) => {
  if (current === null) return;
  const span = segments[current];
  const typedEl = span.querySelector(".typed");
  const cursorEl = span.querySelector(".custom-cursor");

  if (["Shift", "Alt", "Control", "Meta"].includes(e.key)) return;

  if (!span.contains(document.activeElement)) typedEl.focus();

  if (e.key === "Backspace") {
    e.preventDefault();
    typedEl.textContent = typedEl.textContent.slice(0, -1);
    placeCaretAtEnd(typedEl);
    positionCursor(typedEl, cursorEl);
    return;
  }

  const targetText = span.dataset.text || "";
  const nextChar = targetText[typedEl.textContent.length];
  if (!nextChar) return;

  if (e.key.length === 1) {
    e.preventDefault();
    if (e.key === nextChar) {
      typedEl.textContent += nextChar;
      placeCaretAtEnd(typedEl);
      positionCursor(typedEl, cursorEl);
      checkSegmentComplete(typedEl, span);
    } else {
      span.classList.add("error");
      setTimeout(() => span.classList.remove("error"), 200);
    }
  }
});

const init = () => {
  yearsScroll();
  initMobileDragAndDrop();
  initDragAndDrop();
  scrollTriggerMaskOverlay();
  closeQuestions();
  openQuestions();
};
init();
