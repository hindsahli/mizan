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
    statusMessage.textContent = "Les cours sont disponibles";
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
      metal: "Or",
      currentPrice: state.history.gold.currentPrice,
      percentageChange: state.history.gold.percentageChange,
      priceChange: state.history.gold.priceChange,
    },
    {
      metal: "Argent",
      currentPrice: state.history.silver.currentPrice,
      percentageChange: state.history.silver.percentageChange,
      priceChange: state.history.silver.priceChange,
    },
  ];

  metals.forEach((metal) => {
    const card = document.createElement("div");
    const metalName = document.createElement("h3");
    const percentage = document.createElement("p");
    const price = document.createElement("p");
    const priceChange = document.createElement("p");
    const update = document.createElement("p");
    const historyLink = document.createElement("a");

    let arrow = "";
    let sign = "";

    if (metal.percentageChange >= 0) {
      percentage.classList.add("text-green-500");
      arrow = "▲";
      sign = "+";
    } else {
      percentage.classList.add("text-red-500");
      arrow = "▼";
    }

    let priceArrow = "";
    let priceSign = "";

    if (metal.priceChange >= 0) {
      priceChange.classList.add("text-green-500");
      priceArrow = "▲";
      priceSign = "+";
    } else {
      priceChange.classList.add("text-red-500");
      priceArrow = "▼";
    }

    metalName.textContent = metal.metal;

    percentage.textContent = `${arrow} ${sign}${metal.percentageChange.toFixed(2)} %`;

    price.textContent = `${metal.currentPrice.toFixed(2)} USD / gram`;

    priceChange.textContent = `${priceArrow} ${priceSign}${metal.priceChange.toFixed(2)} USD depuis hier`;

    update.textContent = `Mis à jour le ${state.lastUpdate}`;

    historyLink.textContent = "Voir l'historique";

    if (metal.metal === "Or") {
      historyLink.href = "#historique-or";
    } else {
      historyLink.href = "#historique-argent";
    }

    card.className =
      "bg-white border border-soft-beige rounded-lg p-6 flex flex-col gap-3";

    metalName.className = "text-xl font-bold";

    price.className = "text-3xl font-bold";

    update.className = "text-sm text-gray-500";
    historyLink.className = "text-sm font-semibold underline";

    card.append(metalName, percentage, price, priceChange, update, historyLink);

    cards.appendChild(card);
  });
}
