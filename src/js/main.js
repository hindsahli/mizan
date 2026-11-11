import { state } from "./state.js";
import { fetchCurrentPrices } from "./api.js";
import { render } from "./render.js";
import { loadCurrency, saveCurrency } from "./storage.js";


async function loadPrices() {
  state.loading = true;
  state.error = null;

  render();

  try {
    const data = await fetchCurrentPrices();
    state.prices = data;
    state.lastUpdate = data.updated_at;

    state.loading = false;
    render();
    
  } catch (error) {
    state.error = error.message;
    state.loading = false;
    render();
  }
}



function init() {
  const currencySelect = document.getElementById("currency-select");
  const refreshButton = document.getElementById("refresh-button");
  const retryButton = document.getElementById("retry-button");

  state.currency = loadCurrency();
  currencySelect.value = state.currency;

  currencySelect.addEventListener("change", () => {
    state.currency = currencySelect.value;
    saveCurrency(state.currency);
  });
  refreshButton.addEventListener("click", loadPrices);
  retryButton.addEventListener("click", loadPrices);

  loadPrices();
}

init();
