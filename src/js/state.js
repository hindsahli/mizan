export const state = {
  prices: null,
  history: {
    gold: {
      currentPrice: 0,
      previousPrice: 0,
      priceChange: 0,
      percentageChange: 0,
      monthPrices: [],
      weekPrices: [],
    },
    silver: {
      currentPrice: 0,
      previousPrice: 0,
      priceChange: 0,
      percentageChange: 0,
      monthPrices: [],
      weekPrices: [],
    },
  },
  currency: "USD",
  exchangeRates: {
    MAD: 0,
    EUR: 0,
  },

  estimation: null,

  loading: false,
  error: null,
  lastUpdate: null,
};
