import { state } from "./state.js";
import {
  fetchCurrentPrices,
  goldHistory,
  silverHistory,
  fetchExchangeRates,
} from "./api.js";
import { render, renderMetalEstimation, renderChart } from "./render.js";
import {
  toGram,
  goldWeekPrices,
  goldMonthPrices,
  silverWeekPrices,
  silverMonthPrices,
} from "./calculator.js";
import { saveCurrency, loadCurrency } from "./storage.js";

const estimatorForm = document.getElementById("estimator-form");
const currencySelect = document.getElementById("currency-select");
const historyMetal = document.getElementById("history-metal");
const history7Days = document.getElementById("history-7-days");
const history30Days = document.getElementById("history-30-days");

let historyPeriod = "week";

async function loadMetalsHistory(spotData) {
  const [goldData, silverData] = await Promise.all([
    goldHistory(),
    silverHistory(),
  ]);

  state.history.gold.currentPrice = Number(toGram(spotData.xau.price));

  state.history.gold.previousPrice = Number(
    toGram(goldData.points[goldData.points.length - 1].c),
  );

  state.history.silver.currentPrice = Number(toGram(spotData.silver_usd_oz));

  state.history.silver.previousPrice = Number(
    toGram(silverData.points[silverData.points.length - 1].c),
  );

  state.history.gold.priceChange =
    state.history.gold.currentPrice - state.history.gold.previousPrice;

  state.history.silver.priceChange =
    state.history.silver.currentPrice - state.history.silver.previousPrice;

  state.history.gold.percentageChange =
    (state.history.gold.priceChange / state.history.gold.previousPrice) * 100;

  state.history.silver.percentageChange =
    (state.history.silver.priceChange / state.history.silver.previousPrice) *
    100;

  state.history.gold.weekPrices = goldWeekPrices(goldData);
  state.history.gold.monthPrices = goldMonthPrices(goldData);

  state.history.silver.weekPrices = silverWeekPrices(silverData);
  state.history.silver.monthPrices = silverMonthPrices(silverData);
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
    updateHistoryChart();
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

  state.currency = loadCurrency();

  currencySelect.value = state.currency;

  refreshButton.addEventListener("click", () => {
    location.reload();
  });
  retryButton.addEventListener("click", loadPrices);

  currencySelect.addEventListener("change", () => {
    state.currency = currencySelect.value;
    saveCurrency(state.currency);

    render();
    updateHistoryChart();

    if (state.estimation !== null) {
      calculateEstimation();
    }
  });

  loadPrices();
  history7Days.addEventListener("click", () => {
    historyPeriod = "week";
    updateHistoryChart();
  });

  history30Days.addEventListener("click", () => {
    historyPeriod = "month";
    updateHistoryChart();
  });

  historyMetal.addEventListener("change", updateHistoryChart);
}

function calculateEstimation() {
  const weight = state.estimation.weight;
  const metal = state.estimation.metal;

  if (metal === "gold") {
    renderMetalEstimation(weight, state.prices.xau.price);
  } else {
    renderMetalEstimation(weight, state.prices.silver_usd_oz);
  }
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

  if (weightInput.value === "" || weight <= 0) {
    weightError.textContent = "Veuillez entrer un poids valide.";
    return;
  }

  if (!state.prices) {
    weightError.textContent = "Les cours ne sont pas encore disponibles.";
    return;
  }

  if (
    state.currency !== "USD" &&
    state.exchangeRates[state.currency] === undefined
  ) {
    weightError.textContent = "Le taux de change est indisponible.";
    return;
  }

  state.estimation = {
    weight: weight,
    metal: metal,
  };

  calculateEstimation();
});

function updateHistoryChart() {
  let prices = [];

  if (historyMetal.value === "gold") {
    if (historyPeriod === "week") {
      prices = state.history.gold.weekPrices;
    } else {
      prices = state.history.gold.monthPrices;
    }
  } else {
    if (historyPeriod === "week") {
      prices = state.history.silver.weekPrices;
    } else {
      prices = state.history.silver.monthPrices;
    }
  }

  if (prices.length > 0) {
    renderChart(prices);
  }
}
