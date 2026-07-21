"use strict";

const stylesheets = [
  "classic-light",
  "classic-dark",
];

// helper functions
function createHrefWithParam(name, value) {
  const locationURL = new URL(location.href);
  locationURL.searchParams.set(name, value);
  return locationURL.href;
}

// select stylesheet
const stylesheetParam = new URLSearchParams(location.search).get("stylesheet");
let selectedStylesheet;
if (stylesheetParam === null) {
  selectedStylesheet = stylesheets[Math.floor(Math.random() * stylesheets.length)];
} else if (stylesheets.includes(stylesheetParam)) {
  selectedStylesheet = stylesheetParam;
} else {
  selectedStylesheet = "--invalid";
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
  const stylesheetLinkHref = createHrefWithParam("stylesheet", selectedStylesheet);
  const stylesheetListHTML = stylesheets.map((stylesheet) => `
    <li class="info-panel__link-item">
      <a href="${createHrefWithParam("stylesheet", stylesheet)}">${stylesheet}</a>
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
