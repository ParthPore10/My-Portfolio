const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const forceScrollTop = () => {
  window.scrollTo(0, 0);
  requestAnimationFrame(() => window.scrollTo(0, 0));
};

window.addEventListener("DOMContentLoaded", forceScrollTop);
window.addEventListener("load", forceScrollTop);
window.addEventListener("pageshow", forceScrollTop);

const themeToggleBtn = document.getElementById("theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let savedTheme = null;
try {
  savedTheme = localStorage.getItem("theme");
} catch (error) {
  savedTheme = null;
}
const startTheme = savedTheme || (prefersDark ? "dark" : "light");

document.body.setAttribute("data-theme", startTheme);

const applyThemeButtonLabel = () => {
  if (!themeToggleBtn) return;
  const activeTheme = document.body.getAttribute("data-theme");
  themeToggleBtn.setAttribute("data-theme-state", activeTheme);
  themeToggleBtn.setAttribute(
    "aria-label",
    activeTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );
};

applyThemeButtonLabel();

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
    } catch (error) {
      // Ignore storage errors in restricted browser modes.
    }
    applyThemeButtonLabel();
  });
}

const revealEls = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      } else {
        entry.target.classList.remove("show");
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el) => observer.observe(el));

const experienceSection = document.getElementById("experience");
const researchSection = document.getElementById("research");
const researchTitleEl = document.getElementById("research-title");
const timelineEl = document.getElementById("exp-timeline");
const workTitleEl = document.getElementById("work-title");
let timelineDelayTimer = null;

if (researchSection && researchTitleEl) {
  const researchObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          researchTitleEl.classList.remove("pull");
          void researchTitleEl.offsetWidth;
          researchTitleEl.classList.add("pull");
        } else {
          researchTitleEl.classList.remove("pull");
        }
      });
    },
    { threshold: 0.35 }
  );
  researchObserver.observe(researchSection);
}

if (experienceSection && timelineEl && workTitleEl) {
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          workTitleEl.classList.remove("pull");
          timelineEl.classList.remove("timeline-show");
          if (timelineDelayTimer) clearTimeout(timelineDelayTimer);

          // Restart title animation first, then reveal timeline.
          void workTitleEl.offsetWidth;
          workTitleEl.classList.add("pull");
          timelineDelayTimer = setTimeout(() => {
            timelineEl.classList.add("timeline-show");
          }, 680);
        } else {
          if (timelineDelayTimer) clearTimeout(timelineDelayTimer);
          workTitleEl.classList.remove("pull");
          timelineEl.classList.remove("timeline-show");
        }
      });
    },
    { threshold: 0.3 }
  );
  timelineObserver.observe(experienceSection);
}

const skillsetTrigger = document.getElementById("skillset-trigger");
const skillPopupBackdrop = document.getElementById("skill-popup-backdrop");
const skillPopupClose = document.getElementById("skill-popup-close");
const expPopupBackdrop = document.getElementById("exp-popup-backdrop");
const expPopupClose = document.getElementById("exp-popup-close");
const expPopupTitle = document.getElementById("exp-popup-title");
const expPopupPoints = document.getElementById("exp-popup-points");
const expMoreBtns = document.querySelectorAll(".exp-more-btn");

const syncModalState = () => {
  const hasOpenModal =
    (skillPopupBackdrop && skillPopupBackdrop.classList.contains("open")) ||
    (expPopupBackdrop && expPopupBackdrop.classList.contains("open"));
  document.body.classList.toggle("modal-open", hasOpenModal);
};

const closeSkillPopup = () => {
  if (!skillPopupBackdrop) return;
  skillPopupBackdrop.classList.remove("open");
  syncModalState();
};

if (skillsetTrigger && skillPopupBackdrop) {
  skillsetTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    skillPopupBackdrop.classList.add("open");
    syncModalState();
  });
}

if (skillPopupClose) {
  skillPopupClose.addEventListener("click", closeSkillPopup);
}

if (skillPopupBackdrop) {
  skillPopupBackdrop.addEventListener("click", (event) => {
    if (event.target === skillPopupBackdrop) closeSkillPopup();
  });
}

const closeExpPopup = () => {
  if (!expPopupBackdrop) return;
  expPopupBackdrop.classList.remove("open");
  syncModalState();
};


