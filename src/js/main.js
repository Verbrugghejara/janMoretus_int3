// import "../css/reset.css";
import "../css/style.css";

// Eyes follow mouse within header
const header = document.querySelector("header");
const eyeLeft = document.getElementById("eye-left");
const eyeRight = document.getElementById("eye-right");
const eyes = document.getElementById("eyes");

// Set eyes container to absolute and position
// eyes.style.position = "absolute";
// eyes.style.left = "50%";
// eyes.style.top = "38%";
// eyes.style.transform = "translate(-50%, -50%)";
// eyes.style.display = "flex";
// eyes.style.gap = "2vw";
// eyeLeft.style.position = "relative";
// eyeRight.style.position = "relative";

function moveEyes(e) {
  const rect = header.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  // Bereken percentage binnen header
  const xPct = Math.max(0, Math.min(1, x / rect.width));
  const yPct = Math.max(0, Math.min(1, y / rect.height));
  // Max verschuiving in px (groter voor meer beweging)
  const maxX = 40;
  const maxY = 30;
  // Verschuif ogen
  eyeLeft.style.left = xPct * maxX + "px";
  eyeRight.style.left = xPct * maxX + "px";
  const topOffset = -10; // ogen kunnen 15px hoger bewegen
  eyeLeft.style.top = yPct * maxY + topOffset + 15 + "px";
  eyeRight.style.top = yPct * maxY + topOffset + "px";
}
header.addEventListener("mousemove", moveEyes);
header.addEventListener("mouseleave", function () {
  eyeLeft.style.left = "0px";
  eyeLeft.style.top = "15px";
  eyeRight.style.left = "0px";
  eyeRight.style.top = "0px";
});
