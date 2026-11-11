export function saveCurrency(currency) {
  localStorage.setItem("currency", currency);
}

export function loadCurrency() {
  const currency = localStorage.getItem("currency");

  if (currency === "MAD" || currency === "USD" || currency === "EUR") {
    return currency;
  }

  return "MAD";
}