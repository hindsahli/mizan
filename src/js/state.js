
export const state = {
  prices : null ,
  history: {
    gold: {
      currentPrice: 0,
      previousPrice: 0,
      priceChange: 0,
      percentageChange: 0,
    },
    silver: {
      currentPrice: 0,
      previousPrice: 0,
      priceChange: 0,
      percentageChange: 0,
    },
  },
  currency: "USD",
  loading: false,
  error: null,
  lastUpdate: null,
};