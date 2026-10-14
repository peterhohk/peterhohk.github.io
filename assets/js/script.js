"use strict";

const stylesheets = [
  "classic",
  "command-line",
  "whitespace",
];

// helper functions
function createHrefWithParam(name, value) {
  const locationURL = new URL(location.href);
  locationURL.searchParams.set(name, value);
  return locationURL.href;
}
function setTheme(newTheme) {
  activeTheme = newTheme;
  if (newTheme === "light" || newTheme === "dark") {
    document.documentElement.dataset.theme = newTheme;
  } else {
    delete document.documentElement.dataset.theme;
  }
  sessionStorage.setItem("lastTheme", newTheme);
}
function updateThemeDisplay() {
  document.getElementById("js-theme-name").textContent = activeTheme;
  document.querySelectorAll(".js-theme-switcher-button").forEach((el) => {
    if (el.dataset.value === activeTheme) {
      el.dataset.isActive = "";
    } else {
      delete el.dataset.isActive;
    }
  });
}

// select stylesheet
const stylesheetParam = new URLSearchParams(location.search).get("stylesheet");
const lastStylesheet = sessionStorage.getItem("lastStylesheet");
let selectedStylesheet;
if (stylesheetParam === null) {
  const eligibleStylesheets = lastStylesheet !== null ? stylesheets.filter((s) => s !== lastStylesheet) : stylesheets;
  selectedStylesheet = eligibleStylesheets[Math.floor(Math.random() * eligibleStylesheets.length)];
} else if (stylesheets.includes(stylesheetParam)) {
  selectedStylesheet = stylesheetParam;
} else {
  selectedStylesheet = "--invalid";
}
sessionStorage.setItem("lastStylesheet", selectedStylesheet);

// inject selected stylesheet into document, hiding document until done
document.documentElement.style.setProperty("visibility", "hidden");
const linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.href = `./assets/css/${selectedStylesheet}.css`;
linkElement.addEventListener("load", () => {
  document.documentElement.style.removeProperty("visibility");
});
linkElement.addEventListener("error", () => {
  document.documentElement.style.removeProperty("visibility");
});
document.head.appendChild(linkElement);

// apply theme
const lastTheme = sessionStorage.getItem("lastTheme") ?? "default";
let activeTheme = lastTheme;
setTheme(activeTheme);

// DOMContentLoaded for dom manipulation
document.addEventListener("DOMContentLoaded", () => {

  // set up theme switcher
  updateThemeDisplay();
  document.querySelectorAll(".js-theme-switcher-button").forEach((el) => {
    el.addEventListener("click", (event) => {
      const theme = event.target.dataset.value;
      setTheme(theme);
      updateThemeDisplay();
    });
  });

  // insert info panel content
  const stylesheetLinkHref = createHrefWithParam("stylesheet", selectedStylesheet);
  const stylesheetListHTML = stylesheets.map((stylesheet) => `
    <li class="info-panel__link-item">
      <a href="${createHrefWithParam("stylesheet", stylesheet)}" class="info-panel__link">${stylesheet}</a>
    </li>
  `).join("");
  document.getElementById("js-stylesheet-name").textContent = selectedStylesheet;
  document.getElementById("js-stylesheet-link").href = stylesheetLinkHref;
  document.getElementById("js-stylesheet-link").textContent = stylesheetLinkHref;
  document.getElementById("js-stylesheet-link-list").innerHTML = stylesheetListHTML;

  // secret!
  const recurseCount = parseInt(new URLSearchParams(location.search).get("recurse")) || 0;
  const recurseLinkURL = createHrefWithParam("recurse", recurseCount + 1);
  document.getElementById("js-recurse-link").href = recurseLinkURL;
  if (recurseCount >= 42) {
    document.body.classList.add("secret-active");
  }

});
