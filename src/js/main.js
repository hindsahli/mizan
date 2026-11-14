import { state } from "./state.js";
import {
  fetchCurrentPrices,
  goldHistory,
  silverHistory,
  fetchExchangeRates,
} from "./api.js";
import { render, renderMetalEstimation } from "./render.js";
import { toGram } from "./calculator.js";

const estimatorForm = document.getElementById("estimator-form");
const currencySelect = document.getElementById("currency-select");

async function loadMetalsHistory(spotData) {
  const [goldData, silverData] = await Promise.all([
    goldHistory(),
    silverHistory(),
  ]);

  // Gold prices
  state.history.gold.currentPrice = Number(toGram(spotData.xau.price));

  state.history.gold.previousPrice = Number(
    toGram(goldData.points[goldData.points.length - 1].c),
  );

  // Silver prices
  state.history.silver.currentPrice = Number(toGram(spotData.silver_usd_oz));

  state.history.silver.previousPrice = Number(
    toGram(silverData.points[silverData.points.length - 1].c),
  );

  // Calculate price changes
  state.history.gold.priceChange =
    state.history.gold.currentPrice - state.history.gold.previousPrice;

  state.history.silver.priceChange =
    state.history.silver.currentPrice - state.history.silver.previousPrice;

  // Calculate percentage changes
  state.history.gold.percentageChange =
    (state.history.gold.priceChange / state.history.gold.previousPrice) * 100;

  state.history.silver.percentageChange =
    (state.history.silver.priceChange / state.history.silver.previousPrice) *
    100;
}

async function loadPrices() {
  state.loading = true;
  state.error = null;

  render();

  try {
    const [data, exchangeData] = await Promise.all([
      fetchCurrentPrices(),
      fetchExchangeRates(),
    ]);

    state.prices = data;
    state.exchangeRates = exchangeData.rates;
    state.lastUpdate = data.updated_at;

    await loadMetalsHistory(data);

    state.loading = false;
    render();
  } catch (error) {
    state.error = error.message;
    state.loading = false;
    render();

    console.error(error);
  }
}

function init() {
  const refreshButton = document.getElementById("refresh-button");
  const retryButton = document.getElementById("retry-button");

  refreshButton.addEventListener("click", loadPrices);
  retryButton.addEventListener("click", loadPrices);

  currencySelect.addEventListener("change", () => {
    state.currency = currencySelect.value;
    render();
  });

  loadPrices();
}

init();

estimatorForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const weightInput = document.getElementById("weight-input");
  const metalSelect = document.getElementById("estimator-metal");
  const weightError = document.getElementById("weight-error");

  const weight = Number(weightInput.value);
  const metal = metalSelect.value;

  weightError.textContent = "";

  if (!weightInput.value || weight <= 0) {
    weightError.textContent = "Veuillez entrer un poids valide.";
    return;
  }

  if (!state.prices) {
    weightError.textContent = "Les cours ne sont pas encore disponibles.";
    return;
  }

  if (metal === "gold") {
    renderMetalEstimation(weight, state.prices.xau.price);
  } else {
    renderMetalEstimation(weight, state.prices.silver_usd_oz);
  }
});
