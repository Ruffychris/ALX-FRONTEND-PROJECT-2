const BASE_URL = "https://open.er-api.com/v6/latest"

export async function fetchExchangeRates(baseCurrency) {
  try {
    const response = await fetch(`${BASE_URL}/${baseCurrency}`)
    const data = await response.json()

    if (data.result !== "success") {
      throw new Error("Failed to fetch exchange rates")
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}