import { state } from "./state.js";
import { fetchCurrentPrices, goldHistory, silverHistory } from "./api.js";
import { render } from "./render.js";
import {toGram } from "./calculator.js"

async function loadMetalsHistory(spotData) {
  const [goldData, silverData] = await Promise.all([
    goldHistory(),
    silverHistory(),
  ]);

  // Gold prices
  state.history.gold.currentPrice = Number(toGram(spotData.xau.price));

  state.history.gold.previousPrice = Number(toGram(
    goldData.points[goldData.points.length - 1].c,)
  );

  // Silver prices
  state.history.silver.currentPrice = Number(toGram(spotData.silver_usd_oz));

  state.history.silver.previousPrice = Number(toGram(
    silverData.points[silverData.points.length - 1].c,)
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
    const data = await fetchCurrentPrices();

    state.prices = data;
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

  loadPrices();
}

init();

