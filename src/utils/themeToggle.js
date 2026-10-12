// The one place the theme changes. Day is data-theme="light", Dusk is data-theme="dark".
// First paint (and every client-side navigation) is set by ThemeInit.astro's inline script:
// the saved choice, else the system setting. This module only switches and labels.
const NAMES = { light: "Day", dark: "Dusk" };

export function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export function toggleTheme() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {}
  labelThemeToggles();
}

// Every theme button is a plain <button data-theme-toggle>; its name says where it goes.
export function labelThemeToggles() {
  const other = currentTheme() === "dark" ? "light" : "dark";
  for (const button of document.querySelectorAll("[data-theme-toggle]")) {
    button.setAttribute("aria-label", `Switch to ${NAMES[other]}`);
  }
}

// Called once from Layout. Delegated, so buttons work after client-side navigation too.
export function bindThemeToggles() {
  document.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("[data-theme-toggle]")) toggleTheme();
  });
  document.addEventListener("astro:page-load", labelThemeToggles);
  labelThemeToggles();
}
