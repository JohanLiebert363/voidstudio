/* =====================================================
   VOID STUDIO — main.js
   Sections:
   1. Page loader
   2. Custom cursor
   3. Hero entrance
   4. Nav scroll + hamburger
   5. Scroll reveal (staggered)
   6. Parallax hero grid
   7. Magnetic buttons
   8. Work card tilt
   9. Stat counters
   10. Contact form
===================================================== */

// ─── 1. PAGE LOADER ──────────────────────────────────────
const loader = document.createElement("div");
loader.id = "void-loader";
loader.innerHTML = `<div class="loader-logo">VOID<span>.</span></div><div class="loader-bar"><div class="loader-fill"></div></div>`;
document.body.appendChild(loader);

window.addEventListener("load", () => {
  loader.querySelector(".loader-fill").style.width = "100%";
  setTimeout(() => {
    loader.classList.add("loader-out");
    setTimeout(() => {
      loader.remove();
      runHeroEntrance();
    }, 600);
  }, 800);
});

// ─── 2. CUSTOM CURSOR ────────────────────────────────────
const cursorDot  = document.createElement("div"); cursorDot.className  = "cursor-dot";
const cursorRing = document.createElement("div"); cursorRing.className = "cursor-ring";
document.body.append(cursorDot, cursorRing);

let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });

(function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorDot.style.transform  = `translate(${mx}px,${my}px)`;
  cursorRing.style.transform = `translate(${rx}px,${ry}px)`;
  requestAnimationFrame(animateCursor);
})();

// Cursor states
document.querySelectorAll("a, button, .work-card, .service-item").forEach(el => {
  el.addEventListener("mouseenter", () => cursorRing.classList.add("cursor-hover"));
  el.addEventListener("mouseleave", () => cursorRing.classList.remove("cursor-hover"));
});
document.addEventListener("mousedown", () => cursorDot.classList.add("cursor-click"));
document.addEventListener("mouseup",   () => cursorDot.classList.remove("cursor-click"));

// Hide cursor on touch devices
document.addEventListener("touchstart", () => {
  cursorDot.style.display = cursorRing.style.display = "none";
}, { once: true });

// ─── 3. HERO ENTRANCE ────────────────────────────────────
function runHeroEntrance() {
  const items = [
    document.querySelector(".hero-eyebrow"),
    document.querySelector(".hero-title"),
    document.querySelector(".hero-sub"),
    document.querySelector(".hero-actions"),
    document.querySelector(".hero-mockup-wrap"),
  ];
  items.forEach((el, i) => {
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = i < 4 ? "translateY(32px)" : "translateX(40px) scale(0.97)";
    el.style.transition = `opacity 0.7s ease ${i * 0.1 + 0.1}s, transform 0.7s ease ${i * 0.1 + 0.1}s`;
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  });
}

// ─── 4. NAV SCROLL + HAMBURGER ───────────────────────────
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
}, { passive: true });

const hamburger = document.getElementById("hamburger");
const navLinks  = document.querySelector(".nav-links");
let menuOpen = false;
hamburger.addEventListener("click", () => {
  menuOpen = !menuOpen;
  navLinks.classList.toggle("nav-open", menuOpen);
  hamburger.classList.toggle("ham-open", menuOpen);
});

// ─── 5. SCROLL REVEAL (staggered per group) ──────────────
const revealGroups = [
  { selector: ".section-header",    delay: 0   },
  { selector: ".work-card",         delay: 80  },
  { selector: ".service-item",      delay: 60  },
  { selector: ".process-step",      delay: 100 },
  { selector: ".stat",              delay: 80  },
  { selector: ".contact-left",      delay: 0   },
  { selector: ".contact-form-wrap", delay: 120 },
];

