import { state } from "./state.js";

const statusIndicator = document.getElementById("status-indicator");
const statusMessage = document.getElementById("status-message");
const lastUpdate = document.getElementById("last-update");
const cards = document.getElementById("cards");

export function render() {
  renderStatus();
  renderMetalCards();
}

export function renderStatus() {
  if (state.loading) {
    statusIndicator.textContent = "Chargement";
    statusMessage.textContent = "Récupération des cours...";
    lastUpdate.textContent = "";
  } else if (state.error) {
    statusIndicator.textContent = "Erreur";
    statusMessage.textContent = "Impossible de récupérer les cours.";
    lastUpdate.textContent = "";
  } else {
    statusIndicator.textContent = "A jour";
    statusMessage.textContent = "les cours sont disponibles";
    lastUpdate.textContent = state.lastUpdate;
  }
}

export function renderMetalCards() {
  cards.innerHTML = "";

  if (!state.prices) {
    return;
  }

  const metals = [
    {
      metal: "OR",
      price: state.prices.xau.price,
      currency: state.prices.xau.currency,
    },
    {
      metal: "Argent",
      price: state.prices.silver_usd_oz,
      currency: "USD",
    },
  ];

  metals.forEach((metal) => {
    const card = document.createElement("div");
    const metalName = document.createElement("h3");
    const metalPrice = document.createElement("p");
    const metalcurrency = document.createElement("p");

    metalName.textContent = metal.metal;
    metalPrice.textContent = metal.price;
    metalcurrency.textContent = metal.currency;

    card.className = "bg-white border border-soft-beige rounded-lg p-6";
    metalName.className = "text-lg font-bold";
    metalPrice.className = "text-3xl font-bold";
    metalcurrency.className = "text-sm text-gray-500";

    card.append(metalName, metalPrice, metalcurrency);
    cards.appendChild(card);
  });
}


