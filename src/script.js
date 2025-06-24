// src/utils/activateRing.js
export function activateRingOnHover() {
    const ring = document.querySelector(".ring");
    if (ring) {
      const handler = () => {
        ring.classList.add("active");
      };
      ring.addEventListener("mouseenter", handler, { once: true });
    }
  }
  