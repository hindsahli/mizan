const url = "https://xaus.com/api/v1/spot?currency=MAD";

export async function fetchCurrentPrices() {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch prices");
    //Error is a built-in JavaScript object (This creates an error object with the message
  }

  const data = await response.json();

  return data;
}
