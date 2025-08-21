gsap.registerPlugin(ScrollTrigger);
yearsScroll();

// =====================
// 1. Eyes Animation
// =====================
import "../css/style.css";
gsap.registerPlugin(ScrollTrigger);

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
