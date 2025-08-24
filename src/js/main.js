gsap.registerPlugin(ScrollTrigger);
import "../css/style.css";
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();

  pageHeight = document.body.scrollHeight;
});
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

yearsScroll();

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
  const fragment = document.createDocumentFragment();

  years.forEach((year, i) => {
    const layer = document.createElement("div");
    layer.className =
      "year-layer absolute flex flex-col items-center justify-center text-center opacity-0";

    // Year element
    const yearEl = document.createElement("p");
    yearEl.className =
      "title-year select-none tracking-tight leading-none text-white";
    yearEl.style.fontFamily = fonts[i % fonts.length];
    yearEl.style.fontSize = "clamp(4rem, 16vw, 16rem)";

    year
      .toString()
      .split("")
      .forEach((digit) => {
        const span = document.createElement("span");
        span.className = "digit inline-block will-change-transform opacity-0";
        span.textContent = digit;
        yearEl.appendChild(span);
      });

    // Optional subtitle
    const sub = document.createElement("p");
    sub.className = "text-year mt-6 text-xl md:text-2xl text-white/90";
    if (i === years.length - 1) {
      sub.innerHTML =
        "the year I was born, in the city of <span class='highlight'>Antwerp</span>.";
    }

    layer.appendChild(yearEl);
    layer.appendChild(sub);
    fragment.appendChild(layer);
  });

  container.appendChild(fragment);

  const layers = gsap.utils.toArray(".year-layer");

  // First layer zichtbaar maken
  gsap.set(layers[0], { autoAlpha: 1 });
  gsap.set(layers[0].querySelectorAll(".digit"), { yPercent: 0, opacity: 1 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#timeline2",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      pin: false,
    },
  });

  for (let i = 1; i < layers.length; i++) {
    const prev = layers[i - 1];
    const next = layers[i];
    const fromTop = i === layers.length - 1;

    // Animate previous layer digits out
    tl.to(
      prev.querySelectorAll(".digit"),
      {
        yPercent: -40,
        autoAlpha: 0,
        duration: 0.2,
        stagger: 0,
      },
      ">"
    );

    // Show next layer
    tl.set(next, { autoAlpha: 1 }, "<");
    tl.set(
      next.querySelectorAll(".digit"),
      {
        yPercent: fromTop ? -100 : 100,
        autoAlpha: 0,
      },
      "<"
    );

    // Animate next layer digits in
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
// Mask & Lock Scroll Animation
// =====================
const mask = document.querySelector("#maskOverlay");
const combinations = document.getElementById("combinations");
const question1 = document.getElementById("question-1");
const question2 = document.getElementById("question-2");
const question3 = document.getElementById("question-3");

mask.style.webkitMaskImage = "none";
mask.style.maskImage = "none";

ScrollTrigger.create({
  trigger: ".unlock__content",
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
    gsap.to(mask, { opacity: 0, duration: 1 });
  },
  onEnterBack: () => {
    gsap.to(mask, { opacity: 1, duration: 0.3 });
  },
});
let lockAnimationActive = false;
const lock = document.getElementById("lock");
let fadeInDone = false;

gsap.to(
  {},
  {
    scrollTrigger: {
      trigger: ".unlock__content",
      start: "-40% -40%",
      end: "bottom bottom",
      scrub: true,
      markers:true,
      onUpdate: (self) => {
        let progress = self.progress; // 0 → 1
        let size = 55 - progress * 50; // van 60vmax → 5vmax
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

lock.addEventListener("pointerdown", () => {
  if (fadeInDone) return;
  fadeInDone = true;
  stopLockAnimation();
  gsap.to(lock, {
    scale: 5,
    duration: 0.5,
    yoyo: true,
    ease: "power2.inOut",
    transformOrigin: "bottom center",
  });

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
let currentStep = 0;
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

  // Bereken een progress percentage op basis van huidige hoek
  let progress = Math.min(Math.max(currentAngle / 360, 0), 1); // normaliseer tussen 0 en 1
  updateMask(progress);
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
      ScrollTrigger.refresh();
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
      const lock1 = document.getElementById("lock-1");
      lock1.classList.remove("hidden");
      const lock2 = document.getElementById("lock-2");
      lock1.classList.remove("hidden");
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
