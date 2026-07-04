"use strict";

const stylesheets = [
  "classic",
  "dark",
];

// select stylesheet
const stylesheetParam = new URLSearchParams(location.search).get("stylesheet");
let selectedStylesheet;
if (stylesheetParam === null) {
  selectedStylesheet = stylesheets[Math.floor(Math.random() * stylesheets.length)];
} else if (stylesheets.includes(stylesheetParam)) {
  selectedStylesheet = stylesheetParam;
} else {
  selectedStylesheet = "_invalid";
}

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

// DOMContentLoaded for dom manipulation
document.addEventListener("DOMContentLoaded", () => {

  // insert info panel content
  const stylesheetLinkURL = new URL(location.href);
  stylesheetLinkURL.searchParams.set("stylesheet", selectedStylesheet);
  const stylesheetListHTML = stylesheets.map((stylesheet) => {
    const stylesheetLinkURL = new URL(location.href);
    stylesheetLinkURL.searchParams.set("stylesheet", stylesheet);
    return `
      <li class="info-panel__list-item">
        <a href="${stylesheetLinkURL.href}" class="info-panel__link">
          <code class="info-panel__code">${stylesheet}</code>
        </a>
      </li>
    `;
  }).join("");
  document.getElementById("js-stylesheet-name").textContent = selectedStylesheet;
  document.getElementById("js-stylesheet-link").href = stylesheetLinkURL.href;
  document.getElementById("js-stylesheet-link").textContent = stylesheetLinkURL.href;
  document.getElementById("js-stylesheet-list").innerHTML = stylesheetListHTML;

  // secret!
  const recurseCount = parseInt(new URLSearchParams(location.search).get("recurse")) || 0;
  const recurseLinkURL = new URL(location.href);
  recurseLinkURL.searchParams.set("recurse", recurseCount + 1);
  document.getElementById("js-recurse-link").href = recurseLinkURL.href;
  if (recurseCount >= 42) {
    document.body.classList.add("secret-active");
  }

});
