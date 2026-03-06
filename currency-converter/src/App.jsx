import React, { useState, useEffect } from "react"
import AmountInput from "./components/AmountInput"
import CurrencySelector from "./components/CurrencySelector"
import ConversionResult from "./components/ConversionResult"
import ExchangeRateInfo from "./components/ExchangeRateInfo"
import { fetchExchangeRates } from "./services/exchangeRateService"

function App() {

  const [amount, setAmount] = useState(1)
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("GHS")
  const [rates, setRates] = useState({})
  const [convertedAmount, setConvertedAmount] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Fetch exchange rates
  useEffect(() => {
    async function getRates() {
      try {
        const data = await fetchExchangeRates(fromCurrency)
        setRates(data.rates)
        setLastUpdated(data.time_last_update_utc)
      } catch (error) {
        alert("Failed to fetch exchange rates")
      }
    }

    getRates()
  }, [fromCurrency])

  // Calculate conversion
  useEffect(() => {
    if (rates[toCurrency]) {
      const result = amount * rates[toCurrency]
      setConvertedAmount(result)
    }
  }, [amount, toCurrency, rates])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Currency Converter
        </h1>

        <AmountInput amount={amount} setAmount={setAmount} />

        <div className="flex gap-4 my-4">
          <CurrencySelector
            label="From"
            currency={fromCurrency}
            setCurrency={setFromCurrency}
            currencies={Object.keys(rates)}
          />

          <CurrencySelector
            label="To"
            currency={toCurrency}
            setCurrency={setToCurrency}
            currencies={Object.keys(rates)}
          />
        </div>

        <ConversionResult
          amount={convertedAmount}
          currency={toCurrency}
        />

        <ExchangeRateInfo
          from={fromCurrency}
          to={toCurrency}
          rate={rates[toCurrency]}
          lastUpdated={lastUpdated}
        />

      </div>
    </div>
  )
}

export default App