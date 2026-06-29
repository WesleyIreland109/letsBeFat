const navLinks = Array.from(document.querySelectorAll("[data-nav-link]"));
const sections = navLinks
  .map((link) => document.getElementById(link.dataset.navLink))
  .filter(Boolean);

function setActiveSection(sectionId) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.navLink === sectionId;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function updateActiveSection() {
  const headerHeight = document.querySelector(".site-header")?.offsetHeight || 0;
  const readingLine = headerHeight + window.innerHeight * 0.65;
  let activeSection = null;

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= readingLine) {
      activeSection = section;
    }
  });

  if (activeSection) {
    setActiveSection(activeSection.id);
  } else {
    navLinks.forEach((link) => {
      link.classList.remove("is-active");
      link.removeAttribute("aria-current");
    });
  }
}

function setActiveFromHash() {
  const sectionId = window.location.hash.replace("#", "");
  if (sections.some((section) => section.id === sectionId)) {
    setActiveSection(sectionId);
    return true;
  }

  return false;
}

let scrollFrame = null;
window.addEventListener(
  "scroll",
  () => {
    if (scrollFrame) {
      return;
    }

    scrollFrame = window.requestAnimationFrame(() => {
      updateActiveSection();
      scrollFrame = null;
    });
  },
  { passive: true }
);

window.addEventListener("load", () => {
  if (!setActiveFromHash()) {
    updateActiveSection();
  }
});

window.addEventListener("hashchange", () => {
  setActiveFromHash();
});