if (expMoreBtns.length && expPopupBackdrop && expPopupTitle && expPopupPoints) {
  const escapeHtml = (value) =>
    value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const formatExpPoint = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return "";
    const escaped = escapeHtml(trimmed);
    return `<li><span class="exp-bullet-dot"></span><span class="exp-bullet-text">${escaped}</span></li>`;
  };

  expMoreBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-exp-title") || "Role Details";
      const points = (btn.getAttribute("data-exp-points") || "")
        .split("||")
        .map((item) => item.trim())
        .filter(Boolean);

      expPopupTitle.textContent = title;
      expPopupPoints.innerHTML = points.map(formatExpPoint).join("");
      expPopupPoints.querySelectorAll("li").forEach((item, index) => {
        item.style.setProperty("--delay", `${index * 90}ms`);
      });
      expPopupBackdrop.classList.add("open");
      syncModalState();
    });
  });
}

if (expPopupClose) {
  expPopupClose.addEventListener("click", closeExpPopup);
}

if (expPopupBackdrop) {
  expPopupBackdrop.addEventListener("click", (event) => {
    if (event.target === expPopupBackdrop) closeExpPopup();
  });
}



window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSkillPopup();
    closeExpPopup();
  }
});

const projectGroups = document.querySelectorAll(".project-group");
if (projectGroups.length) {
  projectGroups.forEach((group) => {
    const trigger = group.querySelector(".project-group-head");
    if (!trigger) return;
    trigger.addEventListener("click", () => {
      projectGroups.forEach((other) => {
        if (other !== group) {
          other.classList.remove("is-open");
          const otherTrigger = other.querySelector(".project-group-head");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
        }
      });
      const isOpen = group.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });
}

const mlCards = document.querySelector("#project-cards-ml");
const bravoCard = mlCards
  ? Array.from(mlCards.querySelectorAll(".project-card")).find((card) => card.querySelector("h4")?.textContent.includes("BravoBOT"))
  : null;
if (mlCards && bravoCard) {
  mlCards.prepend(bravoCard);
  mlCards.querySelectorAll(".project-card").forEach((card) => card.classList.remove("featured"));
  bravoCard.classList.add("featured");
}

const visualTypes = ["rag", "calibration", "markets", "cache", "memory", "chess", "cardiac", "motion", "audio"];
document.querySelectorAll(".project-card").forEach((card, index) => {
  if (card.querySelector(".project-visual")) return;
  const visualType = visualTypes[index] || "signal";
  const visual = document.createElement("div");
  visual.className = `project-visual visual-${visualType}`;
  visual.setAttribute("aria-hidden", "true");
  visual.innerHTML = `
    <span class="visual-kicker">${String(index + 1).padStart(2, "0")} / CASE STUDY</span>
    <div class="visual-art">
      <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
    </div>
    <span class="visual-caption">PARTH PORE — SELECTED WORK</span>
  `;
  if (visualType === "rag") {
    visual.querySelector(".visual-art").innerHTML = `
      <svg class="rag-machine-svg" viewBox="0 0 800 520" role="presentation">
        <g class="rag-docs">
          <path d="M350 14h76v82h-76z" class="paper back"/>
          <path d="M366 7h76v82h-76z" class="paper mid"/>
          <path d="M383 1h76v82h-76z" class="paper front"/>
          <path d="M396 22h45M396 38h51M396 54h37M396 70h43" class="paper-lines"/>
          <path d="M435 72v23" class="feed-line"/>
          <path d="m422 81 13 15 13-15" class="feed-arrow"/>
        </g>
        <g class="rag-machine">
          <path d="M318 92h190l-34 78H351z" class="hopper"/>
          <path d="M280 170h310v222H280z" class="machine-body"/>
          <path d="M304 194h262v174H304z" class="machine-screen"/>
          <circle cx="370" cy="278" r="47" class="gear"/>
          <circle cx="370" cy="278" r="13" class="gear-core"/>
          <circle cx="494" cy="278" r="47" class="gear"/>
          <circle cx="494" cy="278" r="13" class="gear-core"/>
          <path d="M413 278h38M432 259v38" class="signal"/>
          <path d="M314 392v30M556 392v30" class="machine-feet"/>
          <text x="435" y="343" text-anchor="middle" class="machine-label">RETRIEVE · RERANK · GROUND</text>
        </g>
        <g class="rag-answer">
          <path d="M590 255h55" class="feed-line"/>
          <path d="m625 241 22 14-22 14" class="feed-arrow"/>
          <path d="M646 139h112v164l-24 24h-88z" class="answer-paper"/>
          <path d="M734 303v-24h24" class="answer-fold"/>
          <path d="m672 177 12 12 26-30" class="answer-check"/>
          <path d="M671 220h62M671 240h51M671 260h58" class="answer-lines"/>
          <path d="M671 285h28" class="citation"/>
        </g>
        <text x="474" y="66" class="flow-label">DOCUMENTS IN</text>
        <text x="650" y="350" class="flow-label">ANSWER + SOURCES</text>
      </svg>
    `;
  }
  card.prepend(visual);
});
