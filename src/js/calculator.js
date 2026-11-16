export function toGram(price) {
  const gram = price / 31.1035;
  return gram;
}

export function calculateMetal(poid, metal) {
  let valeur = poid * metal;
  return toGram(valeur);
}

export function convertCurrency(price, currency, exchangeRates) {
  let exchangeRate = 1;

  if (currency === "MAD") {
    exchangeRate = exchangeRates.MAD;
  } else if (currency === "EUR") {
    exchangeRate = exchangeRates.EUR;
  }

  return price * exchangeRate;
}
