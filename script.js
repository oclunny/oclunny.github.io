document.addEventListener("DOMContentLoaded", () => {
  const THEME_STORAGE_KEY = "oclunny-theme";

  /* ---------------- Theme toggle ---------------- */
  const toggleThemeButton = document.getElementById("toggletheme");
  const themeIcon = document.getElementById("themeicon");
  const prefersLightScheme = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: light)")
    : null;

  const applyTheme = (mode) => {
    const isLight = mode === "light";
    document.body.classList.toggle("light-theme", isLight);
    if (themeIcon) {
      themeIcon.className = isLight ? "fa-solid fa-moon" : "fa-solid fa-sun";
    }
    if (toggleThemeButton) {
      toggleThemeButton.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
      );
    }
  };

  const getStoredTheme = () => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  };

  const storeTheme = (value) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch (error) {
      // Storage might be unavailable (e.g., privacy mode). Fail silently.
    }
  };

  const initTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      applyTheme(storedTheme);
      return;
    }
    const prefersLight = prefersLightScheme ? prefersLightScheme.matches : false;
    applyTheme(prefersLight ? "light" : "dark");
  };

  const handleSystemChange = (event) => {
    if (getStoredTheme()) return;
    applyTheme(event.matches ? "light" : "dark");
  };

  if (toggleThemeButton && themeIcon) {
    toggleThemeButton.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("light-theme")
        ? "dark"
        : "light";
      applyTheme(nextTheme);
      storeTheme(nextTheme);
    });

    if (prefersLightScheme) {
      if (typeof prefersLightScheme.addEventListener === "function") {
        prefersLightScheme.addEventListener("change", handleSystemChange);
      } else if (typeof prefersLightScheme.addListener === "function") {
        prefersLightScheme.addListener(handleSystemChange);
      }
    }

    initTheme();
  }

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.getElementById("navtoggle");
  const primaryNav = document.getElementById("primary-nav");

  if (navToggle && primaryNav) {
    const closeNav = () => {
      primaryNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("click", (event) => {
      if (
        primaryNav.classList.contains("open") &&
        !primaryNav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        closeNav();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
  }

  /* ---------------- Smooth scroll for in-page links ---------------- */
  const smoothLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  smoothLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const hrefValue = link.getAttribute("href");
      if (!hrefValue) return;

      const targetId = hrefValue.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealTargets = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealTargets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }

  /* ---------------- Hero typing effect ---------------- */
  const heroHeading = document.querySelector(".terminal-output h1");
  const cursor = document.querySelector(".typed-cursor");

  if (
    heroHeading &&
    cursor &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const accentSpan = heroHeading.querySelector(".accent");
    const fullText = accentSpan ? accentSpan.textContent : "";
    if (accentSpan && fullText) {
      accentSpan.textContent = "";
      let index = 0;
      const typeNext = () => {
        if (index <= fullText.length) {
          accentSpan.textContent = fullText.slice(0, index);
          index += 1;
          setTimeout(typeNext, 55);
        }
      };
      typeNext();
    }
  }
});
