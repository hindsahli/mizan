import { state } from "./state.js";
import { toGram, calculateMetal, convertCurrency } from "./calculator.js";

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

  let currencySymbol = "";

  if (state.currency === "MAD") {
    currencySymbol = "MAD";
  } else if (state.currency === "EUR") {
    currencySymbol = "€";
  } else {
    currencySymbol = "USD";
  }

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

    const convertedPrice = convertCurrency(
      metal.currentPrice,
      state.currency,
      state.exchangeRates,
    );

    const convertedChange = convertCurrency(
      Math.abs(metal.priceChange),
      state.currency,
      state.exchangeRates,
    );

    metalName.textContent = metal.metal;

    percentage.textContent = `${arrow} ${sign}${metal.percentageChange.toFixed(2)} %`;

    price.textContent = `${convertedPrice.toFixed(2)} ${currencySymbol} / gram`;

    priceChange.textContent = `${priceArrow} ${priceSign}${convertedChange.toFixed(2)} ${currencySymbol} depuis hier`;

    update.textContent = `Mis à jour le ${state.lastUpdate}`;

    historyLink.textContent = "Voir l'historique";

    if (metal.metal === "Or") {
      historyLink.href = "#historique-metal";
    } else {
      historyLink.href = "#historique-metal";
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
const estimatorResult = document.getElementById("estimator-result");

export function renderMetalEstimation(weight, metal) {
  const estimationResultat = calculateMetal(weight, metal);

  const convertedPrice = convertCurrency(
    estimationResultat,
    state.currency,
    state.exchangeRates,
  );

  let currencySymbol = "";
  if (state.currency === "MAD") {
    currencySymbol = "MAD";
  } else if (state.currency === "EUR") {
    currencySymbol = "€";
  } else {
    currencySymbol = "USD";
  }

  estimatorResult.classList.remove("hidden");
  estimatorResult.innerHTML = "";

  const title = document.createElement("h3");
  const result = document.createElement("p");

  title.textContent = "Valeur estimée";

  result.textContent = `${convertedPrice.toFixed(2)} ${currencySymbol}`;

  title.className = "text-lg font-bold mb-2";
  result.className = "text-3xl font-bold text-gold";

  estimatorResult.append(title, result);
}

export function renderChart(prices) {
  const historyChart = document.getElementById("history-chart");

  historyChart.innerHTML = "";

  if (prices.length === 0) {
    return;
  }

  const convertedPrices = [];

  for (let i = 0; i < prices.length; i++) {
    let price = toGram(prices[i]);
    price = convertCurrency(price, state.currency, state.exchangeRates);
    convertedPrices.push(price);
  }

  const graph = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  graph.setAttribute("width", "100%");
  graph.setAttribute("height", "350");
  graph.setAttribute("viewBox", "0 0 600 350");
  graph.setAttribute("preserveAspectRatio", "none");

  historyChart.appendChild(graph);

  const left = 60;
  const bottom = 300;
  const top = 20;
  const right = 590;

  const maxPrice = Math.max(...convertedPrices);
  const step = Math.ceil(maxPrice / 5);
  const maxValue = step * 5;

  const space = (right - left) / prices.length;
  const barWidth = space * 0.6;

  const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");

  yAxis.setAttribute("x1", left);
  yAxis.setAttribute("y1", top);
  yAxis.setAttribute("x2", left);
  yAxis.setAttribute("y2", bottom);
  yAxis.setAttribute("stroke", "black");

  graph.appendChild(yAxis);

  const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");

  xAxis.setAttribute("x1", left);
  xAxis.setAttribute("y1", bottom);
  xAxis.setAttribute("x2", right);
  xAxis.setAttribute("y2", bottom);
  xAxis.setAttribute("stroke", "black");

  graph.appendChild(xAxis);

  for (let i = 0; i <= 5; i++) {
    const value = i * step;
    const y = bottom - (value / maxValue) * (bottom - top);

    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );

    label.setAttribute("x", left - 10);
    label.setAttribute("y", y + 4);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("font-size", "11");
    label.textContent = value.toFixed(2);

    graph.appendChild(label);
  }

  for (let i = 0; i < convertedPrices.length; i++) {
    const height = (convertedPrices[i] / maxValue) * (bottom - top);

    const x = left + i * space + (space - barWidth) / 2;
    const y = bottom - height;

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", barWidth);
    rect.setAttribute("height", height);
    rect.setAttribute("fill", "#6C001B");

    graph.appendChild(rect);

    const day = document.createElementNS("http://www.w3.org/2000/svg", "text");

    day.setAttribute("x", x + barWidth / 2);
    day.setAttribute("y", bottom + 20);
    day.setAttribute("text-anchor", "middle");
    day.setAttribute("font-size", prices.length === 30 ? "8" : "10");

    if (prices.length === 30) {
      day.textContent = i + 1;
    } else {
      day.textContent = `Day ${i + 1}`;
    }

    graph.appendChild(day);
  }
}
