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

// silverData.points[silverData.points.length - 1].c;
// goldData.points[goldData.points.length - 1].c;

export function goldWeekPrices(goldData) {
  let weekPrices = [];

  for (let i = 1 ; i <= 7; i++) {
    weekPrices.push(goldData.points[goldData.points.length - i].c);
  }
  return weekPrices.reverse();
}

export function goldMonthPrices(goldData) {
  let monthPrices = [];

  for (let i = 1; i <= 30; i++) {
    monthPrices.push(goldData.points[goldData.points.length - i].c);
  }
  return monthPrices.reverse();
}

export function silverWeekPrices(silverData) {
  let weekPrices = [];

  for (let i = 1; i <= 7; i++) {
    weekPrices.push(silverData.points[silverData.points.length - i].c);
  }
  return weekPrices.reverse();
}

export function silverMonthPrices(silverData) {
  let monthPrices = [];

  for (let i = 1; i <= 30; i++) {
    monthPrices.push(silverData.points[silverData.points.length - i].c);
  }
  return monthPrices.reverse();
}
