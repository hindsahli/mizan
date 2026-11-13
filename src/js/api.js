const url = "https://xaus.com/api/v1/spot";
const silverUrl =
  "https://xaus.com/api/v1/chart?symbol=silver&range=5y&interval=1d";
const goldUrl = "https://xaus.com/api/v1/history";

export async function fetchCurrentPrices() {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch prices");
    //Error is a built-in JavaScript object (This creates an error object with the message
  }

  const data = await response.json();

  return data;
}

export async function goldHistory() {
  const response = await fetch(goldUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch the gold history");
  }
  const data = await response.json();
  return data;
}

export async function silverHistory() {
  const response = await fetch(silverUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch the silver history");
  }
  const data = await response.json();
  return data;
}
