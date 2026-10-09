/* North Star Bakery | Touchstone 4 client-side interactions */
"use strict";
const bakeryProducts = [
  {id: "signature-loaf", label: "Signature Loaf"},
  {id: "seasonal-pastry", label: "Seasonal Pastry"},
  {id: "celebration-cake", label: "Celebration Cake"},
  {id: "cookies", label: "Cookies"}
];
const storageKey = "northStarBakeryFavorites";
let favorites = [];

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(saved) ? saved.filter(id => bakeryProducts.some(item => item.id === id)) : [];
  } catch (error) { return []; }
}
function saveFavorites() {
  try { localStorage.setItem(storageKey, JSON.stringify(favorites)); }
  catch (error) { document.getElementById("favorites-summary").textContent = "Favorites cannot be saved in this browser."; }
}
function renderFavorites() {
  const options = document.getElementById("favorite-options");
  if (!options) return;
  options.replaceChildren();
  bakeryProducts.forEach(product => {
    const selected = favorites.includes(product.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "favorite-toggle";
    button.setAttribute("aria-pressed", String(selected));
    button.textContent = `${selected ? "♥" : "♡"} ${product.label}`;
    button.addEventListener("click", () => toggleFavorite(product.id));
    options.appendChild(button);
  });
  const selectedNames = bakeryProducts.filter(p => favorites.includes(p.id)).map(p => p.label);
  document.getElementById("favorites-summary").textContent = selectedNames.length
    ? `Saved favorites (${selectedNames.length}): ${selectedNames.join(", ")}`
    : "No favorites saved yet. Choose a treat above!";
}
function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
  saveFavorites();
  renderFavorites();
}
function initializeFavorites() {
  if (!document.getElementById("favorite-options")) return;
  favorites = loadFavorites();
  renderFavorites();
  document.getElementById("clear-favorites").addEventListener("click", () => {
    favorites = []; saveFavorites(); renderFavorites();
  });
}
const validationRules = {
  name: value => value.length < 2 ? "Enter your name (at least 2 characters)." : "",
  email: value => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Enter a valid email address." : "",
  "pickup-date": value => !value ? "Choose a pickup date." : value < new Date().toLocaleDateString("en-CA") ? "Choose today or a future date." : "",
  "request-type": value => !value ? "Choose a request type." : "",
  "item-details": value => value.length < 5 ? "Enter at least 5 characters about your request." : ""
};
function validateField(field) {
  const value = field.value.trim();
  const error = validationRules[field.id](value);
  document.getElementById(`${field.id}-error`).textContent = error;
  field.setAttribute("aria-invalid", String(Boolean(error)));
  field.setAttribute("aria-describedby", `${field.id}-error`);
  return !error;
}
function initializeForm() {
  const form = document.getElementById("inquiry-form");
  if (!form) return;
  const fields = Object.keys(validationRules).map(id => document.getElementById(id));
  fields.forEach(field => {
    field.addEventListener("input", () => { if (field.getAttribute("aria-invalid") === "true") validateField(field); });
    field.addEventListener("change", () => validateField(field));
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const results = fields.map(validateField);
    const valid = results.every(Boolean);
    document.getElementById("form-status").textContent = valid
      ? "Your details look good! This is a demonstration form; no inquiry was sent."
      : "Please correct the highlighted fields before continuing.";
    if (!valid) fields[results.indexOf(false)].focus();
  });
}
document.addEventListener("DOMContentLoaded", () => { initializeFavorites(); initializeForm(); });