revealGroups.forEach(({ selector, delay }) => {
  const els = document.querySelectorAll(selector);
  els.forEach(el => el.classList.add("reveal"));

  const obs = new IntersectionObserver((entries) => {
    // collect all intersecting in this batch and stagger them
    const visible = entries.filter(e => e.isIntersecting);
    visible.forEach((e, i) => {
      setTimeout(() => e.target.classList.add("in"), i * delay);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  els.forEach(el => obs.observe(el));
});

// ─── 6. PARALLAX HERO GRID ───────────────────────────────
const heroBg = document.getElementById("heroBg");
window.addEventListener("scroll", () => {
  if (!heroBg) return;
  const y = window.scrollY;
  heroBg.style.transform = `translateY(${y * 0.25}px)`;
}, { passive: true });

// ─── 7. MAGNETIC BUTTONS ─────────────────────────────────
document.querySelectorAll(".btn-primary").forEach(btn => {
  btn.addEventListener("mousemove", (e) => {
    const r  = btn.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = (e.clientX - cx) * 0.25;
    const dy = (e.clientY - cy) * 0.25;
    btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.03)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});

// ─── 8. WORK CARD TILT ───────────────────────────────────
document.querySelectorAll(".work-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const r  = card.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    card.style.transition = "transform 0.05s ease";
    card.querySelector(".work-card-bg").style.opacity = "0.9";
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
    card.style.transition = "transform 0.4s ease";
    card.querySelector(".work-card-bg").style.opacity = "";
  });
});

// ─── 9. STAT COUNTERS ────────────────────────────────────
const statNums = document.querySelectorAll(".stat-num");
const statObs  = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = parseInt(el.dataset.target);
    let start    = null;
    const dur    = 1400;
    function tick(ts) {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      // ease out cubic
      const ease = 1 - Math.pow(1 - prog, 3);
      el.textContent = Math.round(ease * target);
      if (prog < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObs.unobserve(el);
  });
}, { threshold: 0.5 });
statNums.forEach(el => statObs.observe(el));

// ─── 10. CONTACT FORM ────────────────────────────────────
async function submitForm() {
  const btn     = document.getElementById("submitBtn");
  const errorEl = document.getElementById("formError");

  const name    = document.getElementById("name").value.trim();
  const email   = document.getElementById("email").value.trim();
  const company = document.getElementById("company").value.trim();
  const budget  = document.getElementById("budget").value;
  const message = document.getElementById("message").value.trim();

  errorEl.textContent = "";
  if (!name)    { shake(errorEl, "Please enter your name.");            return; }
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email))
                { shake(errorEl, "Please enter a valid email address."); return; }
  if (!message) { shake(errorEl, "Please describe your project.");      return; }

  btn.innerHTML = `<span class="btn-spinner"></span> Sending…`;
  btn.disabled  = true;

  try {
    const form = document.getElementById("contactForm");
    const body = new URLSearchParams({
      "form-name": "contact",
      name, email, company, budget, message,
    });

    const res = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (res.ok) {
      showSuccess();
    } else {
      shake(errorEl, "Something went wrong. Please try again.");
      btn.innerHTML = `Send message <span class="btn-arrow">→</span>`;
      btn.disabled  = false;
    }
  } catch {
    showSuccess(); // demo/offline fallback
  }
}

function showSuccess() {
  const form    = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  form.style.opacity    = "0";
  form.style.transform  = "scale(0.97)";
  form.style.transition = "opacity 0.3s, transform 0.3s";
  setTimeout(() => {
    form.style.display        = "none";
    success.style.display     = "flex";
    success.style.opacity     = "0";
    success.style.transform   = "scale(0.97)";
    success.style.transition  = "opacity 0.4s, transform 0.4s";
    requestAnimationFrame(() => {
      success.style.opacity   = "1";
      success.style.transform = "scale(1)";
    });
  }, 300);
}

function shake(el, msg) {
  el.textContent = msg;
  el.classList.remove("shake");
  void el.offsetWidth; // reflow
  el.classList.add("shake");
}